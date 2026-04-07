# 개발 일지: Docker Compose 컨테이너화

**일자:** 2026-04-07
**관련 이슈:** #63
**관련 역할:** build, qa

## 배경 (Context)

로컬 환경(Node.js, pnpm 버전, `.env` 위치)에 의존하는 현재 구조를 Docker Compose로 컨테이너화하여, `docker compose up` 한 명령으로 API + Web을 동시에 기동할 수 있도록 한다.

## 문제 (Problem)

pnpm 모노레포 + Docker 멀티스테이지 빌드 조합에서 두 가지 문제에 부딪혔다.

### 1. pnpm node_modules 심링크가 Docker COPY에서 깨짐

pnpm은 `node_modules` 내부에 `.pnpm` store로의 심볼릭 링크를 사용한다. Docker의 `COPY --from=deps /app/node_modules ./node_modules`는 심링크를 따라가지 않아, 런타임에서 `Cannot find package 'cors'` 에러가 발생했다.

### 2. `.env`의 PORT=4000이 Web 컨테이너에도 적용됨

`env_file: .env`로 모든 환경변수를 주입했는데, `.env`에 `PORT=4000`이 있어 Next.js standalone 서버가 3000이 아닌 4000에서 기동했다. API와 Web이 같은 포트를 사용하게 되는 충돌.

## 시도한 것들 (Attempts)

1. **시도 1: 루트 node_modules를 COPY** — 심링크가 깨져 실패. pnpm의 content-addressable store 구조는 단순 COPY와 호환되지 않는다.
2. **시도 2: `pnpm deploy --filter @sweetbook/api --prod`** — pnpm 10에서 `inject-workspace-packages` 미설정 시 에러. `--legacy` 플래그 추가로 해결.
3. **시도 3: Web 컨테이너 PORT 충돌** — `docker-compose.yml`에서 `environment: PORT=3000`으로 `env_file`의 값을 오버라이드.

## 최종 해결 (Resolution)

- **API**: `pnpm deploy --legacy`로 심링크가 풀린 자기완결적 `node_modules`를 생성 후, 런타임 스테이지에 복사.
- **Web**: Next.js `output: "standalone"` 설정 + `docker-compose.yml`에서 PORT 오버라이드.
- **검증**: `docker compose up` → api:4000 health OK, web:3000 HTTP 200 확인.

## 배운 것 (Lessons Learned)

1. **pnpm 모노레포 Docker화는 심링크 처리가 핵심이다.** `pnpm deploy`가 정석이며, pnpm 10에서는 `--legacy` 플래그가 필수다. 향후 `inject-workspace-packages=true`로 전환하면 `--legacy` 없이 가능.
2. **`env_file`로 공유 `.env`를 주입할 때, 서비스별로 다른 값이 필요한 변수는 `environment`로 오버라이드해야 한다.** `PORT`처럼 서비스마다 다른 값을 쓰는 변수는 충돌하기 쉽다.
