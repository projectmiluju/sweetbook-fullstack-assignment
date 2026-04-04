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

현재 기본 base URL은 Sandbox 환경인 `https://api-sandbox.sweetbook.com/v1` 입니다.

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

## 스크립트

루트 스크립트:

- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm build:web`
- `pnpm build:api`

프론트엔드 스크립트:

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web lint`

백엔드 스크립트:

- `pnpm --filter @sweetboot/api dev`
- `pnpm --filter @sweetboot/api build`
- `pnpm --filter @sweetboot/api start`

## 현재 상태

현재는 초기 기획과 PRD 정리가 완료되었고, 구현은 `#6 운영자 대시보드 및 상세 흐름` PHASE부터 진행합니다.
