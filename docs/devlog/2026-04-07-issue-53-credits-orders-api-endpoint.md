# 개발 일지: #53 Credits API + POST /api/orders 엔드포인트 구현

**일자:** 2026-04-07
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

Epic #4에서 책 생성 오케스트레이션이 완성됐다. 편집 폼의 "주문하기 (준비 중)" 버튼을 활성화하려면 두 가지가 필요했다: 잔액을 조회하는 Credits API 연동과, bookUid + 배송 정보를 받아 실제 주문을 넣는 Orders API 연동.

## 문제 (Problem)

**1. Orders API의 필수 필드가 사전에 알려지지 않았다.**

PRD 예외 처리 테이블에 "배송 필드 누락" 항목이 있었지만, 구체적으로 어떤 필드가 필요한지는 명시되지 않았다. `/spec` 단계에서 sandbox에 직접 `POST /v1/orders`를 빈 body로 호출해 400 에러 메시지에서 필수 필드를 확인했다: `Items`, `Shipping.RecipientName`, `Shipping.RecipientPhone`, `Shipping.Address1`, `Shipping.PostalCode`.

**2. Orders API payload의 케이싱이 혼합되어 있다.**

`Items[].bookUid`는 camelCase이고, `Shipping.*` 필드는 PascalCase다. 내부 타입(`OrderShipping`)은 camelCase로 정의하고, SweetBookClient 구현에서 PascalCase로 변환해 전달했다. 이 변환 책임을 lib 레이어에 두어 서버 라우트 코드가 내부 타입만 사용하도록 했다.

**3. Credits API 응답에 data 래퍼가 있다.**

실제 sandbox 응답은 `{ success: true, data: { balance, currency } }` 구조다. 하지만 API 버전이나 환경에 따라 flat 응답이 올 수 있어 `body.data ?? body` 패턴으로 양쪽을 모두 처리했다. Orders API 응답도 동일한 패턴 적용.

## 시도한 것들 (Attempts)

1. **sandbox 직접 탐색으로 필드 확인:** `/spec` 단계에서 `curl`로 빈 body POST → 에러 메시지에서 필수 필드 5개 확인, 올바른 payload로 재시도 → "Book을 찾을 수 없습니다" → 필드 이름과 구조 확정.

2. **SweetBookClient 인터페이스 확장 방식 유지:** Epic #4와 동일한 패턴으로 인터페이스에 메서드를 추가하고 팩토리에서 구현. 기존 orchestrate-book.test.ts의 makeClient()에 새 메서드 mock을 추가해 타입 오류를 해소했다.

## 최종 해결 (Resolution)

- `apps/api/src/lib/sweetbook-api.ts`:
  - `CreditsData`, `OrderShipping`, `CreateOrderPayload`, `OrderData` 타입 추가
  - `SweetBookClient`에 `getCredits()`, `createOrder()` 메서드 추가
  - 구현: `GET /credits` (data 래퍼 파싱), `POST /orders` (camelCase → PascalCase 변환)
- `apps/api/src/server.ts`:
  - `GET /api/credits` 라우트: Credits API 프록시, 실패 시 502
  - `POST /api/orders` 라우트: Idempotency-Key 검증, 배송 4개 필드 검증, 실패 시 502
- `apps/api/src/__tests__/sweetbook-orders.test.ts` (신규): 12개 테스트 (api 총 124개)
- `apps/api/src/__tests__/orchestrate-book.test.ts`: makeClient mock에 신규 메서드 추가

## 배운 것 (Lessons Learned)

- **외부 API 필드 확인은 직접 호출이 가장 빠르다.** 문서 추측보다 빈 body POST → 에러 메시지 → 필드 확정이 30초 작업이다.
- **케이싱 변환은 반드시 lib 레이어에서.** 서버 라우트가 `RecipientName` 같은 외부 API 전용 키를 알 필요가 없다. 내부 타입 camelCase를 lib이 PascalCase로 변환하면, 외부 API 스펙이 바뀌어도 lib만 수정하면 된다.
- **인터페이스 확장 시 기존 mock을 함께 갱신해야 한다.** `SweetBookClient`에 메서드를 추가하면 해당 인터페이스를 구현하는 모든 mock 객체(`makeClient()`)도 즉시 타입 오류가 발생한다. 타입체크가 이를 즉시 잡아줬다 — 타입 안전성의 가치.
