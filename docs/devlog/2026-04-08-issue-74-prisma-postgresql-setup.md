# 개발 일지: #74 PostgreSQL + Prisma 초기 설정

**일자:** 2026-04-08
**관련 이슈:** #74
**관련 역할:** build

## 배경 (Context)

시연을 위해 CRUD가 필요하여 PostgreSQL + Prisma 도입을 결정했다(ADR-007). Docker Compose에 PostgreSQL 서비스를 추가하고, Prisma 스키마를 작성하여 초기 마이그레이션을 실행하는 작업이다.

## 문제 (Problem)

Prisma v7(7.7.0)에서 `new PrismaClient()`가 인자 없이 호출하면 `TS2554: Expected 1 arguments, but got 0` 에러가 발생했다. Prisma v5/v6까지는 인자 없이 호출 가능했으나, v7부터 **adapter가 필수 인자**로 변경되었다.

## 시도한 것들 (Attempts)

1. **시도 1:** `new PrismaClient()` (인자 없이) — 타입 에러 발생. generated client 코드를 확인하니 `PrismaPg` adapter를 요구하는 예시가 주석에 있었다.
2. **시도 2:** `@prisma/adapter-pg` + `pg` 패키지 설치 후 adapter 패턴 적용 — 빌드 성공.

## 최종 해결 (Resolution)

```typescript
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

추가 의존성: `@prisma/adapter-pg`, `pg`, `@types/pg`

또한 `prisma init`이 `apps/api/.env`를 자동 생성하는데, 프로젝트는 루트 `.env`를 사용하므로 삭제하고 `prisma.config.ts`의 dotenv 경로를 `../../.env`로 수정했다.

## 배운 것 (Lessons Learned)

- Prisma v7은 driver adapter 패턴이 기본이다. `@prisma/client` 단독으로는 DB 연결이 안 된다. 새 프로젝트에서 Prisma를 도입할 때 adapter 패키지를 함께 설치해야 한다.
- `prisma init`은 현재 디렉토리에 `.env`를 생성하므로, 모노레포에서는 즉시 삭제하고 `prisma.config.ts`의 env 경로를 루트로 변경해야 한다.
