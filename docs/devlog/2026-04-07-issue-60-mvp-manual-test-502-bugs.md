# 개발 일지: MVP 수동 테스트 — 502 버그 3건 연쇄 디버깅

**일자:** 2026-04-07
**관련 버전:** v0.1.0
**관련 역할:** build, qa
**관련 이슈:** #60 (MVP 수동 테스트 시나리오)

## 배경 (Context)

이전까지 단위 테스트는 모두 통과했지만, 실제 브라우저에서 "편집 완료" 버튼을 눌러 `POST /api/books`를 호출하면
502 Bad Gateway가 반복적으로 발생했다. 단위 테스트가 잡지 못한 통합 문제가 3건 연쇄적으로 존재했다.

## 문제 (Problem)

1. **1차 502 — createDraft 응답 파싱 오류**
   SweetBook API는 `{ data: { bookUid: "..." } }` 형태로 응답하는데,
   클라이언트 코드는 최상위 `response.bookUid`를 읽고 있었다.
   결과적으로 `bookUid`가 항상 빈 문자열이 되어 이후 모든 호출이 URL에 빈 bookUid를 포함하게 됐다.

2. **2차 502 — 커버 템플릿 파라미터 불일치**
   기존에 선택한 `알림장A (75HruEK3EnG5)` 템플릿은 `childName`, `schoolName` 등 어린이집/유치원 전용 필드를 요구했다.
   포트폴리오 북 도메인에는 없는 필드이므로 templateUid를 변경해야 했다.
   또한 ESM 모듈 호이스팅 문제로 `COVER_TEMPLATE_UID` 환경변수 상수가 모듈 초기화 시점에 빈 문자열로 평가됐다.

3. **3차 502 — 페이지 수 부족으로 최종화 실패**
   `빈내지 (2lpHl6oLAYss)` 템플릿은 내지 API 호출 횟수가 `pageCount`에 반영되지 않는다는 것을 확인했다.
   별도로, 커버 템플릿이 `pageCount`에 -2를 기여하는 구조여서 내지 24개만 올려도 `pageCount = 22`가 되어
   최솟값 24에 미달했다.

## 시도한 것들 (Attempts)

### 버그 1: createDraft 파싱 수정

- **시도:** `raw.data?.bookUid ?? raw.bookUid ?? raw.data?.uid ?? ""` 체인으로 중첩/flat 양쪽을 처리
- **결과:** 성공. SweetBook sandbox가 어느 구조로 응답하더라도 bookUid를 올바르게 추출

### 버그 2: 커버 템플릿 재선정

- **시도 1:** SweetBook `/template-categories` → `/templates` API를 직접 호출해 전체 템플릿 목록 조회
- **발견:** `구글포토북A/B/C`, `일기장A/B`, `알림장A/B/C` 계열이 존재. 구글포토북 계열이 `coverPhoto`, `subtitle`, `dateRange` 세 파라미터만 요구하는 범용 구조임을 확인.
- **시도 2:** `구글포토북A (3S1ceGaglj5i)` 로 변경, `payload-mapper.ts`의 파라미터명 교체
- **ESM 문제:** `book-spec.ts`의 모듈 레벨에서 `process.env.COVER_TEMPLATE_UID`를 읽으면, ESM `import`는 호이스팅되어 `dotenv.config()` 실행 전에 평가되어 항상 빈 문자열이 됨.
- **해결:** 상수를 모듈 레벨에 두지 않고, `buildCoverPayload()` / `buildContentsPayload()` 함수 내에서 호출 시점에 `process.env.COVER_TEMPLATE_UID`를 직접 읽도록 변경.

### 버그 3: 페이지 수 보정

- **시도 1:** `내지b (3mjKd8kcaVzT)` 템플릿으로 변경 시 pageCount 반영 여부를 직접 API 호출로 검증 (curl로 1개씩 올려가며 책 목록 확인)
- **발견:** `빈내지`는 pageCount에 기여 안 함. `내지b`는 호출당 +1 기여.
- **발견:** 구글포토북A 커버가 `pageCount = -2` 기여 (내부적으로 커버/뒷면 2페이지가 별도 계산됨).
- **시도 2:** `COVER_PAGE_OFFSET: 2`를 `PHOTOBOOK_A4_SC` 상수에 추가, `buildContentsPayload`에서 목표 최솟값을 `MIN_PAGES + COVER_PAGE_OFFSET = 26`으로 설정.
- **검증:** curl로 26개 내지 + 구글포토북A 표지 → finalization 성공, `pageCount: 26` 확인.

## 최종 해결 (Resolution)

| 항목 | 변경 전 | 변경 후 |
|------|--------|--------|
| createDraft 파싱 | `response.bookUid` | `(raw.data ?? raw).bookUid ?? uid` |
| 커버 템플릿 | `알림장A (75HruEK3EnG5)` — 유치원 전용 파라미터 | `구글포토북A (3S1ceGaglj5i)` — 범용 파라미터 |
| 내지 템플릿 | `빈내지 (2lpHl6oLAYss)` — pageCount 미반영 | `내지b (3mjKd8kcaVzT)` — pageCount +1/호출 |
| env 읽기 방식 | 모듈 레벨 상수 (`COVER_TEMPLATE_UID = process.env...`) | 함수 호출 시점 직접 참조 (`process.env.COVER_TEMPLATE_UID`) |
| 내지 목표 최솟값 | 24 | 26 (`MIN_PAGES 24 + COVER_PAGE_OFFSET 2`) |

커버 파라미터명 변경: `childName/schoolName/periodText` → `coverPhoto/subtitle/dateRange`
내지 파라미터명 변경: `bookTitle/year/month` → `monthNum/dayNum/diaryText`

## 배운 것 (Lessons Learned)

1. **SweetBook API 응답 구조를 단위 테스트로 선제 검증해야 한다.**
   `createDraft`의 중첩 응답 파싱 버그는 단위 테스트가 있었으면 실제 테스트 전에 잡혔을 것이다.
   이번 QA 단계에서 `sweetbook-books.test.ts`를 추가해 `createDraft/createCover/addContentsPage/finalize` 모두 커버했다.

2. **ESM 환경에서 `dotenv`와 모듈 레벨 상수를 함께 쓰면 안 된다.**
   `import`는 호이스팅되어 `dotenv.config()` 실행 전에 모듈이 평가된다.
   환경변수에 의존하는 값은 반드시 함수 내부(호출 시점)에서 읽어야 한다.

3. **SweetBook 템플릿을 선택할 때 도메인 파라미터 호환성을 먼저 확인해야 한다.**
   `알림장A`는 `childName`, `schoolName` 같은 유치원 전용 필드를 요구한다.
   도메인에 맞는 파라미터 구조를 가진 템플릿(구글포토북 계열)을 선택해야 한다.

4. **커버 템플릿의 pageCount 기여 방식을 사전에 파악해야 한다.**
   구글포토북 계열 커버는 내부적으로 2페이지를 차지하므로 pageCount에 -2를 기여한다.
   내지 목표 최솟값은 `MIN_PAGES + COVER_PAGE_OFFSET`으로 계산해야 한다.
