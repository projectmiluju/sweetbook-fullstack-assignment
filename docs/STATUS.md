# 프로젝트 현황

**최종 업데이트:** 2026-04-08 (#86 프리뷰 템플릿 데이터 정적 저장)
**현재 버전:** v0.1.0
**배포 URL:** 없음

## 최근 변경

- **#86 프리뷰 템플릿 데이터 정적 저장:** `apps/web/src/components/preview/` 신규 디렉토리. types.ts(5종 element discriminated union), constants.ts(PAGE_WIDTH/HEIGHT, GRAPHIC_FALLBACK_COLOR), templates.ts(4개 템플릿 정적 저장 — cover/contentB/contentA/gallery), param-substitute.ts(`$$key$$` 치환 유틸). QA에서 templates.ts ↔ payload-mapper 파라미터 8종 정합성 테스트 추가 — #87 구현 시 가정 일치 보장. 테스트 228개(+37).
- **#85 책 프리뷰 선행 검증:** 3개 외부 의존성 확인. (1) 그래픽 이미지(`/api_platform_image/...`) 외부 접근 **불가** → CSS 단색 div 대체 결정. (2) Google Fonts 6종(Do Hyeon, Nanum Myeongjo, DM Serif Display 등) 모두 **가용**. (3) collageGallery는 PRD가 가정한 `flow.columns` 대신 `layout:"auto"` 블랙박스 — 사진 수별 정적 그리드 규칙으로 fallback. `/v1/templates/{uid}` 엔드포인트는 정상 동작 확인되어 #86 templates.ts 정적 저장 가능.
- **#84 EditForm 새 블록 타입 UI:** PageBlockList 공통 컴포넌트 추출 (라벨 + 설명 + 토글 + 순서 변경 통합). EditForm의 레거시 토글 섹션 2개 + 페이지 순서 섹션을 PageBlockList 1개로 통합 (~80줄 단순화). CohortEditForm에 페이지 섹션 신규 추가. **#83 머지 후 발생한 회귀 버그 수정**: EditForm 토글이 레거시 ID(`project:N`)를 사용해 새 ID(`project-summary:N`)와 매칭 안 되던 문제 해결. getPageDescription 헬퍼 + PAGE_TYPE_DESCRIPTIONS 상수. 테스트 173개(+25), 린트/타입체크 통과.
- **#83 프론트엔드 블록 ID 확장:** edit-session.ts에 PageBlockType 12종 + buildBlockId + getPageLabel 중앙화 + buildDefaultPages PRD 구성표 기반 리팩토링 (individual/cohort-showcase 분기). 레거시 시그니처 하위 호환 유지. EditForm.tsx 호출부 새 시그니처 전환. 테스트 148개(+17), 린트/타입체크 통과.
- **#82 페이지 타입 매핑 구현:** payload-mapper 전면 리팩토링. PageType 12종 정의, 페이지별 다른 templateUid+parameters 생성(접근법 A: 내지b/내지a/내지_gallery 3종 템플릿). 인터페이스 확장(ProjectSummary·StudentPortfolio·Cohort에 PRD 신규 필드), DB 변환 로직 수정, 환경변수 2개 추가(CONTENT_A_TEMPLATE_UID, GALLERY_TEMPLATE_UID). QA에서 certificateMessage 빈 문자열 fallback 버그 발견·수정. 테스트 154개(+33), 빌드/타입체크 통과.
- **DB 도입 Epic 완료 (#74~#80):** PostgreSQL 16 + Prisma ORM 도입, Docker Compose DB 서비스 추가, seed 스크립트(2기수/3수료생/5프로젝트 + 신규 필드 더미), GET 3개 엔드포인트 DB 전환, Cohort/Student/Project CRUD 9개 엔드포인트 추가, orchestrate-book DB 연동. ADR-007 작성. README 갱신(DATABASE_URL, prisma 폴더, DB 실행 절차, 기술 스택).
- **PRD 3개 승인 + 이슈 15개 생성:** 내지 콘텐츠 매핑 개선(`content-page-mapping-improvement.md`), PostgreSQL+Prisma DB 도입(`database-prisma-migration.md`), 책 프리뷰 렌더러(`book-preview-renderer.md`). #74~#88 이슈 생성, #68 업데이트. ADR-007(DB), ADR-008(프리뷰) 작성.
- **SweetBook API 템플릿 조사 완료:** A4 SC 판형 24개 템플릿의 파라미터 확인. 내지a(텍스트+사진), 내지_gallery(콜라주), 내지b(텍스트) 3종을 페이지 타입별로 사용하는 전략 확정. 프리뷰·PDF 엔드포인트 미지원 확인 → 자체 렌더러 결정.
- **UI 전면 리디자인:** SweetBook → Foliocraft 이름 변경, SKILL.md(Supanova Redesign Engine) 감사 기준 적용. 악센트 브래스→앰버(`#b45309`), 폰트 Geist→Outfit, 배경 베이지→warm stone. 전 18개 페이지/컴포넌트 스타일 전면 교체. 디자인 문서 3개(토큰/컴포넌트/와이어프레임) 현재 코드 기준 재작성. 컴포넌트 테스트 9개 추가(happy-dom). ADR-006 작성. (총 테스트 111개)
- `#67` 구조화 로깅 도입 DoD 완료: pino + pino-http 도입, Express 요청 자동 로깅 미들웨어 추가, OrchestrationError·잔액 조회·주문 생성 에러 핸들러에 logger.error 적용 (step·cause 포함), 서버 시작 메시지 logger.info 전환.
- `#65` 환경변수 시작 시 검증 DoD 완료: zod 기반 `config/env.ts` 신규 추가, `loadEnv()`로 서버 시작 시 필수 env 검증, `getEnv()`로 검증된 env 객체 접근. `process.env` 직접 참조 8곳을 `getEnv()` 호출로 전환. `book-spec.ts`에서 env 상수 export 제거. `.env.example`에 `BLANK_TEMPLATE_UID`·`CONTENT_TEMPLATE_UID` 추가. env 검증 테스트 6개 + 기존 테스트 mock 수정 (총 97개).
- `#64` 기수 데이터 JSON 전환 DoD 완료: `apps/api/data/cohorts.json` 신규 생성, `cohorts.ts`를 JSON 로더 + 타입 정의 파일로 변경, `__dirname` 기반 경로 해석으로 dev/prod 모두 동작. JSON 로더 테스트 6개 추가 (총 91개).
- `#63` Docker Compose 컨테이너화 DoD 완료: `apps/api/Dockerfile` + `apps/web/Dockerfile` (멀티스테이지 빌드) + `docker-compose.yml` + `.dockerignore` 신규 추가. `next.config.ts`에 `output: "standalone"` 추가. pnpm 모노레포 심링크 문제를 `pnpm deploy --legacy`로 해결. `docker compose up`으로 api(4000) + web(3000) 동시 기동 확인. (ADR-005)
- `#66` GitHub Actions CI 구축 DoD 완료: `.github/workflows/ci.yml` 신규 추가. `api` job — pnpm install → `pnpm test` (Vitest 85개) → `pnpm build`. `web` job — pnpm install → `pnpm lint` (ESLint) → `tsc --noEmit`. Node 20, pnpm 10, 캐시 설정 포함. README에 CI 뱃지 + Branch Protection 설정 안내 추가.
- `#60` MVP 수동 테스트 DoD 완료: `POST /api/books` 502 버그 3건 수정 (createDraft 응답 파싱, 템플릿 재선정, pageCount 오프셋 보정). vitest 설정에서 `dist/` stale 테스트 제거. `sweetbook-books.test.ts` 신규 추가 (21개). api 테스트 총 85개. ADR-004 작성 (ADR-003 supersede). 주문까지 전체 E2E 흐름 수동 검증 완료.
- `#55` README 완성 DoD 완료: 타겟 고객·주요 기능·SweetBook API 엔드포인트 표(외부 6+내부 7)·AI 도구 사용 내역·설계 의도·더 시간이 있었다면 섹션 추가. /qa에서 미사용 `GET /bookspecs/{uid}` 항목 발견·제거.
- `#54` 주문하기 UI DoD 완료: `apps/web/src/lib/api.ts`에 `getCredits()`·`createOrder()` 추가, EditForm·CohortEditForm 성공 상태에 배송 정보 폼(수령인명/전화/주소/우편번호) + OrderStatus 전이 UI 구현, 테스트 11개 추가 (web 총 102개). 잔액 표시 UI는 MVP 범위 제외(알려진 제한사항)
- `#53` Credits API + POST /api/orders 엔드포인트 DoD 완료: `SweetBookClient`에 `getCredits()`·`createOrder()` 추가, `GET /api/credits`·`POST /api/orders` 라우트 추가, 테스트 12개 추가 (api 총 124개). Orders API payload 케이싱 변환(camelCase→PascalCase)을 lib 레이어에서 담당
- `#48` 책 만들기 버튼 API 연결 DoD 완료: `apps/web/src/lib/api.ts`에 `createBook()` 함수 추가 (POST /api/books, Idempotency-Key 헤더 포함), `EditForm.tsx`·`CohortEditForm.tsx` idle/loading/success/error 상태 전이 UI 구현, 테스트 8개 추가 (web 총 91개). cohortId는 MVP 한정 `"cohort-2026-01"` 하드코딩 (알려진 제한사항)
- `#47` Books API 오케스트레이션 엔드포인트 DoD 완료: `POST /api/books` 라우트 추가, `sweetbook-api.ts` HTTP 클라이언트 신규 (Node 20 내장 fetch/FormData), `orchestrate-book.ts` 4단계 오케스트레이터 신규, 테스트 17개 추가 (총 112개, `dist` 포함)
- `#46` EditSession → Books API payload 매퍼 DoD 완료: `apps/api/src/lib/payload-mapper.ts` 신규 추가 (`buildCoverPayload`, `buildContentsPayload`), 테스트 25개 추가 (총 53개)
- `#45` BookSpecs 상수 설정 및 페이지 수 보정 로직 DoD 완료: `apps/api/src/config/book-spec.ts` + `lib/page-adjuster.ts` 신규 추가, `apps/api` Vitest 설정 (15개 테스트), `.env`에 `BOOK_SPEC_UID`·`COVER_TEMPLATE_UID`·`CONTENTS_TEMPLATE_UID` 추가 (ADR-003)
- `#39` 기수 전용 편집 폼 구현 DoD 완료: `lib/edit-session.ts` `CustomText`에 `cohortIntro?`·`staffMessage?` 추가, `CohortEditForm.tsx` 신규 추가, `cohorts/[cohortId]/create/page.tsx` 연결, 테스트 5개 추가 (총 83개)
- `#37` 페이지 순서 변경 UI DoD 완료: `lib/edit-session.ts` `buildDefaultPages`+`movePage` 추가, `EditForm.tsx` 페이지 순서 섹션 UI 추가, 테스트 12개 추가 (총 78개)
- `#36` hiddenBlocks 포함/제외 토글 UI DoD 완료: `lib/edit-session.ts` blockId 빌더+토글+조회 유틸 4개 추가, `EditForm.tsx` projects/photos 토글 UI 추가, 테스트 13개 추가 (총 66개)
- `#35` EditSession 상태 설계 및 편집 폼 구현 DoD 완료: `lib/edit-session.ts` 타입+팩토리 정의, `EditForm.tsx` 'use client' 컴포넌트 신규 추가, 테스트 8개 추가 (총 53개)
- `#38` cohortId 진입 경로 연결 DoD 완료: `cohorts/[cohortId]` Next Step CTA 추가, `book-types` 페이지 cohortId 분기, `cohorts/[cohortId]/create` 확정 페이지 신규 추가, lib 유틸 2개 추가 + 테스트 7개 추가 (총 45개)
- `#9` 책 종류 선택 DoD 완료: `book-types` CTA 흐름 연결, `students/[studentId]/create` 확정 페이지 신규 추가, `lib/book-types.ts` 유틸 추출 + 테스트 20개 추가 (총 38개)
- `#8` 수료생 상세 DoD 완료: 섹션별 로딩 스켈레톤(`loading.tsx`) 및 브랜딩 404 페이지(`not-found.tsx`) 추가
- `#7` 기수별 수료생 목록 DoD 완료: 로딩 스켈레톤 및 빈 상태 UI 추가, `getCohort()` 테스트 5개 추가
- `#6` 기수 목록 조회 화면 DoD 완료: 로딩 스켈레톤(`loading.tsx`) 및 빈 상태 UI 추가
- Vitest 테스트 프레임워크 도입 (`apps/web`), 유닛 테스트 13개 작성 (ADR-002)
- 패키지명 오타 `sweetboot` → `sweetbook` 수정 (package.json, README 전체)
- 부트캠프 수료 포트폴리오 북 서비스의 PRD를 승인 상태로 정리
- SweetBook API 채택 범위를 `Books`, `Orders`, `BookSpecs`, `Credits`로 확정
- 프론트엔드/백엔드 분리 스택을 `Next.js + Express + TypeScript`로 결정 (ADR-001)
- `#29`에서 Foundation Set 5개 화면의 1차 기준선을 코드에 반영
- API 서버가 꺼져 있어도 프론트엔드가 더미 데이터로 동작하도록 fallback 처리 추가

## 알려진 이슈

| 이슈 | 심각도 | 상태 |
|------|-------|------|
| ~~내지 모든 페이지에 동일 파라미터(이름만) 반복 — 실제 콘텐츠 미반영~~ | ~~높음~~ | 해결 (#82) |
| SweetBook API 프리뷰/PDF 미지원 — 책 결과물 확인 불가 | 높음 | 진행 예정 (#85~#88) |
| DB 없음 — CRUD 불가, 시연 시 데이터 조작 불가 | 높음 | 진행 예정 (#74~#80) |
| server.ts 라우트 핸들러 테스트 0개 | 중간 | #76 구현 시 해결 |
| `jsdom@29` + Vitest 최신 버전 ESM 호환 이슈로 컴포넌트 테스트 환경 미구성 | 낮음 | 완료 (happy-dom 도입) |

## 기술 부채

| 항목 | 등록일 | 예상 작업량 |
|------|-------|-----------|
| ~~payload-mapper가 블록 ID를 무시하고 동일 파라미터 복사~~ | 2026-04-08 | ~~L~~ 완료 (#82) |
| ~~정적 JSON 데이터 → PostgreSQL 전환 필요~~ | 2026-04-08 | ~~M~~ 완료 (#74~#76) |
| ~~PRD 24페이지 구성표에 필요한 데이터 필드 누락~~ | 2026-04-08 | ~~M~~ 완료 (#75 seed) |
| pnpm 기준 README 실행 절차를 실제 dev 서버 구동 기준으로 검증 | 2026-04-04 | S |

## 다음 계획

### Epic: DB 도입 (#74~#80) — 완료
- [x] `#74` Docker Compose PostgreSQL + Prisma 초기 설정
- [x] `#75` Prisma seed 스크립트
- [x] `#76` GET 엔드포인트 DB 조회 전환
- [x] `#77` Cohort CRUD API
- [x] `#78` Student CRUD API
- [x] `#79` Project CRUD API
- [x] `#80` orchestrate-book DB 연동

### Epic: 내지 콘텐츠 매핑 (#81~#84)
- [ ] `#81` SweetBook sandbox 선행 검증 [M] — 독립 (동시 시작 가능)
- [x] `#82` payload-mapper 페이지별 매핑 [L] → depends: #76, #81
- [x] `#83` 프론트엔드 블록 ID 확장 [M] → depends: #82
- [x] `#84` EditForm 새 블록 타입 UI [M] → depends: #83

### Epic: 책 프리뷰 렌더러 (#85~#88)
- [x] `#85` 프리뷰 선행 검증 [S] — 독립 (동시 시작 가능)
- [x] `#86` 템플릿 레이아웃 데이터 정적 저장 [M] → depends: #85
- [ ] `#87` PageRenderer 컴포넌트 [L] → depends: #86
- [ ] `#88` BookPreview + EditForm 연결 [M] → depends: #87, #82

### 배포
- [ ] `#68` Vercel + Railway 프로덕션 배포 [M] → depends: #76

### 미머지 PR (기존)
- [x] `#67` 구조화 로깅 DoD 완료 — PR 머지 대기
- [x] `#65` 환경변수 검증 DoD 완료 — PR 머지 대기
- [x] `#64` JSON 전환 DoD 완료 — PR 머지 대기
- [x] `#63` Docker Compose DoD 완료 — PR 머지 대기
- [x] `#66` CI DoD 완료 — PR 머지 대기

- [x] `#6` 기수 목록 조회 화면 DoD 완료
- [ ] `#6` PR 머지 (`feat/#6-cohort-list-loading-empty-state`)
- [x] `#7` 기수별 수료생 목록 DoD 완료
- [ ] `#7` PR 머지 (`feat/#7-cohort-student-list-empty-loading`)
- [x] `#8` 수료생 상세 DoD 완료: 로딩 스켈레톤 + not-found 처리
- [ ] `#8` PR 머지 (`feat/#8-student-detail-loading-notfound`)
- [x] `#9` 책 종류 선택 DoD 완료: CTA 흐름 연결 + create 확정 페이지 + 테스트 추가
- [ ] `#9` PR 머지 (`feat/#9-book-type-selection-flow`)
- [x] `#38` cohortId 진입 경로 연결 DoD 완료
- [ ] `#38` PR 머지 (`feat/#38-cohort-showcase-entry-path`)
- [x] `#37` 페이지 순서 변경 UI DoD 완료
- [ ] `#37` PR 머지 (`feat/#37-page-order-ui`)
- [x] `#36` hiddenBlocks 포함/제외 토글 UI DoD 완료
- [ ] `#36` PR 머지 (`feat/#36-hidden-blocks-toggle`)
- [x] `#39` 기수 전용 편집 폼 구현 DoD 완료
- [ ] `#39` PR 머지 (`feat/#39-cohort-edit-form`)
- [x] `#35` EditSession 상태 설계 및 편집 폼 구현 DoD 완료
- [ ] `#35` PR 머지 (`feat/#35-edit-session-form`)
