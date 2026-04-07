# [PRD] PostgreSQL + Prisma 데이터베이스 도입

**Status:** Approved
**Date:** 2026-04-08
**Parent PRD:** `docs/prd/bookprint-bootcamp-portfolio-book-prd.md`

## 1. 개요 (Overview)

### 배경 및 목적

현재 앱은 `apps/api/data/cohorts.json` 정적 파일에서 데이터를 읽는다. 쓰기 기능이 없어 시연 시 기수/수료생을 추가·수정·삭제할 수 없고, 서버 재시작하면 상태가 초기화되는 것도 아닌 — 애초에 상태 변경 자체가 불가능하다.

시연을 위해 PostgreSQL + Prisma 기반 CRUD를 도입한다.

### 현재 상태 (AS-IS)

- 데이터 소스: `data/cohorts.json` (정적 JSON, 서버 시작 시 메모리 로드)
- 타입 정의: `src/data/cohorts.ts` (Cohort, StudentPortfolio, ProjectSummary 인터페이스)
- API: 읽기 전용 (GET `/api/cohorts`, GET `/api/cohorts/:id`, GET `/api/students/:id`)
- Docker Compose: `api` + `web` 서비스만 존재, DB 없음

### 목표 상태 (TO-BE)

- 데이터 소스: PostgreSQL (Docker Compose로 실행)
- ORM: Prisma (스키마 선언, 마이그레이션, 타입 생성)
- API: CRUD 전체 지원
- 기존 JSON 데이터는 seed 스크립트로 DB에 초기 적재

## 2. 데이터베이스 스키마

### 2.1 현재 JSON 구조 → 관계형 모델 변환

```
cohorts.json (중첩 JSON)
├── Cohort
│   ├── students[] (1:N)
│   │   ├── techStack[] (string 배열)
│   │   ├── photos[] (string 배열)
│   │   └── projects[] (1:N)
│   │       └── links[] (string 배열)
```

### 2.2 PRD 페이지 구성표 기준 데이터 갭 분석

PRD(섹션 24)의 24페이지 구성표를 실현하려면, 현재 JSON에 없는 데이터가 필요하다.

#### Cohort — 누락 데이터

| PRD 페이지 | 필요 데이터 | 현재 상태 | 추가 필드 |
|------------|------------|----------|----------|
| 2. 인사/개요 | 운영자 인사 메시지 | 없음 | `operatorMessage` |
| 19. 부트캠프 소개 (개인 북) | 부트캠프 철학, 과정 특징 | `summary`만 존재 | `philosophy` |
| 20. 코호트 사진 (개인 북) / 22. 단체 사진 (기수 북) | 기수 단체·행사 사진 | 없음 | `photos[]` |
| 24. 뒷표지 | 로고 이미지 | 없음 | `logoUrl` |
| 19. 채용 파트너 안내 (기수 북) | 협업 제안·연락처 | 없음 | `partnerInfo` |
| 20. 부트캠프 성과 요약 (기수 북) | 데모/프로젝트/참여 수치 | 없음 | `stats` (JSON) |

#### Student — 누락 데이터

| PRD 페이지 | 필요 데이터 | 현재 상태 | 추가 필드 |
|------------|------------|----------|----------|
| 5. 기술 스택 | 관심 분야 | `techStack`만 존재 | `interests[]` |
| 12-13. 회고 1, 2 | 구조화된 회고 (수강 전/학습 과정/전환점/어려움/극복/배운 점) | `retrospective` 단일 문자열 | `retrospective` → Json 타입으로 변경 |
| 17. 성과 요약 | 수료 여부, 활동 요약 | 없음 | `achievements` |
| 18. 포트폴리오 링크 | GitHub, 블로그, 이메일, 데모 | 프로젝트별 links만 존재 | `portfolioLinks` (JSON) |
| 21. 감사 메시지 | 감사 문구 | 없음 | `thanksMessage` |

#### Project — 누락 데이터

| PRD 페이지 | 필요 데이터 | 현재 상태 | 추가 필드 |
|------------|------------|----------|----------|
| 7, 9, 11. 프로젝트 상세 | 문제, 해결, 기술 선택, 결과 | `summary`와 `contribution`만 존재 | `problem`, `solution`, `techChoices[]`, `result` |

### 2.3 Prisma 스키마

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cohort {
  id             String    @id @default(cuid())
  name           String                          // "웹 풀스택 5기"
  program        String                          // "SweetBootcamp Web Fullstack"
  graduationDate DateTime                        // 2026-04-30
  summary        String                          // 기수 소개
  tagline        String                          // 마케팅 태그라인

  // --- PRD 페이지 구성표 충족을 위한 추가 필드 ---
  operatorMessage String?                        // 운영자/리드 멘토 인사 메시지 (p2 인사/개요, p4 기수 북 운영진 메시지)
  philosophy      String?                        // 부트캠프 철학·과정 특징 (p19 부트캠프 소개)
  logoUrl         String?                        // 뒷표지 로고 이미지 URL (p24 뒷표지)
  photos          String[]                       // 기수 단체·행사 사진 (p20 코호트 사진, p22 기수 북 단체 사진)
  partnerInfo     String?                        // 채용 파트너 안내 문구 (p19 기수 북)
  stats           Json?                          // { demoCount, projectCount, participantCount } (p20 기수 북 성과 요약)

  students       Student[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Student {
  id                 String    @id @default(cuid())
  name               String                      // "김코드"
  roleTrack          String                      // "풀스택"
  bio                String                      // 자기소개
  techStack          String[]                    // PostgreSQL 배열: ["TypeScript", "Next.js"]
  mentorComment      String                      // 멘토 코멘트
  photos             String[]                    // PostgreSQL 배열: ["https://..."]
  certificateMessage String                      // 수료 축하 문구

  // --- PRD 페이지 구성표 충족을 위한 추가/변경 필드 ---
  retrospective      Json?                       // 구조화된 회고 (p12-13)
                                                 // { before, process, turning, difficulty, overcome, learned }
  interests          String[]                    // 관심 분야 (p5 기술 스택 페이지 보강)
  achievements       String?                     // 성과 요약: 수료 여부, 활동 요약 (p17)
  portfolioLinks     Json?                       // { github?, blog?, email?, demo? } (p18 포트폴리오 링크)
  thanksMessage      String?                     // 감사 메시지 (p21)

  cohortId           String
  cohort             Cohort    @relation(fields: [cohortId], references: [id], onDelete: Cascade)
  projects           Project[]
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model Project {
  id           String   @id @default(cuid())
  title        String                            // "StudyFlow"
  summary      String                            // 프로젝트 요약
  contribution String                            // 기여 내용
  links        String[]                          // PostgreSQL 배열: ["https://github.com/..."]

  // --- PRD 프로젝트 상세 페이지 충족을 위한 추가 필드 (p7, p9, p11) ---
  problem      String?                           // 해결하려는 문제
  solution     String?                           // 해결 방법
  techChoices  String[]                          // 기술 선택과 이유
  result       String?                           // 결과/성과

  studentId    String
  student      Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 2.4 retrospective 구조 변경 상세

기존 `retrospective: String` (단일 문자열)을 `retrospective: Json?` (구조화 객체)으로 변경한다.

```typescript
// retrospective JSON 구조
interface Retrospective {
  before: string;      // 수강 전 상태 — "비전공자로 코딩 경험 전무"
  process: string;     // 학습 과정 — "매일 코드 리뷰와 페어 프로그래밍"
  turning: string;     // 전환점 — "첫 프로젝트 배포 후 자신감"
  difficulty: string;  // 어려움 — "비동기 처리 개념"
  overcome: string;    // 극복 — "직접 Promise 체인 구현해보며 이해"
  learned: string;     // 배운 점 — "문제 정의가 구현보다 중요"
}
```

페이지 매핑:
- **회고 1** (p12): `before` + `process` + `turning` → "성장 맥락"
- **회고 2** (p13): `difficulty` + `overcome` + `learned` → "성찰 강화"

### 2.5 설계 판단

| 판단 | 결정 | 이유 |
|------|------|------|
| `techStack`, `photos`, `links`, `techChoices`, `interests`를 별도 테이블로? | **아니오, PostgreSQL 배열 사용** | 단순 문자열 목록이고, 개별 항목에 대한 쿼리/관계가 불필요. Prisma가 PostgreSQL 네이티브 배열을 지원함 |
| `projects`를 JSON 컬럼으로? | **아니오, 별도 테이블** | 프로젝트별 CRUD가 필요하고, 프로젝트 수가 수료생마다 다름 |
| `retrospective`를 별도 테이블로? | **아니오, Json 컬럼** | 수료생 1명당 회고 1건. 개별 필드에 대한 관계 쿼리 불필요. CRUD는 Student 업데이트로 처리 |
| `portfolioLinks`를 별도 테이블로? | **아니오, Json 컬럼** | 키-값 쌍이 고정적(github, blog, email, demo). 개별 행으로 관리할 이유 없음 |
| `stats`를 별도 테이블로? | **아니오, Json 컬럼** | 기수당 1건, 집계 수치만 저장. 별도 테이블은 과잉 |
| 추가 필드를 nullable로? | **예 (`?` 표기)** | 기존 seed 데이터에 해당 값이 없으므로, 점진적으로 채울 수 있도록 optional. 필수 필드(name, bio 등)는 기존과 동일하게 required 유지 |
| ID 체계 | **cuid() 자동 생성** | 기존 `cohort-2026-01`, `student-001` 같은 수동 ID 대신 자동 생성. seed 시에는 기존 ID를 그대로 사용 |
| `graduationDate` 타입 | **DateTime** | 기존 문자열(`"2026-04-30"`)에서 전환. API 응답 시 ISO 문자열로 직렬화 |
| Cascade 삭제 | **적용** | 기수 삭제 시 소속 수료생, 수료생 삭제 시 소속 프로젝트 함께 삭제 |

## 3. API 엔드포인트 (CRUD)

### 3.1 기수 (Cohort)

| 메소드 | 경로 | 용도 | 요청 바디 | 비고 |
|--------|------|------|----------|------|
| GET | `/api/cohorts` | 기수 목록 | - | 기존 유지, DB 조회로 전환 |
| GET | `/api/cohorts/:id` | 기수 상세 + 수료생 목록 | - | 기존 유지, DB 조회로 전환 |
| POST | `/api/cohorts` | 기수 생성 | `{ name, program, graduationDate, summary, tagline, operatorMessage?, philosophy?, logoUrl?, photos?, partnerInfo?, stats? }` | **신규** |
| PATCH | `/api/cohorts/:id` | 기수 수정 | `{ name?, program?, operatorMessage?, philosophy?, ... }` (부분 업데이트) | **신규** |
| DELETE | `/api/cohorts/:id` | 기수 삭제 | - | **신규**, Cascade로 소속 수료생 함께 삭제 |

### 3.2 수료생 (Student)

| 메소드 | 경로 | 용도 | 요청 바디 | 비고 |
|--------|------|------|----------|------|
| GET | `/api/students/:id` | 수료생 상세 | - | 기존 유지, DB 조회로 전환 |
| POST | `/api/cohorts/:cohortId/students` | 수료생 추가 | `{ name, roleTrack, bio, techStack, retrospective?, interests?, achievements?, portfolioLinks?, thanksMessage?, ... }` | **신규** |
| PATCH | `/api/students/:id` | 수료생 수정 | `{ name?, bio?, retrospective?, portfolioLinks?, ... }` (부분 업데이트) | **신규** |
| DELETE | `/api/students/:id` | 수료생 삭제 | - | **신규**, Cascade로 프로젝트 함께 삭제 |

### 3.3 프로젝트 (Project)

| 메소드 | 경로 | 용도 | 요청 바디 | 비고 |
|--------|------|------|----------|------|
| POST | `/api/students/:studentId/projects` | 프로젝트 추가 | `{ title, summary, contribution, links, problem?, solution?, techChoices?, result? }` | **신규** |
| PATCH | `/api/projects/:id` | 프로젝트 수정 | `{ title?, summary?, problem?, solution?, techChoices?, result?, ... }` | **신규** |
| DELETE | `/api/projects/:id` | 프로젝트 삭제 | - | **신규** |

### 3.4 응답 형식 호환성

기존 GET 엔드포인트의 응답 형식은 **하위 호환을 유지하면서 확장**한다. 기존 프론트엔드가 사용하는 필드는 그대로 두고, 새 필드는 추가로 내려보낸다.

```typescript
// GET /api/cohorts/:id — 기존 필드 유지 + 새 필드 추가
{
  cohort: {
    id, name, program, graduationDate, summary, tagline, studentCount,
    operatorMessage, philosophy, logoUrl, photos, partnerInfo, stats,  // 신규
    students: [{ id, name, roleTrack, bio, projectCount, primaryProjectTitle }]
  }
}

// GET /api/students/:id — 기존 필드 유지 + 새 필드 추가
{
  student: {
    id, name, roleTrack, bio, techStack, mentorComment, photos, certificateMessage,
    retrospective,     // String → Json 구조로 변경
    interests,         // 신규
    achievements,      // 신규
    portfolioLinks,    // 신규
    thanksMessage,     // 신규
    projects: [{
      id, title, summary, contribution, links,
      problem, solution, techChoices, result  // 신규
    }]
  }
}
```

주요 변환 포인트:
- `graduationDate`: DateTime → `"YYYY-MM-DD"` 문자열로 포맷
- `studentCount`: `_count` relation으로 조회
- `primaryProjectTitle`: `projects[0].title` 또는 `"대표 프로젝트 준비 중"` fallback
- `retrospective`: Json 객체 그대로 반환 (프론트엔드에서 필드별 접근)
- `portfolioLinks`, `stats`: Json 객체 그대로 반환
- nullable 필드: `null`이면 응답에 `null`로 포함 (프론트에서 빈 상태 처리)

## 4. 인프라 변경

### 4.1 Docker Compose

```yaml
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: sweetbook
      POSTGRES_PASSWORD: sweetbook
      POSTGRES_DB: sweetbook
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sweetbook"]
      interval: 5s
      timeout: 3s
      retries: 5

  api:
    # ... 기존 설정 유지
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://sweetbook:sweetbook@db:5432/sweetbook

  web:
    # ... 기존 설정 유지
    depends_on:
      api:
        condition: service_healthy

volumes:
  pgdata:
```

### 4.2 환경변수 추가

```
# .env
DATABASE_URL=postgresql://sweetbook:sweetbook@localhost:5432/sweetbook
```

로컬 개발 시 `localhost:5432`, Docker 내부에서는 `db:5432`로 접근.

### 4.3 Prisma 설정

```
apps/api/
├── prisma/
│   ├── schema.prisma          # 스키마 정의
│   ├── migrations/            # 마이그레이션 파일들
│   └── seed.ts                # 기존 JSON 데이터 → DB 적재
```

## 5. Seed 스크립트

기존 `data/cohorts.json`의 데이터를 DB에 적재하는 스크립트. 기존 JSON에 없는 필드는 시연용 더미 값을 채운다.

```typescript
// prisma/seed.ts (의사 코드)
import { PrismaClient } from "@prisma/client";
import cohorts from "../data/cohorts.json";

const prisma = new PrismaClient();

async function main() {
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
        philosophy: "실무 중심의 프로젝트 경험과 협업 역량을 갖춘 개발자를 양성합니다.",
        logoUrl: "https://picsum.photos/seed/sweetbook-logo/400/400",
        photos: [
          "https://picsum.photos/seed/cohort-group-1/1200/900",
          "https://picsum.photos/seed/cohort-event-1/1200/900",
        ],
        partnerInfo: "채용 문의: recruit@sweetbootcamp.io",
        stats: { demoCount: 8, projectCount: 15, participantCount: cohort.students.length },

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
            retrospective: {
              before: "부트캠프 시작 전에는 독학으로 기초만 익힌 상태였습니다.",
              process: "매일 코드 리뷰와 페어 프로그래밍을 통해 실무 감각을 쌓았습니다.",
              turning: "첫 팀 프로젝트를 배포했을 때 자신감이 생겼습니다.",
              difficulty: s.retrospective,  // 기존 회고 텍스트를 difficulty에 매핑
              overcome: "직접 부딪히며 문제를 쪼개는 연습을 반복했습니다.",
              learned: "기능 구현보다 문제 정의가 더 중요하다는 점을 배웠습니다.",
            },

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
                techChoices: ["TypeScript — 타입 안전성", "Express — 빠른 API 구현"],
                result: "데모데이 발표 완료, 사용자 피드백 반영하여 개선 진행.",
              })),
            },
          })),
        },
      },
    });
  }
}
```

실행: `pnpm prisma db seed`

> **참고:** seed 데이터는 시연용 더미 값이다. 시연 시 CRUD API로 실제 데이터를 수정·보강할 수 있다.

## 6. 코드 변경 범위

### 6.1 삭제할 파일

| 파일 | 이유 |
|------|------|
| `src/data/cohorts.ts` | JSON 로더 + 인터페이스. Prisma 생성 타입으로 대체 |

### 6.2 수정할 파일

| 파일 | 변경 내용 | 크기 |
|------|----------|------|
| `src/server.ts` | 라우트 핸들러를 Prisma 쿼리로 교체 + CRUD 엔드포인트 추가. 응답에 새 필드 포함 | L |
| `src/lib/orchestrate-book.ts` | `cohorts` 직접 import → Prisma로 cohort/student 조회. 새 필드(retrospective Json 등) 처리 | M |
| `src/lib/payload-mapper.ts` | 새 데이터 필드를 내지 템플릿 파라미터에 매핑 (내지 콘텐츠 개선 PRD와 연동) | L |
| `src/config/env.ts` | `DATABASE_URL` 환경변수 추가 | S |
| `docker-compose.yml` | PostgreSQL 서비스 추가 | S |
| `.env.example` | `DATABASE_URL` 추가 | S |
| `apps/api/package.json` | `prisma`, `@prisma/client` 의존성 추가 | S |
| `apps/api/tsconfig.json` | Prisma 출력 경로 포함 확인 | S |
| `apps/api/Dockerfile` | `prisma generate` + `prisma migrate deploy` 단계 추가 | S |
| `data/cohorts.json` | 새 필드 추가하여 seed 소스와 동기화 (선택: seed.ts에서 더미 값 주입하므로 JSON은 기존 유지도 가능) | S |

### 6.3 신규 파일

| 파일 | 내용 |
|------|------|
| `prisma/schema.prisma` | 스키마 정의 |
| `prisma/seed.ts` | 초기 데이터 적재 |
| `src/lib/prisma.ts` | PrismaClient 싱글톤 인스턴스 |

### 6.4 테스트 영향

| 테스트 파일 | 영향 |
|-------------|------|
| `__tests__/orchestrate-book.test.ts` | cohort/student 데이터를 인자로 받으므로 변경 최소. Prisma mock 또는 인자 주입으로 대응 |
| `__tests__/payload-mapper.test.ts` | 변경 없음 (Prisma와 무관) |
| `__tests__/cohorts-loader.test.ts` | **삭제 대상** (JSON 로더 테스트, 더 이상 불필요) |
| 신규: CRUD API 통합 테스트 | Prisma + 테스트 DB로 CRUD 엔드포인트 검증 |

## 7. 마이그레이션 전략

### 7.1 단계적 전환

1. **Prisma 설정 + 스키마 생성** — `prisma init`, `schema.prisma` 작성, `prisma migrate dev`
2. **Seed 실행** — 기존 JSON 데이터를 DB에 적재, 정합성 검증
3. **GET 엔드포인트 전환** — 기존 읽기 API를 Prisma 쿼리로 교체, 응답 형식 동일 유지
4. **CRUD 엔드포인트 추가** — POST/PATCH/DELETE 라우트 추가
5. **orchestrate-book 연동** — 책 생성 시 DB에서 cohort/student 조회
6. **JSON 로더 제거** — `src/data/cohorts.ts` 삭제, 관련 테스트 정리
7. **Docker Compose 통합** — PostgreSQL 서비스 추가, API 서비스에 depends_on 설정

### 7.2 롤백 안전망

`data/cohorts.json` 파일은 삭제하지 않는다. seed 스크립트의 소스이자, DB 장애 시 폴백 데이터로 보존한다.

## 8. 예외 처리 정책

| 상황 | 대응 방안 | 우선순위 |
|------|---------|---------|
| DB 연결 실패 | 서버 시작 실패 + 에러 로그. 프론트엔드는 기존 mock 데이터로 동작 | 높음 |
| 존재하지 않는 ID로 PATCH/DELETE | 404 응답 | 중간 |
| 중복 기수명 생성 | 허용 (name은 unique 제약 없음) | 낮음 |
| 기수 삭제 시 소속 수료생 존재 | Cascade 삭제 (확인 대화 없이). 프론트에서 확인 UI 추가는 별도 | 중간 |
| graduationDate 형식 오류 | 400 응답 + 검증 메시지 | 중간 |
| 빈 문자열 필드 | 허용. 빈 상태 표시는 프론트엔드 책임 | 낮음 |

## 9. 아웃 오브 스코프 (Out of Scope)

| 제외 기능 | 제외 이유 | 예상 도입 시기 |
|----------|----------|-------------|
| 입력값 검증 (zod) | CRUD 바디 검증은 중요하지만 시연 우선 | 시연 후 |
| 페이지네이션 | 데이터 3명 수준에서 불필요 | 데이터 100건 이상 시 |
| 인증/권한 | MVP 범위 밖 (PRD 결정) | v2 |
| 소프트 딜리트 | 시연용이므로 하드 딜리트로 충분 | 운영 환경 도입 시 |
| 사진 업로드 (S3) | 현재 외부 URL 사용 | v2 |
| 트랜잭션 처리 | 단일 사용자 시연이므로 동시성 문제 없음 | 다중 사용자 도입 시 |

## 10. 다음 액션 플랜

1. **Prisma 초기 설정** — `pnpm add prisma @prisma/client`, `prisma init`, `schema.prisma` 작성
2. **Docker Compose에 PostgreSQL 추가** — `db` 서비스 추가, `api` depends_on 설정
3. **마이그레이션 실행** — `prisma migrate dev --name init`
4. **Seed 스크립트 작성 및 실행** — 기존 JSON → DB 적재
5. **GET 엔드포인트 전환** — server.ts 라우트를 Prisma 쿼리로 교체
6. **CRUD 엔드포인트 추가** — POST/PATCH/DELETE 라우트 구현
7. **orchestrate-book 연동** — DB 조회로 전환
8. **테스트 정비** — cohorts-loader 테스트 삭제, CRUD 테스트 추가
