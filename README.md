# SweetBook Fullstack Assignment

[![CI](https://github.com/projectmiluju/sweetbook-fullstack-assignment/actions/workflows/ci.yml/badge.svg)](https://github.com/projectmiluju/sweetbook-fullstack-assignment/actions/workflows/ci.yml)

부트캠프 운영자가 수료생의 프로젝트와 성장 기록을 책으로 만들고 주문할 수 있는 웹앱입니다.

## 타겟 고객

**부트캠프 운영자** — 수료생 데이터를 조회하고, 개인 포트폴리오 북 또는 기수 쇼케이스 북을 편집·생성·주문하는 단일 사용자 흐름을 담당합니다. 수료생 본인 로그인이나 다중 사용자 협업은 MVP 범위 밖입니다.

## 주요 기능

- 기수 목록 및 수료생 목록 조회
- 수료생 상세 포트폴리오 확인
- **개인 포트폴리오 북** 또는 **기수 쇼케이스 북** 선택
- 편집 폼 — 표지 제목, 기념 수료 문구, 콘텐츠 블록 포함/제외, 페이지 순서 변경
- 편집 완료 후 SweetBook API를 통한 책 생성 (4단계: 초안 → 표지 → 내지 → 최종화)
- 책 생성 성공 후 배송 정보 입력 및 주문 생성
- 주문 성공/실패 결과 표시

## 시작하기 (Getting Started)

### 사전 요구사항

- Node.js 20 이상
- pnpm 10 이상

### 설치

```bash
pnpm install
```

### 환경변수 설정

```bash
cp .env.example .env
```

`.env`에는 아래 값을 설정합니다.

| 변수 | 설명 |
|------|------|
| `SWEETBOOK_API_KEY` | SweetBook Sandbox API Key |
| `SWEETBOOK_API_BASE_URL` | SweetBook API 베이스 URL (기본: `https://api-sandbox.sweetbook.com/v1`) |
| `NEXT_PUBLIC_APP_API_BASE_URL` | 프론트엔드에서 바라보는 내부 API 주소 (기본: `http://localhost:4000`) |
| `PORT` | API 서버 포트 (기본: `4000`) |
| `BOOK_SPEC_UID` | Books API 오케스트레이션에 사용할 판형 UID (Sandbox 기준: `PHOTOBOOK_A4_SC`) |
| `COVER_TEMPLATE_UID` | 표지 templateUid (Sandbox 기준: `3S1ceGaglj5i` — 구글포토북A) |
| `CONTENT_TEMPLATE_UID` | 내지 templateUid (Sandbox 기준: `3mjKd8kcaVzT` — 내지b) |
| `BLANK_TEMPLATE_UID` | 예비 빈 내지 templateUid (Sandbox 기준: `2lpHl6oLAYss`) |

### 실행

프론트엔드와 백엔드를 각각 별도 터미널에서 실행합니다.

```bash
# 백엔드 (터미널 1)
pnpm dev:api

# 프론트엔드 (터미널 2)
pnpm dev:web
```

실행 후 브라우저에서 `http://localhost:3000`을 엽니다.

> API 서버가 꺼져 있어도 프론트엔드는 내장 더미 데이터로 동작합니다.

## 프로젝트 구조

```text
.
├── apps
│   ├── api        # Express + TypeScript 백엔드
│   │   └── src
│   │       ├── config/        # BookSpec 상수
│   │       ├── data/          # 더미 기수/수료생 데이터
│   │       ├── lib/           # SweetBookClient, 오케스트레이터, payload 매퍼
│   │       └── server.ts      # Express 라우트
│   └── web        # Next.js + TypeScript 프론트엔드
│       └── src
│           ├── app/           # Next.js App Router 페이지
│           └── lib/           # api.ts, edit-session.ts, book-types.ts
├── docs
│   ├── decisions  # ADR 문서
│   ├── design     # Foundation Set 디자인 가이드
│   ├── devlog     # 개발 일지
│   ├── prd        # 제품 요구사항 문서
│   └── STATUS.md  # 현재 진행 상태
├── docker-compose.yml  # Docker Compose 설정
└── .github        # 이슈/PR 템플릿
```

## 기술 스택

- **프론트엔드:** Next.js + TypeScript
- **백엔드:** Express + TypeScript
- **스타일링:** Tailwind CSS
- **테스트:** Vitest
- **데이터 저장:** 정적 더미 데이터
- **패키지 매니저:** pnpm workspace
- **컨테이너:** Docker Compose (멀티스테이지 빌드)
- **외부 API:** SweetBook Books API, Orders API, BookSpecs API, Credits API

관련 기술 결정: [ADR-001](./docs/decisions/ADR-001-프론트엔드-백엔드-분리와-기술-스택-선정.md), [ADR-002](./docs/decisions/ADR-002-테스트-프레임워크-Vitest-도입.md), [ADR-003](./docs/decisions/ADR-003-BookSpec-UID-Sandbox-직접-검증.md), [ADR-005](./docs/decisions/ADR-005-Docker-Compose-컨테이너화.md)

## 사용한 Book Print API 엔드포인트

### 외부 SweetBook API (`SWEETBOOK_API_BASE_URL`)

| 메소드 | 경로 | 용도 |
|--------|------|------|
| `GET` | `/credits` | 주문 가능 잔액 조회 |
| `POST` | `/books` | 책 초안 생성 |
| `POST` | `/books/{bookUid}/cover` | 표지 생성 |
| `POST` | `/books/{bookUid}/contents` | 내지 페이지 추가 |
| `POST` | `/books/{bookUid}/finalization` | 책 최종화 |
| `POST` | `/orders` | 주문 생성 |

### 내부 앱 API (`apps/api`)

| 메소드 | 경로 | 용도 |
|--------|------|------|
| `GET` | `/health` | 서버 상태 확인 |
| `GET` | `/api/cohorts` | 기수 목록 조회 |
| `GET` | `/api/cohorts/:id` | 기수 상세 + 수료생 목록 조회 |
| `GET` | `/api/students/:id` | 수료생 포트폴리오 상세 조회 |
| `GET` | `/api/credits` | 잔액 조회 프록시 |
| `POST` | `/api/books` | 책 생성 오케스트레이션 (4단계) |
| `POST` | `/api/orders` | 주문 생성 프록시 |

## AI 도구 사용 내역

| 도구 | 버전/모델 | 사용 목적 |
|------|----------|---------|
| Claude Code (Anthropic) | claude-sonnet-4-6 | 전체 구현 사이클 — PRD 작성, 이슈 분해, 코드 설계·구현·리뷰, 테스트 작성, 문서화 |

**구체적 활용 내역:**
- `/spec` 스킬로 PRD 작성 및 GitHub Issue 분해
- `/build` 스킬로 각 이슈별 코드 구현
- `/qa` 스킬로 테스트 갭 분석 및 추가 테스트 작성
- `/docs` 스킬로 개발 일지·STATUS.md 기록
- `/ship` 스킬로 커밋 분리 전략·PR 생성

SweetBook Sandbox API 탐색(필드 확인, 케이싱 확인)은 Claude Code에서 직접 `curl`로 호출해 진행했습니다.

## 설계 의도

**1. 운영자 단일 흐름으로 범위를 좁혔습니다.**
수료증 발급이나 범용 편집 SaaS가 아니라, "운영자가 수료생 데이터를 선조회하고 제한적으로 편집한 뒤 책으로 만드는" 단일 시나리오에 집중했습니다. 인증·권한·다중 사용자 기능을 모두 제거하고 핵심 흐름에만 집중한 결과입니다.

**2. 외부 API 스펙 변동을 lib 레이어에서 격리했습니다.**
SweetBook Orders API의 payload는 `Items[].bookUid`(camelCase)와 `Shipping.*`(PascalCase)가 혼재합니다. 내부 타입은 모두 camelCase로 정의하고, `SweetBookClient` 구현체에서 PascalCase 변환을 담당합니다. 서버 라우트 코드가 외부 API 전용 키를 알 필요가 없습니다.

**3. EditSession을 클라이언트 상태의 단일 진실 공급원으로 설계했습니다.**
폼 편집 상태를 `EditSession` 타입 하나로 관리하고, API 호출 시 `payload-mapper`가 Books API 형식으로 변환합니다. 편집 UI가 외부 API 형식을 직접 다루지 않아 API 변경 시 mapper만 수정하면 됩니다.

**4. 더미 데이터 fallback으로 API 없이도 즉시 실행 가능하도록 했습니다.**
API 서버가 꺼져 있거나 SWEETBOOK_API_KEY가 없어도 프론트엔드는 내장 더미 기수/수료생 데이터로 동작합니다. 심사자가 API Key 없이 UI 흐름을 즉시 확인할 수 있습니다.

## 더 시간이 있었다면 추가할 기능

| 기능 | 이유 |
|------|------|
| 잔액 표시 UI | `GET /api/credits` 백엔드는 완성됨. 편집 폼에 잔액을 표시해 주문 전 확인 가능하게 하고 싶었음 |
| 주문 이력 목록 화면 | 현재 주문 결과는 폼 내 표시에 그침. 별도 이력 페이지가 있으면 재주문·상태 추적이 가능 |
| E2E 테스트 (Playwright) | 현재는 Vitest 단위 테스트만. 책 생성 → 주문 전체 플로우 자동 검증이 없음 |
| 운영자 인증 | MVP는 로그인 없이 동작. 실제 서비스라면 API Key를 서버에서만 다루는 것과 별개로 사용자 인증이 필요 |
| 배송 주소 자동완성 | 현재 주소 필드는 자유 입력. 도로명 주소 API 연동으로 UX 개선 가능 |
| 컴포넌트 단위 테스트 | jsdom + Vitest ESM 호환 이슈로 미구성. happy-dom 또는 Playwright CT 도입 검토 필요 |

## CI / Branch Protection

PR이 열리면 GitHub Actions CI가 자동으로 실행됩니다.

| Job | 검사 항목 |
|-----|---------|
| API | `pnpm test` (Vitest 85개), `pnpm build` (tsc) |
| Web | `pnpm lint` (ESLint), 타입체크 (tsc --noEmit) |

**Branch Protection 설정 방법** (GitHub → Settings → Branches → main):
1. `Require status checks to pass before merging` 활성화
2. Required checks에 `API — 테스트 · 빌드`, `Web — 린트 · 타입체크` 추가

## Docker로 실행하기

Docker와 Docker Compose가 설치되어 있으면 한 명령으로 전체 앱을 실행할 수 있습니다.

```bash
# 1. 환경변수 파일 준비
cp .env.example .env
# .env에 SWEETBOOK_API_KEY 등 값을 설정

# 2. 컨테이너 빌드 및 실행
docker compose up --build
```

실행 후 접속:
- 프론트엔드: `http://localhost:3000`
- API 서버: `http://localhost:4000/health`

종료: `Ctrl+C` 또는 `docker compose down`

> `.env` 파일은 `docker-compose.yml`의 `env_file`로 각 컨테이너에 주입됩니다.

## 스크립트

루트 스크립트:

- `pnpm dev:web` — 프론트엔드 개발 서버 (`http://localhost:3000`)
- `pnpm dev:api` — 백엔드 개발 서버 (`http://localhost:4000`)
- `pnpm build:web` — 프론트엔드 프로덕션 빌드
- `pnpm build:api` — 백엔드 프로덕션 빌드
- `pnpm lint` — 전체 린트
- `pnpm typecheck` — 백엔드 타입체크

프론트엔드 스크립트:

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web lint`
- `pnpm --filter web test`

백엔드 스크립트:

- `pnpm --filter @sweetbook/api dev`
- `pnpm --filter @sweetbook/api build`
- `pnpm --filter @sweetbook/api start`
