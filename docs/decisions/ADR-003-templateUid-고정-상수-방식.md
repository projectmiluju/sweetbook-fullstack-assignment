# ADR-003: templateUid 고정 상수 방식 채택 (동적 조회 제외)

**일자:** 2026-04-06
**상태:** Accepted

## 맥락 (Context)

Books API의 `POST /v1/books/{bookUid}/cover`와 `POST /v1/books/{bookUid}/contents`는 각각 `templateUid`를 필수 파라미터로 요구한다. 이 값을 어떻게 공급할지 결정해야 했다.

SweetBook Templates API(`GET /v1/templates`)를 통해 동적으로 조회하거나, 사전에 검증한 UID를 서버 내부 상수로 고정하는 두 가지 선택지가 있었다.

## 고려한 선택지

### 선택지 A: Templates API 동적 조회

- 장점: 템플릿이 변경/추가되더라도 자동으로 반영됨. 테마 선택 기능을 나중에 붙이기 쉬움.
- 단점: 매 요청마다 외부 API를 한 번 더 호출해야 해 지연 증가. 조회 실패 시 Books API 전체 흐름이 중단됨. 이번 PRD 요구사항에 "사용자가 템플릿을 선택한다"는 항목이 없으므로 불필요한 복잡성.

### 선택지 B: 사전 검증된 UID를 env 상수로 고정

- 장점: 외부 API 의존성 1회 제거로 오케스트레이션 흐름 단순화. 장애 지점 감소. PRD §23.3의 "동적 조회 없이 사용" 방침과 일치.
- 단점: Sandbox/Production 환경 전환 시 env 값을 직접 교체해야 함. 템플릿 UID가 변경되면 env를 갱신해야 하는 운영 부담 존재.

## 결정 (Decision)

**선택지 B 채택.** PRD §23.3에서 "Templates API를 제품 기능으로 사용하지 않는다"고 명시했고, 현재 요구사항에 템플릿 선택 UI가 없다. 오케스트레이션 레이어의 복잡성을 최소화하는 것이 1인 개발 기준 더 중요하다.

구체적으로:
- 판형 규칙 상수(`MIN_PAGES`, `MAX_PAGES`, `PAGE_STEP`)는 불변 값이므로 코드에 직접 정의 (`config/book-spec.ts`)
- `bookSpecUid`, `coverTemplateUid`, `contentsTemplateUid`는 환경마다 달라질 수 있으므로 `process.env`에서 주입 (`.env.example` 문서화)

Sandbox 기준 선택한 templateUid:
- `COVER_TEMPLATE_UID`: `75HruEK3EnG5` (표지 / 알림장A 테마)
- `CONTENTS_TEMPLATE_UID`: `6YuhM8awvNsQ` (내지 / 알림장A 테마)

알림장A 테마를 선택한 근거: PHOTOBOOK_A4_SC 판형에서 제공되는 테마 중 부트캠프 포트폴리오 북(학급 기록물) 성격과 가장 가깝다. 구글포토북·일기장 테마는 개인 사용 맥락에 더 특화되어 있다.

## 결과 (Consequences)

- 긍정적: 오케스트레이션 흐름에서 외부 API 호출 1단계 제거. 코드와 흐름이 단순해짐.
- 부정적: templateUid가 SweetBook 측에서 비활성화되거나 변경되면 `.env`를 수동으로 갱신해야 함.
- 리스크: Sandbox와 Production의 templateUid가 다를 경우 배포 시 반드시 env를 교체해야 함. 누락 시 API 오류.

## 되돌릴 조건 (Reversal Triggers)

- 운영자가 템플릿을 직접 선택하는 기능이 PRD에 추가될 경우
- templateUid 로테이션이 잦아져 env 관리 비용이 높아질 경우
