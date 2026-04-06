# 개발 일지: #47 POST /api/books 오케스트레이션 엔드포인트 구현

**일자:** 2026-04-07
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

#46에서 EditSession → Books API payload 매퍼를 완성했다. 이 매퍼를 실제로 호출해 SweetBook Books API 4단계(초안→표지→내지 N회→최종화)를 순차 실행하는 오케스트레이터가 없으면, 프론트엔드의 "편집 완료" 버튼을 눌러도 책이 생성되지 않는다. 이 이슈는 그 오케스트레이션 레이어를 `POST /api/books` 엔드포인트로 확립한다.

## 문제 (Problem)

**1. SweetBookClient를 어떻게 테스트 가능하게 만들 것인가?**

Books API는 외부 Sandbox에 실제 HTTP 요청을 보낸다. 오케스트레이션 로직을 단위 테스트하려면 클라이언트를 주입식(dependency injection)으로 설계해야 한다. 그렇지 않으면 테스트마다 Sandbox에 요청이 나가거나, 전체 `fetch` 모듈을 전역으로 mock해야 하는 문제가 생긴다.

**2. 표지/내지 엔드포인트가 `multipart/form-data`를 요구한다**

`POST /v1/books/:uid/cover`와 `POST /v1/books/:uid/contents`는 `application/json`이 아닌 `multipart/form-data`를 요구한다(PRD §22.2). `parameters`는 JSON 문자열로 `form.append("parameters", JSON.stringify(params))`로 넣어야 한다. 추가 라이브러리 없이 Node 20 내장 `FormData`와 `fetch`로 처리 가능하다.

**3. 중복 요청 차단 범위**

PRD §22.6에서 "앱 내부에서도 진행 중 상태에서 중복 클릭을 막아야 한다"고 명시한다. 이를 DB 없이 처리하는 방법이 필요했다. 메모리 `Set<string>`으로 `Idempotency-Key`를 추적하고, `finally`에서 반드시 제거하는 패턴을 채택했다.

## 시도한 것들 (Attempts)

1. **SweetBookClient 인터페이스 + 팩토리 함수 분리:** `sweetbook-api.ts`에 `SweetBookClient` 인터페이스를 정의하고, `createSweetBookClient(baseUrl, apiKey)`가 구현체를 반환한다. 오케스트레이터(`orchestrate-book.ts`)는 인터페이스만 의존하므로, 테스트에서 `vi.fn()`으로 만든 mock 객체를 주입할 수 있다.

2. **idempotencyKey 파생 전략:** 사용자가 보낸 단일 `Idempotency-Key`에서 `${key}-draft`, `${key}-cover`, `${key}-contents-${i}`, `${key}-finalize`를 파생시켰다. 각 SweetBook API 호출이 독립적인 멱등성 키를 가지면서, 전체 오케스트레이션이 하나의 키로 식별된다.

3. **OrchestrationError 커스텀 에러:** `step: "draft" | "cover" | "contents" | "finalize"` 필드를 포함하는 커스텀 에러 클래스를 정의했다. 라우트 핸들러에서 어느 단계에서 실패했는지 응답 JSON에 포함할 수 있어, 디버깅과 클라이언트 측 에러 표시가 용이하다.

## 최종 해결 (Resolution)

- `apps/api/src/lib/sweetbook-api.ts`: `SweetBookClient` 인터페이스 + `createSweetBookClient()` 팩토리
  - Node 20 내장 `FormData`/`fetch` 사용 (추가 의존성 없음)
  - `assertOk(response, step)` 헬퍼로 HTTP 오류를 통일 처리
- `apps/api/src/lib/orchestrate-book.ts`: `orchestrateBook(input, client, cohortsData)` 4단계 순차 실행
  - `buildCoverPayload` / `buildContentsPayload` 호출 후 클라이언트에 전달
  - 각 단계 실패 시 `OrchestrationError(message, step)` throw, 이후 단계 미실행
- `apps/api/src/server.ts`: `POST /api/books` 라우트 추가
  - `Idempotency-Key` 헤더 필수 검증 (없으면 400)
  - `inProgressKeys: Set<string>`으로 진행 중 중복 409 차단
  - `OrchestrationError` → 502, 기타 → 500
- `apps/api/src/__tests__/orchestrate-book.test.ts`: 17개 단위 테스트 (QA에서 2개 추가)
  - 정상 흐름 7, 에러 처리 7, cohort-showcase 2, idempotencyKey 인덱스 연속성 1

## 배운 것 (Lessons Learned)

- `multipart/form-data` 호출 시 `Content-Type` 헤더를 수동으로 설정하면 안 된다. Node의 `fetch`가 `FormData`를 body로 받으면 `boundary`가 포함된 `Content-Type`을 자동으로 설정한다. 수동으로 `Content-Type: multipart/form-data`만 넣으면 boundary가 누락되어 서버가 파싱에 실패한다.
- 오케스트레이션 레이어의 테스트는 "4단계가 실행됐는가"보다 "각 단계에 올바른 인자가 전달됐는가"를 검증하는 것이 더 가치 있다. 특히 idempotencyKey 파생 규칙과 bookUid 전파는 코드를 읽어서는 놓치기 쉬운 회귀 버그 지점이다.
