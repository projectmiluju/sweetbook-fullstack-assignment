# ADR-005: Docker Compose 컨테이너화

**일자:** 2026-04-07
**상태:** Accepted

## 맥락 (Context)

현재 개발 환경은 Node.js 20, pnpm 10.28.0, `.env` 파일 위치 등 로컬 환경에 전적으로 의존한다. `pnpm dev:api`와 `pnpm dev:web`을 각각 별도 터미널에서 실행해야 하며, 협업이나 배포 시 "내 로컬에서만 돌아간다" 문제가 발생할 수 있다.

`docker compose up` 한 명령으로 API + Web을 동시에 기동하여 환경 재현성을 확보하려 한다.

## 고려한 선택지

### 선택지 A: 단순 COPY + npm install (단일 스테이지)

- 장점: Dockerfile이 단순하다
- 단점: 이미지 크기가 크다 (devDependencies 포함), 빌드 캐시 효율이 낮다

### 선택지 B: 멀티스테이지 빌드 + pnpm deploy (채택)

- 장점: 런타임 이미지에 프로덕션 의존성만 포함, 이미지 크기 최소화, 빌드 캐시 레이어 분리
- 단점: Dockerfile이 다소 복잡하다

### 선택지 C: Next.js 기본 출력 (standalone 미사용)

- 장점: next.config.ts 수정 불필요
- 단점: `node_modules` 전체를 Docker 이미지에 포함해야 하여 이미지 크기가 수백 MB 증가

## 결정 (Decision)

**선택지 B: 멀티스테이지 빌드 + pnpm deploy** 를 채택한다.

핵심 결정 사항:

1. **Next.js `output: "standalone"`** — Docker 이미지에 `node_modules` 전체 대신 필요한 파일만 포함. 이미지 크기를 대폭 줄인다.

2. **API에 `pnpm deploy --legacy`** — pnpm 모노레포의 `node_modules`는 심볼릭 링크 기반이라 Docker의 `COPY`에서 심링크가 깨진다. `pnpm deploy`는 심링크를 풀어 실제 파일로 복사된 자기완결적(self-contained) 디렉터리를 생성한다. pnpm 10에서는 `--legacy` 플래그가 필수다.

3. **`env_file` + `environment` 오버라이드** — `.env`의 `PORT=4000`이 Web 컨테이너에도 주입되어 Next.js가 4000번 포트로 기동하는 문제가 있다. `docker-compose.yml`에서 Web 서비스에 `environment: PORT=3000`을 명시하여 오버라이드한다.

4. **빌드 컨텍스트는 루트** — pnpm 모노레포의 lockfile이 루트에 있으므로 각 Dockerfile의 빌드 컨텍스트를 프로젝트 루트로 설정한다.

## 결과 (Consequences)

- 긍정적: `docker compose up --build` 한 명령으로 전체 앱 기동 가능. 환경 재현성 확보.
- 긍정적: 멀티스테이지 빌드로 런타임 이미지에 빌드 도구(TypeScript, pnpm 등)가 포함되지 않음.
- 부정적: `pnpm deploy --legacy`는 pnpm 10에서 deprecated 예정인 레거시 모드. 향후 `inject-workspace-packages` 설정으로 전환 검토 필요.
- 부정적: Docker 이미지 빌드에 약 30초 소요 (Web의 Next.js 빌드가 대부분).

## 되돌릴 조건 (Reversal Triggers)

- pnpm이 `--legacy` 플래그를 제거하면 `inject-workspace-packages=true` 또는 다른 deploy 방식으로 전환해야 한다.
- 프로덕션 배포(#67)에서 별도 CI/CD 빌드 파이프라인을 도입하면 Dockerfile 최적화가 필요할 수 있다.
