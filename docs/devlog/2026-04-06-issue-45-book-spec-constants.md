# 개발 일지: #45 BookSpecs 상수 설정 및 페이지 수 보정 로직

**일자:** 2026-04-06
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

Books API 오케스트레이션의 첫 번째 레이어를 구현하는 이슈. `POST /v1/books/{bookUid}/finalization`은 페이지 수가 판형 규칙(최소 24페이지, 2페이지 단위)을 만족하지 않으면 실패한다. 수료생 데이터 기반의 콘텐츠 페이지 수는 가변적이므로, 최종화 직전에 규칙에 맞게 자동 보정하는 유틸이 필요했다.

`bookSpecUid`와 `templateUid` 값도 이 이슈에서 함께 확정했다. 결정 배경은 ADR-003 참조.

## 문제 (Problem)

`apps/api`에 테스트 환경이 전혀 없었다. `apps/web`은 Vitest가 이미 도입되어 있었지만, `apps/api`는 `package.json`에 `test` 스크립트조차 없는 상태였다.

또한 `templateUid` 실제 값을 Sandbox BookSpecs API에서 직접 조회해야 했는데, PRD에는 "사전 검증한 templateUid를 상수로 고정한다"는 방침만 있고 구체적인 값은 없었다.

## 시도한 것들 (Attempts)

1. **apps/api Vitest 설정:** `apps/web`과 동일하게 `vitest.config.ts` + `"vitest": "^4.1.2"` devDependency 추가. `environment: "node"`로 설정. `npm test` 스크립트 연결. 문제 없이 동작.

2. **templateUid 실제 조회:** Sandbox API `GET /v1/templates?bookSpecUid=PHOTOBOOK_A4_SC`를 직접 호출. 알림장A/B/C, 일기장A/B, 구글포토북A/B/C 테마 총 50여 개 템플릿이 반환됨. 부트캠프 포트폴리오 북 맥락에서 "알림장" 테마가 가장 적합하다고 판단, 알림장A의 표지·내지 UID를 선택.

3. **env 변수 vs 하드코딩 검토:** `book-spec.ts`에서 `PHOTOBOOK_A4_SC` 상수는 코드에 직접 정의 (값이 불변 판형 규칙이므로). `templateUid`는 Sandbox/Production 환경마다 다를 수 있으므로 `process.env`에서 주입하는 방식으로 분리. (ADR-003 참조)

## 최종 해결 (Resolution)

- `apps/api/src/config/book-spec.ts`: `PHOTOBOOK_A4_SC` 규칙 상수(MIN_PAGES=24, MAX_PAGES=130, PAGE_STEP=2) + env 기반 UID 3개 export
- `apps/api/src/lib/page-adjuster.ts`: `adjustPageCount(count)` — 최댓값 초과 시 throw, 최솟값 보정 후 홀수 올림
- `apps/api/src/__tests__/page-adjuster.test.ts`: 15개 테스트 (경계값, 홀수 올림, 최댓값 직전 129→130, 음수 보정 포함)
- `.env` + `.env.example`: `BOOK_SPEC_UID=PHOTOBOOK_A4_SC`, `COVER_TEMPLATE_UID=75HruEK3EnG5`, `CONTENTS_TEMPLATE_UID=6YuhM8awvNsQ` 추가

## 배운 것 (Lessons Learned)

- Sandbox API 템플릿 목록이 방대할 때는 `templateKind`(cover/content/divider 등) + `theme` 필터로 빠르게 좁힐 수 있다.
- 판형 규칙 상수(MIN/MAX/STEP)는 코드에 직접 정의해도 무방하지만, 식별자(UID)는 반드시 env로 분리해야 한다. Sandbox와 Production의 UID가 달라질 수 있기 때문이다.
- `apps/api` Vitest 설정은 `apps/web`과 거의 동일하므로, 신규 Express 앱 추가 시 같은 패턴을 그대로 복사해도 된다.
