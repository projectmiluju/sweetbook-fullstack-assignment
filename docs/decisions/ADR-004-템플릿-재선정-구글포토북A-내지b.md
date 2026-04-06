# ADR-004: 템플릿 재선정 — 구글포토북A(표지) + 내지b(내지)

**일자:** 2026-04-07
**상태:** Accepted
**Supersedes:** ADR-003

## 맥락 (Context)

ADR-003에서 `알림장A` 테마(커버 `75HruEK3EnG5`, 내지 `6YuhM8awvNsQ`)를 채택했다.
MVP 수동 테스트(#60) 중 실제 SweetBook sandbox API를 호출했을 때 두 가지 문제가 발견됐다.

1. **파라미터 도메인 불일치:** `알림장A` 커버는 `childName`, `schoolName` 등 어린이집/유치원 전용 필드를 요구한다.
   포트폴리오 북 도메인에는 이 데이터가 존재하지 않아 API가 400 에러를 반환했다.

2. **빈내지 pageCount 미기여:** `빈내지 (2lpHl6oLAYss)` 내지 템플릿은 호출해도 책의 `pageCount`가 증가하지 않는다.
   결과적으로 최솟값 24를 충족하지 못해 최종화가 422 에러로 실패했다.

추가로, 커버 템플릿 교체 과정에서 ESM 모듈 호이스팅으로 인해 환경변수 상수가 빈 값으로 평가되는
구조적 문제도 동시에 수정했다.

## 고려한 선택지

### 선택지 A: 알림장A 유지 + 누락 파라미터 더미 값으로 채우기

- 장점: 기존 UID 유지.
- 단점: 도메인에 없는 필드(childName 등)에 의미 없는 값을 주입해야 함.
  유지보수 시 혼란, 향후 SweetBook이 파라미터 검증을 강화하면 다시 깨질 위험.

### 선택지 B: 구글포토북A(표지) + 내지b(내지) 로 전환

- 장점: `coverPhoto/subtitle/dateRange`(표지)와 `monthNum/dayNum/diaryText`(내지) — 두 템플릿 모두 포트폴리오 도메인과 자연스럽게 맵핑되는 범용 파라미터를 사용한다. `내지b`는 호출당 pageCount +1 기여 확인.
- 단점: ADR-003의 결정을 번복해야 함. `payload-mapper.ts` 파라미터명을 전면 교체해야 함.

## 결정 (Decision)

**선택지 B 채택.**

- 커버 템플릿: `구글포토북A (COVER_TEMPLATE_UID=3S1ceGaglj5i)`
- 내지 템플릿: `내지b (CONTENT_TEMPLATE_UID=3mjKd8kcaVzT)`

선택 근거:
- 의미 없는 더미 값 주입보다 도메인에 맞는 파라미터를 가진 템플릿을 쓰는 것이 올바른 설계다.
- `내지b`의 pageCount 기여는 sandbox API 직접 호출로 실증 확인했다.

추가 변경 사항 (동시 수정):

- `COVER_PAGE_OFFSET: 2`를 `PHOTOBOOK_A4_SC` 상수에 추가.
  구글포토북A 커버는 내부적으로 표지/뒷면 2페이지를 차지해 `pageCount`에 -2를 기여한다.
  내지 목표 최솟값 = `MIN_PAGES(24) + COVER_PAGE_OFFSET(2) = 26`.

- 환경변수 읽기 시점 변경.
  ESM에서 `import`는 호이스팅되어 `dotenv.config()` 이전에 모듈이 평가된다.
  `COVER_TEMPLATE_UID` 등을 모듈 레벨 상수로 두면 항상 빈 문자열이 된다.
  `buildCoverPayload()` 등의 함수 내에서 호출 시점에 `process.env.*`를 직접 참조하도록 수정했다.

- env 변수명 변경: `CONTENTS_TEMPLATE_UID` → `CONTENT_TEMPLATE_UID` (내지b 전환 시 명확성 개선).

## 결과 (Consequences)

- 긍정적: 실제 sandbox API 호출이 성공함. 파라미터명이 도메인 개념과 일치해 코드 가독성 향상.
- 부정적: ADR-003과 기존 테스트(`payload-mapper.test.ts`) 전면 재작성 필요 (완료).
- 리스크: Production 환경에서 동일한 templateUid가 유효한지 재확인 필요.

## 되돌릴 조건 (Reversal Triggers)

- SweetBook이 `내지b` 또는 `구글포토북A` 템플릿을 비활성화하거나 파라미터 스펙을 변경할 경우
- 운영자가 템플릿을 직접 선택하는 기능이 추가되어 동적 조회로 전환이 필요해질 경우
