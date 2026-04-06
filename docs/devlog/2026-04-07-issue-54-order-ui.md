# 개발 일지: #54 주문하기 UI — 배송 정보 폼 + 결과 화면 구현

**일자:** 2026-04-07
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

#53에서 `GET /api/credits`와 `POST /api/orders` 백엔드 라우트가 완성됐다. EditForm·CohortEditForm의 성공 상태에 있던 "주문하기 (준비 중)" disabled 버튼을 실제 주문 플로우로 전환하는 것이 이 이슈의 목적이다.

## 문제 (Problem)

**1. 주문 상태가 책 생성 상태와 독립적으로 관리되어야 한다.**

`BookCreateStatus`는 `idle | loading | success | error`로 이미 정의되어 있었다. 주문 흐름은 책 생성이 성공한 뒤에야 시작하므로, `OrderStatus`를 별도 타입으로 분리하고 독립된 state로 관리해야 했다. 책 생성 오류와 주문 오류가 UI에서 구분되어야 했기 때문이다.

**2. 배송 폼 4개 필드의 상태 관리 방식.**

필드가 4개이므로 `useState` 4개로 펼치는 것보다 `OrderShipping` 객체 하나로 묶는 것이 더 적합했다. `setShipping((prev) => ({ ...prev, [key]: e.target.value }))` 패턴으로 단일 핸들러가 4개 필드를 처리한다.

**3. `getCredits()`는 구현했지만 UI에 미노출 결정.**

잔액 표시는 이슈 범위에서 "선택"으로 명시되어 있었다. MVP에서는 배송 폼과 주문 결과에만 집중하고, 잔액 표시 UI는 추가하지 않았다. 그러나 `getCredits()`는 api.ts에 구현해두고 테스트도 작성했다 — 추후 UI 연결이 필요할 때 라이브러리 계층이 이미 준비되어 있다.

## 시도한 것들 (Attempts)

1. **단일 `OrderShipping` 상태 객체로 폼 관리:** `useState<OrderShipping>({ recipientName: "", ... })`로 초기화하고, input의 `onChange`에서 key를 동적으로 사용해 한 핸들러로 4개 필드를 모두 처리. 중복 핸들러 4개를 만들지 않아도 됐다.

2. **배송 폼 반복 렌더링:** 4개 필드 정의를 인라인 배열 `[{ id, label, key }]`로 선언하고 `.map()`으로 렌더링했다. 필드 추가/변경 시 배열 항목만 수정하면 된다.

3. **`getCredits` 미노출 + 테스트 작성:** 잔액 UI 없이도 `getCredits()`가 production 코드에 포함됐으므로 `/qa`에서 테스트 3개를 추가했다 (성공/URL/non-ok).

## 최종 해결 (Resolution)

- `apps/web/src/lib/api.ts`:
  - `CreditsData`, `OrderShipping`, `OrderResult` 타입 추가
  - `getCredits()`: `GET /api/credits` 호출, non-ok 시 throw
  - `createOrder()`: `POST /api/orders`, Idempotency-Key 포함, non-ok 시 body.message로 throw (json 파싱 실패 시 기본 메시지 fallback)
- `apps/web/src/app/students/[studentId]/create/EditForm.tsx`:
  - `OrderStatus` 타입 + `shipping`, `orderStatus`, `orderUid`, `orderErrorMessage` 상태 추가
  - `handleOrder()` 비동기 함수: `${studentId}-order-${Date.now()}` idempotency key 생성
  - 성공 상태 UI: 배송 폼 → 주문하기 버튼 → 주문 성공(orderUid) / 주문 실패(재시도) 분기
- `apps/web/src/app/cohorts/[cohortId]/create/CohortEditForm.tsx`: 동일 패턴 적용, key는 `${cohortId}-order-${Date.now()}`
- `apps/web/src/lib/__tests__/api.test.ts`:
  - `createOrder` 7개 (성공/URL/헤더/바디/non-ok/message/json-fallback) + `getCredits` 3개 — web 총 102개

## 배운 것 (Lessons Learned)

- **상태 분리는 명시적으로.** 책 생성 상태와 주문 상태가 같은 `status` 변수를 공유했다면 "책 에러인지 주문 에러인지" 구분이 불가능했다. 단계마다 독립 상태를 두는 것이 UI 분기 로직을 단순하게 만든다.
- **구현했으면 테스트도.** `getCredits()`는 UI에 미노출이지만 production 코드다. "선택 기능이라 테스트 스킵"이 아니라 `/qa`에서 커버했다 — 나중에 UI 연결 시 라이브러리 계층의 신뢰도가 보장된다.
- **폼 필드 반복은 배열 선언으로.** 4개 이상의 유사 필드는 핸들러를 개별 정의하지 않고 `[{ id, label, key }]` 배열 + `.map()`으로 처리한다. 필드가 추가돼도 배열 항목만 늘리면 된다.
