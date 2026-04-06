import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

import { cohorts } from "./data/cohorts.js";
import { orchestrateBook, OrchestrationError } from "./lib/orchestrate-book.js";
import type { OrchestrationInput } from "./lib/orchestrate-book.js";
import { createSweetBookClient } from "./lib/sweetbook-api.js";

dotenv.config({ path: "../../.env" });

const app = express();
const port = Number(process.env.PORT ?? "4000");

// 진행 중인 책 생성 요청을 추적 (중복 요청 차단)
const inProgressKeys = new Set<string>();

app.use(cors());
app.use(express.json());

app.get("/health", (_request: Request, response: Response) => {
  response.json({ ok: true });
});

app.get("/api/cohorts", (_request: Request, response: Response) => {
  response.json({
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      program: cohort.program,
      graduationDate: cohort.graduationDate,
      summary: cohort.summary,
      tagline: cohort.tagline,
      studentCount: cohort.students.length
    }))
  });
});

app.get("/api/cohorts/:id", (request: Request, response: Response) => {
  const cohort = cohorts.find((item) => item.id === request.params.id);

  if (!cohort) {
    response.status(404).json({ message: "기수를 찾을 수 없습니다." });
    return;
  }

  response.json({
    cohort: {
      id: cohort.id,
      name: cohort.name,
      program: cohort.program,
      graduationDate: cohort.graduationDate,
      summary: cohort.summary,
      tagline: cohort.tagline,
      studentCount: cohort.students.length,
      students: cohort.students.map((student) => ({
        id: student.id,
        name: student.name,
        roleTrack: student.roleTrack,
        bio: student.bio,
        projectCount: student.projects.length,
        primaryProjectTitle: student.projects[0]?.title ?? "대표 프로젝트 준비 중"
      }))
    }
  });
});

app.get("/api/students/:id", (request: Request, response: Response) => {
  const student = cohorts.flatMap((cohort) => cohort.students).find((item) => item.id === request.params.id);

  if (!student) {
    response.status(404).json({ message: "수료생을 찾을 수 없습니다." });
    return;
  }

  response.json({ student });
});

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

  const baseUrl = process.env.SWEETBOOK_API_BASE_URL ?? "";
  const apiKey = process.env.SWEETBOOK_API_KEY ?? "";
  const client = createSweetBookClient(baseUrl, apiKey);

  inProgressKeys.add(idempotencyKey);
  try {
    const result = await orchestrateBook(
      { session, cohortId, studentId, idempotencyKey },
      client
    );
    response.json(result);
  } catch (error) {
    if (error instanceof OrchestrationError) {
      response.status(502).json({
        message: error.message,
        step: error.step,
      });
    } else {
      response.status(500).json({ message: "알 수 없는 오류가 발생했습니다." });
    }
  } finally {
    inProgressKeys.delete(idempotencyKey);
  }
});

app.listen(port, () => {
  process.stdout.write(`API server listening on http://localhost:${port}\n`);
});
