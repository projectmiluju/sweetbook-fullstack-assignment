# 개발 일지: #76 GET 엔드포인트 DB 조회 전환

**일자:** 2026-04-08
**관련 이슈:** #76
**관련 역할:** build

## 배경 (Context)

#74(Prisma 설정) + #75(seed)가 완료되어 DB에 데이터가 있는 상태. server.ts의 GET 3개 엔드포인트를 JSON 직접 참조에서 Prisma 쿼리로 전환하는 작업.

## 문제 (Problem)

두 가지 문제에 부딪혔다.

### 1. Prisma v7 include 타입 추론 불완전

`prisma.cohort.findUnique({ include: { students: true } })`의 결과 타입에서 `students` 프로퍼티가 TypeScript에 인식되지 않았다. `cohort.students`에 접근하면 `TS2339: Property 'students' does not exist` 에러 발생.

Prisma v7의 generated client가 `.ts` 파일이고 `@ts-nocheck`가 적용되어 있어, include가 결과 타입에 반영되지 않는 것으로 추정.

### 2. PrismaClient 모듈 로드 시점 문제

`export const prisma = new PrismaClient(...)` 패턴에서, `server.ts`의 `dotenv.config()` 보다 `prisma.ts`의 모듈 평가가 먼저 실행되어 `DATABASE_URL`이 undefined가 됨. ESM import 호이스팅 문제 (ADR-004에서 환경변수 상수 읽기 시점 문제와 동일한 패턴).

## 시도한 것들 (Attempts)

1. **시도 1:** `findUnique({ include: { students: { include: { projects: true } } } })` — 중첩 include 사용. TypeScript가 결과 타입을 올바르게 추론하지 못해 `.students`, `.projects` 접근 시 타입 에러.
2. **시도 2:** 별도 쿼리 분리 — cohort 조회 후 students를 `findMany`, projects를 `count`/`findFirst`로 각각 쿼리. 타입 에러 없이 빌드 성공.

## 최종 해결 (Resolution)

### include 우회: 별도 쿼리 패턴

```typescript
// include 대신 별도 쿼리
const cohort = await db.cohort.findUnique({ where: { id } });
const students = await db.student.findMany({ where: { cohortId: id } });
const projectCount = await db.project.count({ where: { studentId: s.id } });
```

N+1 쿼리가 발생하지만, 데이터가 2기수/3수료생/5프로젝트 수준이므로 시연에 영향 없음.

### 지연 초기화: getPrisma() 함수

```typescript
// export const prisma = ... (모듈 로드 시 즉시 실행 — 문제)
// ↓
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}
```

핸들러 내에서 `getPrisma()`를 호출하면, `dotenv.config()` 이후에 실행되므로 `DATABASE_URL`이 정상 로드됨.

## 배운 것 (Lessons Learned)

- Prisma v7의 TypeScript 타입 추론은 아직 불완전하다. include 사용 시 결과 타입에 관계 필드가 포함되지 않을 수 있다. 별도 쿼리로 우회하거나, `as` 타입 단언이 필요하다.
- ESM 환경에서 모듈 레벨 상수/인스턴스는 dotenv보다 먼저 평가된다. 환경변수에 의존하는 싱글톤은 반드시 지연 초기화(lazy init) 패턴을 사용해야 한다. 이 프로젝트에서 이 패턴은 3번째 발생 (ADR-004의 templateUid, env.ts의 loadEnv, 이번 getPrisma).
