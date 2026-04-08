# 개발 일지: CRUD 관리 UI (운영자 대시보드)

**일자:** 2026-04-09
**관련 이슈:** 없음 (PRD/이슈 분해 없이 즉흥 추가)
**관련 역할:** build, qa

## 배경 (Context)

#77~#79에서 Cohort/Student/Project 9개 CRUD API 엔드포인트를 만들었지만, 그 위에 올릴 UI가 없는 채로 #80~#88까지 진행되었다. 즉 백엔드 CRUD는 dead code처럼 존재했고, 데이터는 seed 스크립트로만 들어갔다. 사용자가 #88 작업 중 "근데 우리가 만들었던 CRUD에 대한 UI가 없네?"라고 지적하면서 발견. 평가:

- MVP 시연에서 운영자가 직접 기수→수료생→프로젝트를 등록하고 그걸로 책 만드는 흐름이 **진짜 풀스택의 가치**를 보여준다.
- seed에만 의존하면 백엔드 9개가 정말 dead처럼 보인다.
- 1인 개발자 5원칙 #1 "나중에는 거짓말이다" — v2로 미루면 영영 안 함.

## 작업 결정

### 정식 절차 vs 즉흥 진행

평소라면 `/spec`을 호출해 PRD를 만들고 이슈로 분해한 뒤 epic으로 진행하는 게 옳다. 그러나 사용자가 "지금 브랜치에서 바로 작업해줘"라고 명시. #88 PR이 이미 commit 안 된 fix들로 부풀어 있었지만, **컨텍스트가 같은 영역(CRUD↔책 생성 흐름)이고 1인 개발이라 리뷰 부담은 본인이 진다**는 점에서 즉흥 진행을 수용. 단, devlog로라도 결정 배경과 스코프를 박아두기로 함.

### 스코프: 작게 유지 (v1에 정말 필요한 것만)

각 모델의 모든 필드를 폼에 받지 않는다. 책 렌더링 fallback이 있는 신규 필드는 v2로:

| 모델 | 폼 포함 | 폼 제외 (v2) |
|------|--------|------------|
| Cohort | name, program, graduationDate, summary, tagline | operatorMessage, philosophy, logoUrl, photos[], partnerInfo, stats |
| Student | name, roleTrack, bio, techStack, mentorComment, photos, certificateMessage | retrospective Json, interests, achievements, portfolioLinks, thanksMessage |
| Project | title, summary, contribution, links | problem, solution, techChoices, result |

`techStack`/`photos`/`links`처럼 string[] 필드는 콤마 분리 단일 입력(`CommaListField`)으로. JSON 객체 필드(`retrospective` 6필드, `portfolioLinks` 4필드)는 v1 폼에서 제외 — 책 매퍼에 fallback이 모두 있어 비어있어도 동작한다.

### UX 패턴

- **모달 형태**: 별도 라우트 없이 같은 페이지에 다이얼로그. ESC 닫기, 배경 클릭 닫기.
- **생성/수정 통합 다이얼로그**: 같은 컴포넌트가 `initial` prop 유무로 mode 분기. `isEdit = Boolean(initial?.id)`.
- **삭제 별도 confirm**: `ConfirmDeleteDialog`로 한 번 더 확인. **API 실패 시 모달이 닫히지 않고 에러 표시** (사용자가 무슨 일이 일어났는지 알아야 함).
- **mutation 후 `router.refresh()`**: 클라이언트 state 추가 관리 없이 Next.js가 server component를 재실행하여 자동 데이터 갱신.

### 폴더 구조

```
apps/web/src/components/admin/
  ├── Modal.tsx                    공통 모달 + ESC 닫기
  ├── ConfirmDeleteDialog.tsx      삭제 확인 + 에러 처리
  ├── form-fields.tsx              TextField, TextAreaField, CommaListField
  ├── CohortFormDialog.tsx         생성/수정 통합
  ├── StudentFormDialog.tsx        생성/수정 통합
  ├── ProjectFormDialog.tsx        생성/수정 통합
  ├── CohortAdminPanel.tsx         대시보드용
  ├── StudentAdminPanel.tsx        기수 상세용
  ├── StudentEditDeletePanel.tsx   수료생 상세 헤더 (수정/삭제)
  └── ProjectAdminPanel.tsx        수료생 상세용
```

`api.ts`에 9개 CRUD 함수 + 공통 헬퍼(`postJson`/`patchJson`/`deleteRequest`) 추가. 백엔드가 `{ cohort: {...} }` / `{ student: {...} }` / `{ project: {...} }`로 wrap해 응답하므로 함수 안에서 unwrap.

## 시도한 것들 (Attempts)

1. **공통 헬퍼 추출 vs 함수마다 fetch**: 처음엔 9개 함수 각각에 fetch+에러처리를 인라인으로 쓰려 했으나, 헬퍼 3개(`postJson`/`patchJson`/`deleteRequest`)로 묶으니 9개 함수가 평균 5줄로 압축됨. 응답 wrapping과 에러 추출이 한 곳에 모이므로 회귀 위험도 낮음.
2. **수료생 수정 위치**: 처음엔 cohort 상세에 수정 모달까지 넣으려 했으나, 수료생 폼이 7개 필드라 cohort 상세에 모달이 들어가면 너무 무거워짐. **수료생 수정/삭제는 수료생 상세 페이지(`/students/[id]`)의 헤더 액션으로 분리**(`StudentEditDeletePanel`). 삭제 후엔 cohort 페이지로 자동 이동.
3. **백엔드 응답 보강**: GET `/api/students/:id` 응답에 `cohortId`가 빠져있어, 수료생 수정/삭제 후 어디로 돌아갈지 알 수 없었다. 백엔드 응답에 `cohortId` 한 줄 추가 + 프론트 `StudentPortfolio` 타입 동기화. 같은 김에 `projects[].id`도 응답에 추가했다 (CRUD 대상 식별).

## QA 결과

| 영역 | 테스트 | 검증 |
|------|------|------|
| `form-fields` | 12 | CommaListField 분리/trim/빈 항목 제거/한글 포함 |
| `api-crud` | 18 | 9개 함수의 경로/메서드/응답 unwrap/에러 처리/Content-Type |
| `ConfirmDeleteDialog` | 6 | API 실패 시 모달 유지 + 에러 표시 (가장 위험한 회귀 방지) |
| `CohortFormDialog` | 8 | create/edit 분기 — `initial.id` 유무로 POST vs PATCH |

총 +44개 테스트, 367개 통과. 발견된 버그 0건. happy-dom 차이 1건만 테스트 코드에서 흡수.

## 배운 것 (Lessons Learned)

- **백엔드에 dead endpoint를 만들지 말 것.** #77~#79가 만들어진 시점에 UI까지 함께 epic으로 묶었어야 했다. 백엔드 9개 + 한참 뒤에 UI 0개 상태가 4-5번 머지 동안 유지됐고, 사용자가 명시적으로 지적할 때까지 발견 못했다. 다음 epic은 "API + UI"를 한 단위로 묶을 것.
- **PRD 없는 즉흥 작업의 부작용 vs 가치**. 정식 절차(`/spec` → 이슈 분해 → 작은 PR 여러 개)를 건너뛴 대가는 PR이 거대해지고 리뷰 부담이 커진다는 점. 반면 컨텍스트가 살아있을 때 한 번에 끝낸 가치는 분명. **1인 개발자라 trade-off가 본인에게 돌아오므로** 즉흥 진행 자체는 합리적이지만, devlog로라도 결정 배경을 박아두지 않으면 미래의 본인이 "왜 이게 한 PR에 다 들어왔지"를 이해 못 한다.
- **router.refresh() 패턴이 강력하다.** mutation 후 자체 state 동기화 없이 server component를 재실행하면 데이터 일관성이 자동 보장됨. 클라이언트 캐시 관리 코드가 0줄. Next.js App Router의 가장 큰 장점.
- **콤마 분리 입력 vs 다중 input**. `CommaListField`는 빠르게 만들 수 있지만 사용성이 거칠다 (콤마를 빠뜨리면 안 됨). v2에서 chip input으로 개선 후순위로 등록.

## v2 후순위 (TODO)

- 신규 필드 입력 UI: retrospective Json 6필드, portfolioLinks 4필드, project의 problem/solution/techChoices/result
- ChipInput 컴포넌트로 콤마 분리 입력 대체
- 권한/인증 (현재 모든 사용자가 CRUD 가능)
- Optimistic UI (router.refresh 대신)
- StudentFormDialog/ProjectFormDialog의 단위 테스트 (CohortFormDialog와 패턴 동일하므로 우선순위 낮음)
