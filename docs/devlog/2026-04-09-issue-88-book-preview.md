# 개발 일지: #88 BookPreview 컨테이너 + 회귀 fix 3건

**일자:** 2026-04-09
**관련 이슈:** #88
**관련 역할:** build, qa

## 배경 (Context)

#85~#87에서 PageRenderer + 4개 템플릿 정적 데이터를 만들었으니, 이제 사용자가 실제로 책을 미리 볼 수 있는 컨테이너(BookPreview)와 EditForm 진입점이 필요했다. 이 작업 자체는 PRD §3.5, §4.3 그대로 구현하면 되지만, 실제로 페이지를 열어보니 #82 이후 누적된 회귀 버그 3건이 한꺼번에 드러났다.

## 핵심 결정: payload-mapper 로직을 어떻게 재사용할 것인가

프리뷰는 책 생성과 똑같이 페이지별 파라미터를 만들어야 한다. 백엔드 `payload-mapper.ts`(398줄, 12종 페이지 매퍼)를 어떻게 재사용할지가 #88 최대 결정이었다.

| 옵션 | 평가 |
|------|------|
| A. 백엔드 로직을 프론트에 복사 | 빠르지만 #83에서 이미 한 번 회귀(레거시 ID 미동기화) 발생. 매퍼가 12종으로 늘어 양쪽 동기화 부담이 큼. |
| **B. POST /api/preview-payload 신규 엔드포인트** | payload-mapper가 단일 진실. #82 정합성 테스트가 그대로 적용. 모달 열 때 1회 fetch라 네트워크 비용 미미. |
| C. packages/ 공유 패키지 추출 | 모노레포 구조 변경 필요, #88 범위 초과. |

**B 선택.** `server.ts`의 `/api/books` 핸들러에 있던 DB→Cohort[] 변환 로직을 `loadCohortFromDb()` 헬퍼로 추출하고, `/api/preview-payload`가 이를 재사용해서 `buildCoverPayload + buildContentsPayload` 결과를 그대로 JSON으로 반환한다. 프론트의 `BookPreview`는 모달이 열릴 때 한 번 fetch하고, 응답의 `templateUid`를 `template-resolver.ts`로 정적 `TEMPLATES` 객체에 매핑한 뒤 PageRenderer에 전달.

## 발견된 회귀 버그 3건

브라우저에서 처음 페이지를 열어보니 PRD §3.5/§4.3 외에 3개의 별도 회귀가 한꺼번에 나왔다. 모두 #82 머지 이후에 잠재되어 있었고, 이번에 처음으로 production-like 흐름이 동작하면서 드러난 것들.

### Bug 1: retrospective Json 객체가 React child로 렌더링됨

**증상:** `/students/student-001` 페이지가 `Objects are not valid as a React child` 런타임 에러로 깨짐.

**원인:** #82에서 백엔드 `Student.retrospective`를 `string`에서 `string | RetrospectiveData(6필드 객체)`로 확장했지만, 프론트의 `apps/web/src/lib/api.ts`의 `StudentPortfolio.retrospective` 타입과 `students/[studentId]/page.tsx`의 `{student.retrospective}` 직접 렌더링은 `string` 가정 그대로였다. 그동안 mock data만 사용했기 때문에 미발견.

**수정:** api.ts에 `RetrospectiveData` 타입 추가 + page.tsx에 `formatRetrospective()` 헬퍼 추가하여 객체이면 6개 필드를 공백으로 합쳐 텍스트로 변환.

### Bug 2: 502 Bad Gateway — collagePhotos 이중 인코딩

**증상:** "내지 추가" 단계에서 SweetBook이 `"collagePhotos는 1~9장의 사진이 필요합니다. (현재: 0장)"` 400 에러 반환.

**원인:** `payload-mapper.ts:galleryPage`가 `ContentPagePayload.parameters: Record<string, string>` 타입 제약 때문에 `collagePhotos: JSON.stringify(photos)`로 배열을 문자열화했고, 그 다음 `sweetbook-api.ts:addContentsPage`가 `JSON.stringify(payload.parameters)`로 parameters 객체 전체를 또 한 번 직렬화. **결과는 `collagePhotos` 값이 escape된 문자열 `"[\"url1\",\"url2\"]"`** — SweetBook이 배열로 파싱하지 못해 0장으로 인식. payload-mapper 단위 테스트는 매퍼 결과만 검증했고 실제 SweetBook 호출은 안 했기 때문에, #81 검증(raw curl) → #82 매퍼 단위 테스트 → #87 PageRenderer 통합 어디서도 잡지 못함.

**수정 (옵션 A — hack):** `sweetbook-api.ts:addContentsPage`에서 parameters를 직렬화하기 전, 값이 `[...]` 형태 문자열이면 한 번 parse해서 배열로 복원. 변경 범위가 5줄이라 즉시 해결 가능. 정식 fix(타입을 `Record<string, string | string[]>`로 확장)는 다른 array 파라미터(`photos[]` 등)가 추가될 때 별도 리팩토링 이슈로 진행 권장 — 현재 코드에 명시 주석 표시.

### Bug 3: EditForm 토글 회귀 (#84에서 이미 수정됨)

#83 머지 직후부터 EditForm 토글이 레거시 ID(`project:N`)와 새 ID(`project-summary:N`)가 매칭 안 되어 사실상 무효였던 버그. #84에서 PageBlockList 추출과 함께 수정 완료. 이 회귀는 데이터 스키마와 UI를 따로 머지한 게 원인이었다.

## 시도한 것들

1. **모달 fetch 패턴**: useEffect 안에서 fetch 호출. React 19의 `react-hooks/set-state-in-effect` 린트 경고가 떴지만, 모달 open/dependency 변화 시 1회성 초기화는 안전하므로 명시적 disable comment.
2. **template-resolver로 정적 매핑**: 백엔드가 templateUid 문자열을 보내고 프론트가 4개 정적 TEMPLATES 객체에 매핑. 알 수 없는 UID는 null 반환 → BookPreview가 "알 수 없는 템플릿" 메시지 표시.
3. **표지 vs 내지 컨테이너 폭 분기**: 표지는 spread(1716)이고 내지는 단면(864)이므로 `isCover` 플래그로 templateWidth 결정.

## 최종 해결

- `apps/api/src/server.ts`: `loadCohortFromDb()` 추출 + `POST /api/preview-payload` 라우트
- `apps/api/src/lib/sweetbook-api.ts`: collagePhotos 이중 인코딩 hack fix
- `apps/web/src/components/preview/BookPreview.tsx`: 모달 + 페이지 네비 + 키보드(Esc/←/→)
- `apps/web/src/components/preview/template-resolver.ts`: templateUid → TEMPLATES 매핑
- `apps/web/src/lib/api.ts`: `getPreviewPayload` + `RetrospectiveData` + `StudentPortfolio.cohortId/retrospective` 타입 확장
- `apps/web/src/app/students/[studentId]/page.tsx`: `formatRetrospective()` 헬퍼
- EditForm/CohortEditForm에 "프리뷰 보기" 버튼
- 테스트 21개 신규 (template-resolver 6 + BookPreview 15)

## 배운 것 (Lessons Learned)

- **단위 테스트가 SweetBook API 호출을 모킹하면 실제 직렬화 버그를 못 잡는다.** payload-mapper 매퍼 테스트는 `parameters.collagePhotos`가 JSON 문자열이어도 통과한다 — 왜냐하면 테스트가 `JSON.parse()`로 검증하기 때문. 그러나 실제 sweetbook-api.ts는 이 문자열을 객체에 넣어 한 번 더 stringify한다. **외부 API와 실제로 한 번 호출해보는 검증(#81 sandbox 검증 같은)이 단위 테스트와 별개로 가치가 있다.** 다만 #81 때는 raw curl로 호출했기 때문에 production 코드 경로를 안 거쳤다 — 이게 함정이었다.
- **데이터 스키마 변경은 호출부까지 같은 PR에서 검증해야 한다.** Bug 1(retrospective)과 Bug 3(레거시 ID)이 모두 같은 패턴 — 백엔드/타입은 바꿨지만 UI 호출부는 안 바꿔서 컴파일은 통과해도 런타임에서 깨짐. 이번 PR에서 발견된 게 그나마 다행이고, 미래에는 머지 전에 페이지를 직접 한 번 열어보는 절차를 추가할 만하다.
- **모달 fetch는 의외로 단순한 패턴**이지만 React 19 린트 규칙(`set-state-in-effect`)이 까다롭다. 모달 open 시 1회성 초기화는 의도적인 패턴이므로 disable comment로 명시 — 단, comment에 "왜 disable했는지" 같이 적기.
- **payload-mapper를 API로 wrapping(옵션 B)이 옳았다.** 옵션 A(코드 복사)였다면 #82~#84에 추가된 정합성 테스트 모음을 프론트에 또 만들거나, 동기화 부담을 떠안았을 것이다. 단일 진실 원칙은 1인 개발자에게 특히 중요.
