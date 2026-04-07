# ADR-007: PostgreSQL + Prisma 데이터베이스 도입

**일자:** 2026-04-08
**상태:** Accepted

## 맥락 (Context)

현재 앱은 `apps/api/data/cohorts.json` 정적 파일에서 데이터를 읽는다. 쓰기 기능이 없어 시연 시 기수/수료생을 추가·수정·삭제할 수 없다. 시연을 위해 CRUD가 필요하고, 내지 콘텐츠 매핑 개선(PRD)에 필요한 추가 데이터 필드(구조화된 회고, 프로젝트 상세, 포트폴리오 링크 등)도 저장해야 한다.

## 고려한 선택지

### 선택지 A: SQLite

- 장점: 파일 하나, 의존성 최소, Docker 불필요
- 단점: 시연 시 "DB를 썼다" 인상이 약함. PostgreSQL 배열 타입 미지원으로 `techStack`, `photos` 등을 별도 테이블이나 JSON 문자열로 처리해야 함

### 선택지 B: PostgreSQL + Prisma

- 장점: Docker Compose에 추가 용이(이미 Docker 설정 있음). 네이티브 배열 타입으로 `String[]` 필드를 깔끔하게 처리. Prisma가 타입 생성·마이그레이션·seed를 한 도구로 해결. Railway/Neon 등 프로덕션 배포도 자연스러움
- 단점: Docker 필수, 로컬 개발 시 DB 프로세스 필요

### 선택지 C: Drizzle ORM

- 장점: 번들 작음, SQL에 가까운 API
- 단점: Prisma 대비 생태계·문서가 작고, 마이그레이션 도구가 덜 성숙

## 결정 (Decision)

**선택지 B (PostgreSQL + Prisma) 채택.**

- Docker Compose에 `postgres:16-alpine` 서비스 추가
- Prisma로 스키마 선언, 마이그레이션, 타입 생성, seed 처리
- 3개 모델: Cohort(12필드), Student(13필드), Project(8필드)
- PRD 24페이지 구성표 충족을 위한 필드 추가: Cohort에 operatorMessage/philosophy/logoUrl/photos/partnerInfo/stats, Student에 interests/achievements/portfolioLinks/thanksMessage + retrospective를 Json 타입으로 변경, Project에 problem/solution/techChoices/result

선택 근거:
1. Docker Compose가 이미 있어 PostgreSQL 추가 비용이 낮다
2. Prisma의 PostgreSQL 네이티브 배열 지원으로 스키마가 깔끔하다
3. 시연 시 "PostgreSQL + Prisma ORM"은 풀스택 과제의 기술적 깊이를 보여준다

## 결과 (Consequences)

- 긍정적: CRUD 가능, 시연 시 데이터 자유 조작, PRD 페이지 구성표에 필요한 모든 데이터 저장 가능
- 부정적: 로컬 개발 시 `docker compose up db` 필수. 기존 JSON 로더(`src/data/cohorts.ts`) 및 관련 테스트 삭제 필요
- 리스크: 프로덕션 배포 시 Railway/Neon 등 PostgreSQL 호스팅 비용 발생

## 되돌릴 조건 (Reversal Triggers)

- Docker 없이 즉시 실행 가능한 환경이 요구될 경우 SQLite로 전환 검토
- Prisma의 런타임 크기가 serverless 배포에서 문제가 될 경우 Drizzle 전환 검토
