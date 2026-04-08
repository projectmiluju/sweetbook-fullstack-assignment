import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface JsonProject {
  title: string;
  summary: string;
  contribution: string;
  links: string[];
}

interface JsonStudent {
  id: string;
  name: string;
  roleTrack: string;
  bio: string;
  techStack: string[];
  projects: JsonProject[];
  retrospective: string;
  mentorComment: string;
  photos: string[];
  certificateMessage: string;
}

interface JsonCohort {
  id: string;
  name: string;
  program: string;
  graduationDate: string;
  summary: string;
  tagline: string;
  students: JsonStudent[];
}

function loadCohorts(): JsonCohort[] {
  const jsonPath = resolve(__dirname, "../data/cohorts.json");
  const raw = readFileSync(jsonPath, "utf-8");
  return JSON.parse(raw) as JsonCohort[];
}

function buildRetrospective(original: string) {
  return {
    before: "부트캠프 시작 전에는 독학으로 기초만 익힌 상태였습니다.",
    process: "매일 코드 리뷰와 페어 프로그래밍을 통해 실무 감각을 쌓았습니다.",
    turning: "첫 팀 프로젝트를 배포했을 때 자신감이 생겼습니다.",
    difficulty: original,
    overcome: "직접 부딪히며 문제를 ���개는 연습을 반복했습니다.",
    learned: "기능 구현보다 문제 정의가 더 중요하다는 점을 배웠습니다.",
  };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const cohorts = loadCohorts();

  // 반복 실행 안전성: 기존 데이터 삭제 (cascade로 하위 데이터도 삭제)
  await prisma.project.deleteMany();
  await prisma.student.deleteMany();
  await prisma.cohort.deleteMany();

  for (const cohort of cohorts) {
    await prisma.cohort.create({
      data: {
        id: cohort.id,
        name: cohort.name,
        program: cohort.program,
        graduationDate: new Date(cohort.graduationDate),
        summary: cohort.summary,
        tagline: cohort.tagline,

        // 신규 필드 — 시연용 더미 데이터
        operatorMessage: `${cohort.name} 수료생 여러분, 함께한 여정을 축하합니다.`,
        philosophy:
          "실무 중심의 프로젝트 경험과 협업 역량을 갖춘 개발자를 양성합니���.",
        logoUrl: "https://picsum.photos/seed/sweetbook-logo/400/400",
        photos: [
          "https://picsum.photos/seed/cohort-group-1/1200/900",
          "https://picsum.photos/seed/cohort-event-1/1200/900",
        ],
        partnerInfo: "채용 문의: recruit@sweetbootcamp.io",
        stats: {
          demoCount: 8,
          projectCount: 15,
          participantCount: cohort.students.length,
        },

        students: {
          create: cohort.students.map((s) => ({
            id: s.id,
            name: s.name,
            roleTrack: s.roleTrack,
            bio: s.bio,
            techStack: s.techStack,
            mentorComment: s.mentorComment,
            photos: s.photos,
            certificateMessage: s.certificateMessage,

            // retrospective: String → Json 변환
            retrospective: buildRetrospective(s.retrospective),

            // 신규 필드 — 시연용 더미 데이터
            interests: ["오픈소스 기여", "기술 블로그", "사이드 프로젝트"],
            achievements: `프로젝트 ${s.projects.length}개 완수, ${cohort.name} 수료`,
            portfolioLinks: {
              github: s.projects[0]?.links[0] ?? null,
              blog: null,
              email: `${s.id}@example.com`,
              demo: null,
            },
            thanksMessage: "함께 성장할 수 있어 감사했습니다.",

            projects: {
              create: s.projects.map((p) => ({
                title: p.title,
                summary: p.summary,
                contribution: p.contribution,
                links: p.links,

                // 신규 필드 — 시연용 더미 데이터
                problem: `${p.title} 프로젝트에서 해결하려는 핵심 문제입니다.`,
                solution: `${p.contribution}을 통해 문제를 해결했습니다.`,
                techChoices: [
                  "TypeScript — 타입 안전성",
                  "Express — 빠른 API 구현",
                ],
                result:
                  "데모데이 발표 완료, 사용자 피드백 반영하여 개선 진행.",
              })),
            },
          })),
        },
      },
    });
  }

  const cohortCount = await prisma.cohort.count();
  const studentCount = await prisma.student.count();
  const projectCount = await prisma.project.count();

  console.log(
    `Seed 완료: Cohort ${cohortCount}건, Student ${studentCount}건, Project ${projectCount}건`
  );

  await prisma.$disconnect();
  await pool.end();
}

main().catch((error) => {
  console.error("Seed 실패:", error);
  process.exit(1);
});
