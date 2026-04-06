# 프로젝트 현황

**최종 업데이트:** 2026-04-06
**현재 버전:** v0.1.0
**배포 URL:** 없음

## 최근 변경

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
| README 기준 실제 dev 서버 스모크 검증은 아직 완료되지 않음 | 중간 | 진행 중 |
| 공용 content template의 도메인 적합성이 낮음 | 높음 | 추적 중 |
| 책 종류 선택 화면이 실제 다음 단계와 완전히 연결되도록 추가 보정이 필요함 | 중간 | 완료 (#38) |

## 기술 부채

| 항목 | 등록일 | 예상 작업량 |
|------|-------|-----------|
| 컴포넌트 테스트 환경 구성 (happy-dom 또는 Playwright E2E 도입 검토) | 2026-04-06 | M |
| Template UID를 실제 구현 성공 기준으로 재검증 | 2026-04-04 | M |
| pnpm 기준 README 실행 절차를 실제 dev 서버 구동 기준으로 검증 | 2026-04-04 | S |
| Foundation Set 기준선 위에서 `#7~#9`의 화면별 polish 범위를 다시 조정 | 2026-04-04 | M |
| PHASE 2 이상 하위 이슈는 아직 생성하지 않음 | 2026-04-04 | S |

## 다음 계획

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
- [x] `#36` hiddenBlocks 포함/제외 토글 UI DoD 완료
- [ ] `#36` PR 머지 (`feat/#36-hidden-blocks-toggle`)
- [x] `#35` EditSession 상태 설계 및 편집 폼 구현 DoD 완료
- [ ] `#35` PR 머지 (`feat/#35-edit-session-form`)
