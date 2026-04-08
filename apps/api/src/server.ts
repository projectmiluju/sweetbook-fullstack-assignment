import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import { pinoHttp } from "pino-http";

import { logger } from "./lib/logger.js";

import { getEnv, loadEnv } from "./config/env.js";
import { getPrisma } from "./lib/prisma.js";
import { orchestrateBook, OrchestrationError } from "./lib/orchestrate-book.js";
import type { OrchestrationInput } from "./lib/orchestrate-book.js";
import { createSweetBookClient } from "./lib/sweetbook-api.js";
import type { OrderShipping } from "./lib/sweetbook-api.js";

dotenv.config({ path: "../../.env" });

const env = loadEnv();
const app = express();
const port = env.PORT;

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// 진행 중인 책 생성 요청을 추적 (중복 요청 차단)
const inProgressKeys = new Set<string>();

app.use(cors());
app.use(pinoHttp({ logger }));
app.use(express.json());

app.get("/health", (_request: Request, response: Response) => {
  response.json({ ok: true });
});

app.get("/api/cohorts", async (_request: Request, response: Response) => {
  try {
    const db = getPrisma();
    const cohorts = await db.cohort.findMany({ orderBy: { createdAt: "asc" } });
    const cohortsWithCount = await Promise.all(
      cohorts.map(async (cohort: { id: string; name: string; program: string; graduationDate: Date; summary: string; tagline: string }) => {
        const studentCount = await db.student.count({ where: { cohortId: cohort.id } });
        return {
          id: cohort.id,
          name: cohort.name,
          program: cohort.program,
          graduationDate: formatDate(cohort.graduationDate),
          summary: cohort.summary,
          tagline: cohort.tagline,
          studentCount,
        };
      })
    );
    response.json({ cohorts: cohortsWithCount });
  } catch (error) {
    logger.error({ error }, "기수 목록 조회에 실패했습니다.");
    response.status(500).json({ message: "기수 목록 조회에 실패했습니다." });
  }
});

app.get("/api/cohorts/:id", async (request: Request, response: Response) => {
  try {
    const cohortId = request.params.id as string;
    const cohort = await getPrisma().cohort.findUnique({
      where: { id: cohortId },
    });

    if (!cohort) {
      response.status(404).json({ message: "기수를 찾을 수 없습니다." });
      return;
    }

    const db = getPrisma();
    const students = await db.student.findMany({
      where: { cohortId },
      orderBy: { createdAt: "asc" },
    });

    const studentsWithCount = await Promise.all(
      students.map(async (s: { id: string; name: string; roleTrack: string; bio: string }) => {
        const projectCount = await db.project.count({ where: { studentId: s.id } });
        const firstProject = await db.project.findFirst({ where: { studentId: s.id }, orderBy: { createdAt: "asc" } });
        return {
          id: s.id,
          name: s.name,
          roleTrack: s.roleTrack,
          bio: s.bio,
          projectCount,
          primaryProjectTitle: firstProject?.title ?? "대표 프로젝트 준비 중",
        };
      })
    );

    response.json({
      cohort: {
        id: cohort.id,
        name: cohort.name,
        program: cohort.program,
        graduationDate: formatDate(cohort.graduationDate),
        summary: cohort.summary,
        tagline: cohort.tagline,
        operatorMessage: cohort.operatorMessage,
        philosophy: cohort.philosophy,
        logoUrl: cohort.logoUrl,
        photos: cohort.photos,
        partnerInfo: cohort.partnerInfo,
        stats: cohort.stats,
        studentCount: studentsWithCount.length,
        students: studentsWithCount,
      },
    });
  } catch (error) {
    logger.error({ error }, "기수 상세 조회에 실패했습니다.");
    response.status(500).json({ message: "기수 상세 조회에 실패했습니다." });
  }
});

app.post("/api/cohorts", async (request: Request, response: Response) => {
  try {
    const { name, program, graduationDate, summary, tagline, ...rest } = request.body as {
      name?: string;
      program?: string;
      graduationDate?: string;
      summary?: string;
      tagline?: string;
      operatorMessage?: string;
      philosophy?: string;
      logoUrl?: string;
      photos?: string[];
      partnerInfo?: string;
      stats?: { demoCount?: number; projectCount?: number; participantCount?: number };
    };

    if (!name || !program || !graduationDate || !summary || !tagline) {
      response.status(400).json({ message: "name, program, graduationDate, summary, tagline이 필요합니다." });
      return;
    }

    const db = getPrisma();
    const cohort = await db.cohort.create({
      data: {
        name,
        program,
        graduationDate: new Date(graduationDate),
        summary,
        tagline,
        operatorMessage: rest.operatorMessage,
        philosophy: rest.philosophy,
        logoUrl: rest.logoUrl,
        photos: rest.photos ?? [],
        partnerInfo: rest.partnerInfo,
        stats: rest.stats,
      },
    });

    response.status(201).json({ cohort: { ...cohort, graduationDate: formatDate(cohort.graduationDate) } });
  } catch (error) {
    logger.error({ error }, "기수 생성에 실패했습니다.");
    response.status(500).json({ message: "기수 생성에 실패했습니다." });
  }
});

app.patch("/api/cohorts/:id", async (request: Request, response: Response) => {
  try {
    const cohortId = request.params.id as string;
    const db = getPrisma();

    const existing = await db.cohort.findUnique({ where: { id: cohortId } });
    if (!existing) {
      response.status(404).json({ message: "기수를 찾을 수 없습니다." });
      return;
    }

    const body = request.body as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    const allowedFields = ["name", "program", "summary", "tagline", "operatorMessage", "philosophy", "logoUrl", "photos", "partnerInfo", "stats"];
    for (const field of allowedFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }
    if (body.graduationDate !== undefined) {
      data.graduationDate = new Date(body.graduationDate as string);
    }

    const cohort = await db.cohort.update({ where: { id: cohortId }, data });
    response.json({ cohort: { ...cohort, graduationDate: formatDate(cohort.graduationDate) } });
  } catch (error) {
    logger.error({ error }, "기수 수정에 실패했습니다.");
    response.status(500).json({ message: "��수 수정에 실패했습니다." });
  }
});

app.delete("/api/cohorts/:id", async (request: Request, response: Response) => {
  try {
    const cohortId = request.params.id as string;
    const db = getPrisma();

    const existing = await db.cohort.findUnique({ where: { id: cohortId } });
    if (!existing) {
      response.status(404).json({ message: "기수�� 찾을 수 없습니다." });
      return;
    }

    await db.cohort.delete({ where: { id: cohortId } });
    response.status(204).send();
  } catch (error) {
    logger.error({ error }, "기수 삭제에 실패했습니다.");
    response.status(500).json({ message: "기수 삭제에 실패했습니다." });
  }
});

app.get("/api/students/:id", async (request: Request, response: Response) => {
  try {
    const studentId = request.params.id as string;
    const student = await getPrisma().student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      response.status(404).json({ message: "수료생을 찾을 수 없습니다." });
      return;
    }

    const projects = await getPrisma().project.findMany({
      where: { studentId },
      orderBy: { createdAt: "asc" },
    });

    response.json({
      student: {
        id: student.id,
        name: student.name,
        roleTrack: student.roleTrack,
        bio: student.bio,
        techStack: student.techStack,
        mentorComment: student.mentorComment,
        photos: student.photos,
        certificateMessage: student.certificateMessage,
        retrospective: student.retrospective,
        interests: student.interests,
        achievements: student.achievements,
        portfolioLinks: student.portfolioLinks,
        thanksMessage: student.thanksMessage,
        projects: projects.map((p: { id: string; title: string; summary: string; contribution: string; links: string[]; problem: string | null; solution: string | null; techChoices: string[]; result: string | null }) => ({
          id: p.id,
          title: p.title,
          summary: p.summary,
          contribution: p.contribution,
          links: p.links,
          problem: p.problem,
          solution: p.solution,
          techChoices: p.techChoices,
          result: p.result,
        })),
      },
    });
  } catch (error) {
    logger.error({ error }, "수료생 상세 조회에 실패했습니다.");
    response.status(500).json({ message: "수료생 상세 조회에 실패했습니다." });
  }
});

// --- Student CRUD (#78) ---

app.post("/api/cohorts/:cohortId/students", async (request: Request, response: Response) => {
  try {
    const cohortId = request.params.cohortId as string;
    const db = getPrisma();

    const cohort = await db.cohort.findUnique({ where: { id: cohortId } });
    if (!cohort) {
      response.status(404).json({ message: "기수를 찾을 수 없습니다." });
      return;
    }

    const { name, roleTrack, bio, techStack, mentorComment, photos, certificateMessage, ...rest } = request.body as {
      name?: string;
      roleTrack?: string;
      bio?: string;
      techStack?: string[];
      mentorComment?: string;
      photos?: string[];
      certificateMessage?: string;
      retrospective?: { before?: string; process?: string; turning?: string; difficulty?: string; overcome?: string; learned?: string };
      interests?: string[];
      achievements?: string;
      portfolioLinks?: { github?: string; blog?: string; email?: string; demo?: string };
      thanksMessage?: string;
    };

    if (!name || !roleTrack || !bio || !mentorComment || !certificateMessage) {
      response.status(400).json({ message: "name, roleTrack, bio, mentorComment, certificateMessage가 필요합니다." });
      return;
    }

    const student = await db.student.create({
      data: {
        cohortId,
        name,
        roleTrack,
        bio,
        techStack: techStack ?? [],
        mentorComment,
        photos: photos ?? [],
        certificateMessage,
        retrospective: rest.retrospective,
        interests: rest.interests ?? [],
        achievements: rest.achievements,
        portfolioLinks: rest.portfolioLinks,
        thanksMessage: rest.thanksMessage,
      },
    });

    response.status(201).json({ student });
  } catch (error) {
    logger.error({ error }, "수료생 생성에 실패했습니다.");
    response.status(500).json({ message: "수료생 생성에 실패했습니다." });
  }
});

app.patch("/api/students/:id", async (request: Request, response: Response) => {
  try {
    const studentId = request.params.id as string;
    const db = getPrisma();

    const existing = await db.student.findUnique({ where: { id: studentId } });
    if (!existing) {
      response.status(404).json({ message: "수료생을 찾을 수 없습니다." });
      return;
    }

    const body = request.body as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    const allowedFields = ["name", "roleTrack", "bio", "techStack", "mentorComment", "photos", "certificateMessage", "retrospective", "interests", "achievements", "portfolioLinks", "thanksMessage"];
    for (const field of allowedFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    const student = await db.student.update({ where: { id: studentId }, data });
    response.json({ student });
  } catch (error) {
    logger.error({ error }, "수료생 수정에 실패했습니다.");
    response.status(500).json({ message: "수료생 수정에 실패했습니다." });
  }
});

app.delete("/api/students/:id", async (request: Request, response: Response) => {
  try {
    const studentId = request.params.id as string;
    const db = getPrisma();

    const existing = await db.student.findUnique({ where: { id: studentId } });
    if (!existing) {
      response.status(404).json({ message: "수료생을 찾을 수 없습니다." });
      return;
    }

    await db.student.delete({ where: { id: studentId } });
    response.status(204).send();
  } catch (error) {
    logger.error({ error }, "수료생 삭제에 실패했습니다.");
    response.status(500).json({ message: "수료생 삭제에 실패했습니다." });
  }
});

// --- Project CRUD (#79) ---

app.post("/api/students/:studentId/projects", async (request: Request, response: Response) => {
  try {
    const studentId = request.params.studentId as string;
    const db = getPrisma();

    const student = await db.student.findUnique({ where: { id: studentId } });
    if (!student) {
      response.status(404).json({ message: "수료생을 찾을 수 없습니다." });
      return;
    }

    const { title, summary, contribution, links, problem, solution, techChoices, result } = request.body as {
      title?: string;
      summary?: string;
      contribution?: string;
      links?: string[];
      problem?: string;
      solution?: string;
      techChoices?: string[];
      result?: string;
    };

    if (!title || !summary || !contribution) {
      response.status(400).json({ message: "title, summary, contribution이 필요합니다." });
      return;
    }

    const project = await db.project.create({
      data: {
        studentId,
        title,
        summary,
        contribution,
        links: links ?? [],
        problem,
        solution,
        techChoices: techChoices ?? [],
        result,
      },
    });

    response.status(201).json({ project });
  } catch (error) {
    logger.error({ error }, "프로젝트 생성에 실패했습니다.");
    response.status(500).json({ message: "프로젝트 생성에 실패했습니다." });
  }
});

app.patch("/api/projects/:id", async (request: Request, response: Response) => {
  try {
    const projectId = request.params.id as string;
    const db = getPrisma();

    const existing = await db.project.findUnique({ where: { id: projectId } });
    if (!existing) {
      response.status(404).json({ message: "프로젝트를 찾을 수 없습니다." });
      return;
    }

    const body = request.body as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    const allowedFields = ["title", "summary", "contribution", "links", "problem", "solution", "techChoices", "result"];
    for (const field of allowedFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    const project = await db.project.update({ where: { id: projectId }, data });
    response.json({ project });
  } catch (error) {
    logger.error({ error }, "프로젝트 수정에 실패했습니다.");
    response.status(500).json({ message: "프로젝트 수정에 실패했습니다." });
  }
});

app.delete("/api/projects/:id", async (request: Request, response: Response) => {
  try {
    const projectId = request.params.id as string;
    const db = getPrisma();

    const existing = await db.project.findUnique({ where: { id: projectId } });
    if (!existing) {
      response.status(404).json({ message: "프로젝트를 찾을 수 없습니다." });
      return;
    }

    await db.project.delete({ where: { id: projectId } });
    response.status(204).send();
  } catch (error) {
    logger.error({ error }, "프로젝트 삭제에 실패했습니다.");
    response.status(500).json({ message: "프로젝트 삭제에 실패했습니다." });
  }
});

// --- Books / Orders ---

app.post("/api/books", async (request: Request, response: Response) => {
  const idempotencyKey = request.headers["idempotency-key"];
  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    response.status(400).json({ message: "Idempotency-Key 헤더가 필요합니다." });
    return;
  }

  if (inProgressKeys.has(idempotencyKey)) {
    response.status(409).json({ message: "이미 처리 중인 요청입니다." });
    return;
  }

  const { session, cohortId, studentId } = request.body as {
    session?: OrchestrationInput["session"];
    cohortId?: string;
    studentId?: string;
  };

  if (!session || !cohortId) {
    response.status(400).json({ message: "session과 cohortId가 필요합니다." });
    return;
  }

  const { SWEETBOOK_API_BASE_URL, SWEETBOOK_API_KEY } = getEnv();
  const client = createSweetBookClient(SWEETBOOK_API_BASE_URL, SWEETBOOK_API_KEY);
  const db = getPrisma();

  // DB에서 cohort + students + projects 조회하여 Cohort[] 형태로 변환
  const cohortRow = await db.cohort.findUnique({ where: { id: cohortId } });
  if (!cohortRow) {
    response.status(404).json({ message: "기수를 찾을 수 없습니다." });
    return;
  }
  const studentRows = await db.student.findMany({ where: { cohortId }, orderBy: { createdAt: "asc" } });
  const studentsWithProjects = await Promise.all(
    studentRows.map(async (s: { id: string; name: string; roleTrack: string; bio: string; techStack: string[]; mentorComment: string; photos: string[]; certificateMessage: string; retrospective: unknown }) => {
      const projects = await db.project.findMany({ where: { studentId: s.id }, orderBy: { createdAt: "asc" } });
      return {
        id: s.id,
        name: s.name,
        roleTrack: s.roleTrack,
        bio: s.bio,
        techStack: s.techStack,
        projects: projects.map((p: { title: string; summary: string; contribution: string; links: string[] }) => ({
          title: p.title,
          summary: p.summary,
          contribution: p.contribution,
          links: p.links,
        })),
        retrospective: typeof s.retrospective === "object" && s.retrospective !== null
          ? (s.retrospective as { difficulty?: string }).difficulty ?? ""
          : "",
        mentorComment: s.mentorComment,
        photos: s.photos,
        certificateMessage: s.certificateMessage,
      };
    })
  );
  const cohortsData = [{
    id: cohortRow.id,
    name: cohortRow.name,
    program: cohortRow.program,
    graduationDate: formatDate(cohortRow.graduationDate),
    summary: cohortRow.summary,
    tagline: cohortRow.tagline,
    students: studentsWithProjects,
  }];

  inProgressKeys.add(idempotencyKey);
  try {
    const result = await orchestrateBook(
      { session, cohortId, studentId, idempotencyKey },
      client,
      cohortsData
    );
    response.json(result);
  } catch (error) {
    if (error instanceof OrchestrationError) {
      const causeMessage = error.cause instanceof Error
        ? error.cause.message
        : (typeof error.cause === "object" && error.cause !== null)
          ? JSON.stringify(error.cause)
          : String(error.cause ?? "");
      logger.error({ step: error.step, cause: causeMessage }, error.message);
      response.status(502).json({
        message: error.message,
        step: error.step,
        cause: causeMessage,
      });
    } else {
      logger.error({ error }, "알 수 없는 오류가 발생했습니다.");
      response.status(500).json({ message: "알 수 없는 오류가 발생했습니다." });
    }
  } finally {
    inProgressKeys.delete(idempotencyKey);
  }
});

app.get("/api/credits", async (_request: Request, response: Response) => {
  const { SWEETBOOK_API_BASE_URL, SWEETBOOK_API_KEY } = getEnv();
  const client = createSweetBookClient(SWEETBOOK_API_BASE_URL, SWEETBOOK_API_KEY);

  try {
    const credits = await client.getCredits();
    response.json({ balance: credits.balance, currency: credits.currency });
  } catch (error) {
    logger.error({ error }, "잔액 조회에 실패했습니다.");
    response.status(502).json({ message: "잔액 조회에 실패했습니다." });
  }
});

app.post("/api/orders", async (request: Request, response: Response) => {
  const idempotencyKey = request.headers["idempotency-key"];
  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    response.status(400).json({ message: "Idempotency-Key 헤더가 필요합니다." });
    return;
  }

  const { bookUid, shipping } = request.body as {
    bookUid?: string;
    shipping?: Partial<OrderShipping>;
  };

  if (!bookUid) {
    response.status(400).json({ message: "bookUid가 필요합니다." });
    return;
  }

  const { recipientName, recipientPhone, address1, postalCode } = shipping ?? {};
  if (!recipientName || !recipientPhone || !address1 || !postalCode) {
    response.status(400).json({ message: "배송 정보(수령인명, 전화번호, 주소, 우편번호)가 모두 필요합니다." });
    return;
  }

  const { SWEETBOOK_API_BASE_URL, SWEETBOOK_API_KEY } = getEnv();
  const client = createSweetBookClient(SWEETBOOK_API_BASE_URL, SWEETBOOK_API_KEY);

  try {
    const result = await client.createOrder(idempotencyKey, {
      bookUid,
      shipping: { recipientName, recipientPhone, address1, postalCode },
    });
    response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "주문 생성에 실패했습니다.";
    logger.error({ error }, "주문 생성에 실패했습니다.");
    response.status(502).json({ message });
  }
});

app.listen(port, () => {
  logger.info({ port }, "API server listening");
});
