# 개발 일지: #48 책 만들기 버튼 API 연결 및 결과 화면 구현

**일자:** 2026-04-07
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

Epic 3에서 `EditForm`과 `CohortEditForm`의 "편집 완료" 버튼은 `void session` 플레이스홀더로 구현되어 있었다. #47에서 `POST /api/books` 오케스트레이션 엔드포인트가 완성됐으므로, 이제 프론트엔드 버튼을 실제 API 호출로 전환해야 한다. 이 이슈는 그 연결과 `idle/loading/success/error` 상태 UI를 확립한다.

## 문제 (Problem)

**1. `students/[studentId]/create` 경로에서 `cohortId`를 어떻게 공급할 것인가?**

`POST /api/books`는 `cohortId`를 필요로 한다. 그런데 수료생 상세 경로(`/students/:studentId/create`)에는 URL에 `cohortId`가 없다. 수료생 데이터에서 소속 기수를 역조회하거나, MVP 범위에서 단일 기수를 하드코딩하는 방법 중 선택이 필요했다.

**2. `EditSession` 타입을 `api.ts`의 `createBook` 인자로 받으면 web-internal 순환 의존이 생기지 않는가?**

`api.ts`는 `lib` 레이어의 다른 파일(`edit-session.ts`)을 import한다. 이것은 같은 앱 내에서의 import이므로 순환 의존이 발생하지 않는다. 문제없음.

## 시도한 것들 (Attempts)

1. **`cohortId` 하드코딩 채택:** MVP 단계에서 기수는 `cohort-2026-01` 하나뿐이다. 역조회 로직을 추가하면 API 호출 1회가 더 필요하고 오케스트레이션 진입 전 실패 지점이 생긴다. 하드코딩을 선택하고 알려진 제한사항으로 문서화했다.

2. **`BookCreateStatus` 타입으로 상태 관리 단순화:** `"idle" | "loading" | "success" | "error"` 유니온 타입을 정의해 `bookUid`와 `errorMessage`를 별도 state로 분리했다. 하나의 상태 객체로 합치는 방법도 있었지만, 각 상태값이 독립적으로 사용되고 `useState` 3개로 명확하게 표현되므로 단순한 분리 방식을 채택했다.

3. **`TEXT` 상수 중앙 집중:** 버튼 레이블, 성공/에러 텍스트를 컴포넌트 최상단 `TEXT` 상수로 뺐다. 편집 폼 두 곳에서 동일한 레이블을 사용하므로, 추후 문구 수정 시 한 곳만 바꾸면 된다.

## 최종 해결 (Resolution)

- `apps/web/src/lib/api.ts`: `BookCreateResult` 타입 + `createBook()` 함수 추가
  - `POST /api/books`, `Content-Type: application/json`, `Idempotency-Key` 헤더 포함
  - non-ok 응답 시 body의 `message` 필드를 에러 메시지로 사용
- `apps/web/src/app/students/[studentId]/create/EditForm.tsx`:
  - `cohortId`, `studentId` prop 추가
  - `BookCreateStatus` + `bookUid` + `errorMessage` state 추가
  - `handleComplete` async 전환, `createBook` 호출
  - 성공: `bookUid` 표시 + 비활성 "주문하기(준비 중)" 버튼
  - 에러: 에러 메시지 + "다시 시도" 버튼 레이블
  - 로딩: 버튼 비활성화 + "책 생성 중..." 레이블
- `apps/web/src/app/cohorts/[cohortId]/create/CohortEditForm.tsx`: 동일 처리
- `apps/web/src/lib/__tests__/api.test.ts`: `createBook` 8개 테스트 추가 (총 91개)

## 배운 것 (Lessons Learned)

- 컴포넌트 테스트 환경(jsdom)이 미구성인 상황에서 UI 상태 전이는 자동화 테스트로 커버할 수 없다. 이 경우 비즈니스 로직(fetch 함수)을 컴포넌트 밖 `lib/api.ts`로 분리하면, 해당 함수만 단위 테스트로 검증할 수 있다. 컴포넌트 상태 전이 테스트는 jsdom 환경이 확보된 뒤 추가하는 것이 현실적이다.
- `idempotencyKey`를 클라이언트에서 생성할 때 `${id}-${Date.now()}`를 사용하면 같은 세션에서 "다시 시도" 버튼을 누를 때마다 새 키가 생성된다. 이는 의도된 동작이다 — 실패한 요청과 재시도를 SweetBook API가 별개 요청으로 처리하게 한다.
