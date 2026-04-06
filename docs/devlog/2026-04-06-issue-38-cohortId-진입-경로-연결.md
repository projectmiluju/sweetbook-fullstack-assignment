# 개발 일지: 기수 쇼케이스 북 cohortId 진입 경로 연결 (#38)

**일자:** 2026-04-06
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

#9에서 `book-types` 페이지는 `studentId` 기반 진입만 처리했다. 기수 쇼케이스 북은 수료생 1명이 아닌 기수 전체 데이터가 필요하므로 `cohortId` 기반 진입 경로가 별도로 필요했다. 이 경로 없이는 기수 쇼케이스 북 선택지가 UI에만 존재하는 데드엔드 상태였다.

## 문제 (Problem)

1. 기수 상세 페이지(`/cohorts/[cohortId]`)에서 책 만들기 흐름으로 진입하는 진입점이 없었음.
2. `book-types` 페이지가 `cohortId` searchParam을 수신하지 않아 cohort 컨텍스트를 유지한 채 다음 단계로 이동 불가.
3. `lib/book-types.ts`에 cohort 경로를 위한 URL 생성 유틸이 없었음.
4. `/cohorts/[cohortId]/create` 확정 페이지 자체가 없었음.

## 최종 해결 (Resolution)

### lib/book-types.ts 확장

`buildCohortBookCreateHref`와 `buildCohortBookTypesBackHref` 두 함수를 추가했다. student용과 완전히 대칭적인 구조로 유지해 일관성을 확보했다. cohortId가 falsy면 `/dashboard` fallback을 반환하는 방어 로직도 동일하게 적용했다.

### book-types/page.tsx 이중 컨텍스트 처리

`searchParams`에 `cohortId`를 추가로 수신하고, 세 helper 함수(`getBackHref`, `getBackLabel`, `getCreateHref`) 내부에서 `if (cohortId)` 우선순위 분기를 적용했다. cohortId가 있으면 cohort 경로, 없으면 기존 studentId 경로로 동작한다. 기존 studentId 기반 흐름은 전혀 변경하지 않았다.

**cohortId + studentId 동시 전달 시 cohortId 우선 처리**는 DoD에 명시된 예외 정책이다. 두 파라미터를 동시에 전달하는 정상적인 UI 경로는 없지만, URL 직접 조작 시에도 예측 가능하게 동작하도록 명시적으로 처리했다.

### cohorts/[cohortId]/create/page.tsx 신규 생성

수료생용 `students/[studentId]/create/page.tsx`와 동일한 패턴으로 설계했다. 핵심 차이점은 bookType 가드에 있다. 기수 create 페이지는 `cohort-showcase` 타입만 허용하고, `individual`을 포함한 다른 타입은 즉시 `notFound()`로 처리한다. 기수 컨텍스트에서 개인 북 선택은 UX상 도달 불가능한 경로이므로 이 제약은 의도적이다.

### cohorts/[cohortId]/page.tsx Next Step 섹션 추가

학생 그리드 바로 위에 Next Step aside를 추가했다. `cohort.id`를 searchParam으로 넘겨 `/book-types?cohortId=xxx`로 연결한다. 레이아웃과 색상은 기존 students 페이지의 Next Step 섹션과 일치시켰다.

## 배운 것 (Lessons Learned)

**cohortId와 studentId는 완전히 대칭적인 두 진입 경로다.** lib/book-types.ts에서 두 경로의 함수를 같은 패턴으로 관리하면, 이후 새로운 컨텍스트 타입(예: 팀 북, 멘토 북)이 추가될 때도 동일한 방식으로 확장할 수 있다. 이 패턴을 깨지 않는 것이 중요하다.

**Server Component 내부 분기 로직의 테스트 가능성 문제.** `book-types/page.tsx`의 우선순위 분기는 Server Component 내부 인라인 함수라 Vitest로 직접 커버할 수 없다. 현재는 단순 if-else라 코드 리뷰로 충분하지만, 로직이 복잡해지면 lib 레이어로 추출해 테스트 가능하게 만들어야 한다. E2E 도입 시점에 이 패턴도 같이 커버하는 것이 바람직하다.
