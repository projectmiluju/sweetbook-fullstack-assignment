# ADR-002: 테스트 프레임워크 Vitest 도입

**일자:** 2026-04-06
**상태:** Accepted

## 맥락 (Context)

이슈 #6 QA 단계에서 자동화 테스트 코드 작성이 필요해졌다. 프로젝트에는 테스트 프레임워크가 전혀 설정되어 있지 않았다. `apps/web`은 Next.js 16 + TypeScript 기반 App Router 구조이며, 주요 테스트 대상은 서버 사이드 API 유틸 함수(`getCohorts`, mock fallback)와 데이터 무결성이다.

## 고려한 선택지

### 선택지 A: Jest
- 장점: 생태계 가장 넓음, 레퍼런스 많음
- 단점: Next.js App Router 환경에서 ESM 설정이 복잡함. `transform` 설정에 `babel-jest` 또는 `ts-jest`가 별도로 필요. `@/*` 경로 alias 처리도 추가 설정 필요.

### 선택지 B: Vitest
- 장점: Vite 기반으로 TypeScript/ESM을 별도 설정 없이 처리. `vitest.config.ts`에서 `resolve.alias`로 `@/*` 경로를 단 3줄에 해결. 실행 속도 빠름.
- 단점: `jsdom@29` 최신 버전과 ESM 호환 이슈 존재. `environment: 'node'`로 회피 가능.

### 선택지 C: Playwright (E2E만)
- 장점: 실제 브라우저 렌더링 검증 가능
- 단점: API 유틸 함수 수준의 유닛 테스트에는 과도한 도구. 설치 비용도 높음.

## 결정 (Decision)

**Vitest 채택.** Jest의 ESM 설정 비용 대비 Vitest가 이 프로젝트의 기술 스택(TypeScript, ESM, Vite 기반 번들)과 가장 자연스럽게 통합된다. `@testing-library/react`도 Vitest와 호환된다.

DOM 테스트 환경은 `jsdom@29` 충돌로 `environment: 'node'`를 기본으로 설정했다. 향후 컴포넌트 렌더링 테스트가 필요하면 `happy-dom` 도입을 검토한다.

## 결과 (Consequences)

- 긍정적: TypeScript path alias 설정 간단, ESM 처리 자동, 빠른 실행
- 부정적: `jsdom` 최신 버전 사용 불가 (현재 시점). 컴포넌트 테스트 추가 시 별도 결정 필요
- 리스크: `jsdom`과 Vitest의 ESM 호환성이 추후 패치로 해결되면 `environment: 'jsdom'` 전환 필요

## 되돌릴 조건 (Reversal Triggers)

- 컴포넌트 단위 테스트가 대규모로 필요해질 경우 (현재 Server Component 중심이라 RTL 효용 낮음)
- Playwright E2E가 도입되어 유닛 테스트 범위를 대체할 경우
