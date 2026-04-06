# SweetBook Fullstack Assignment

부트캠프 운영자가 수료생의 프로젝트와 성장 기록을 책으로 만들고 주문할 수 있는 웹앱 과제 저장소입니다.

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

- `SWEETBOOK_API_KEY`
- `SWEETBOOK_API_BASE_URL`
- `NEXT_PUBLIC_APP_API_BASE_URL`
- `PORT`

현재 기본 base URL은 Sandbox 환경인 `https://api-sandbox.sweetbook.com/v1` 입니다.
프론트엔드의 기본 API 주소는 `http://localhost:4000` 입니다.

### 실행

프론트엔드:

```bash
pnpm dev:web
```

백엔드:

```bash
pnpm dev:api
```

## 프로젝트 구조

```text
.
├── apps
│   ├── api        # Express + TypeScript 백엔드
│   └── web        # Next.js + TypeScript 프론트엔드
├── docs
│   ├── decisions  # ADR 문서
│   ├── design     # Foundation Set 디자인 가이드
│   ├── devlog     # 개발 일지
│   ├── prd        # 제품 요구사항 문서
│   └── STATUS.md  # 현재 진행 상태
└── .github        # 이슈/PR 템플릿
```

## 기술 스택

- 프론트엔드: Next.js + TypeScript
- 백엔드: Express + TypeScript
- 스타일링: Tailwind CSS
- 데이터 저장: 정적 더미 데이터
- 패키지 매니저: pnpm workspace
- 외부 API: SweetBook Books API, Orders API, BookSpecs API, Credits API

관련 기술 결정은 [ADR-001](./docs/decisions/ADR-001-프론트엔드-백엔드-분리와-기술-스택-선정.md) 문서를 참고합니다.
Foundation Set 화면 기준선은 [foundation-set-ui-spec](./docs/prd/foundation-set-ui-spec.md), [foundation-set-design-guide](./docs/design/foundation-set-design-guide.md) 문서를 참고합니다.

## 스크립트

루트 스크립트:

- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm build:web`
- `pnpm build:api`
- `pnpm lint`
- `pnpm typecheck`

프론트엔드 스크립트:

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web lint`

백엔드 스크립트:

- `pnpm --filter @sweetbook/api dev`
- `pnpm --filter @sweetbook/api build`
- `pnpm --filter @sweetbook/api start`

## 현재 상태

현재는 `#29 Foundation Set 1차 화면 기준선 구현` 브랜치에서 아래 범위가 반영된 상태입니다.

- 랜딩페이지
- 운영자 대시보드
- 기수 상세 / 수료생 목록
- 수료생 상세
- 책 종류 선택
- API 미기동 시 프론트 fallback 데이터

즉 제품의 첫 흐름은 코드 기준으로 연결되어 있지만, 이후 `#6~#9`에서 화면별 polish와 상태/흐름 보정을 이어서 진행할 예정입니다.
