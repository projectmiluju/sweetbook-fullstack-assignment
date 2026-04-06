# 프로젝트 현황

**최종 업데이트:** 2026-04-07 (Issue #66 GitHub Actions CI 구축 완료)
**현재 버전:** v0.1.0
**배포 URL:** 없음

## 최근 변경

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
| `jsdom@29` + Vitest 최신 버전 ESM 호환 이슈로 컴포넌트 테스트 환경 미구성 | 낮음 | 추적 중 |
| README 기준 실제 dev 서버 스모크 검증은 아직 완료되지 않음 | 중간 | 완료 (#60) |
| 공용 content template의 도메인 적합성이 낮음 | 높음 | 완료 (#60, ADR-004) |
| 책 종류 선택 화면이 실제 다음 단계와 완전히 연결되도록 추가 보정이 필요함 | 중간 | 완료 (#38) |

## 기술 부채

| 항목 | 등록일 | 예상 작업량 |
|------|-------|-----------|
| 컴포넌트 테스트 환경 구성 (happy-dom 또는 Playwright E2E 도입 검토) | 2026-04-06 | M |
| Template UID를 실제 구현 성공 기준으로 재검증 | 2026-04-04 | M | ~~Sandbox API 직접 조회로 확정 (#45, ADR-003)~~ |
| pnpm 기준 README 실행 절차를 실제 dev 서버 구동 기준으로 검증 | 2026-04-04 | S |
| Foundation Set 기준선 위에서 `#7~#9`의 화면별 polish 범위를 다시 조정 | 2026-04-04 | M |
| PHASE 2 이상 하위 이슈는 아직 생성하지 않음 | 2026-04-04 | S |

## 다음 계획

- [x] `#66` GitHub Actions CI 구축 DoD 완료
- [ ] `#66` PR 머지 (`feat/#66-github-actions-ci`)
- [x] `#60` MVP 수동 테스트 DoD 완료
- [ ] `#60` PR 머지 (`test/#60-mvp-manual-test-scenarios`)
- [x] `#55` README 완성 DoD 완료
- [ ] `#55` PR 머지 (`docs/#55-readme-final`)
- [x] `#54` 주문하기 UI DoD 완료
- [ ] `#54` PR 머지 (`feat/#54-order-ui`)
- [x] `#53` Credits API + POST /api/orders 엔드포인트 DoD 완료
- [ ] `#53` PR 머지 (`feat/#53-credits-orders-api-endpoint`)
- [x] `#48` 책 만들기 버튼 API 연결 DoD 완료
- [ ] `#48` PR 머지 (`feat/#48-book-create-api-connect`)
- [x] `#47` Books API 오케스트레이션 엔드포인트 DoD 완료
- [x] `#47` PR 머지 완료 (#51)
- [x] `#46` EditSession → payload 매퍼 DoD 완료
- [x] `#46` PR 머지 완료 (#50)
- [x] `#45` BookSpecs 상수 + 페이지 수 보정 DoD 완료
- [x] `#45` PR 머지 완료 (#49)

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
