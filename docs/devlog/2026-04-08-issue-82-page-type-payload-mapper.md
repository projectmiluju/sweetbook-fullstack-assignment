# 개발 일지: #82 페이지 타입 정의 + payload-mapper 페이지별 콘텐츠 매핑

**일자:** 2026-04-08
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

PRD는 24페이지를 각각 다른 목적(수료 기념, 소개, 기술 스택, 프로젝트, 회고, 멘토 코멘트, 갤러리 등)으로 채우도록 설계했다. 그러나 기존 `buildContentsPayload()`는 모든 내지에 동일한 `baseParams`(monthNum, dayNum, diaryText=수료생 이름)를 복사하고 있었다. DB에 수료생 데이터(프로젝트 상세, 회고 Json, 포트폴리오 링크 등)가 존재함에도 책에 반영되지 않는 상태였다.

선행 의존성:
- #76 GET 엔드포인트 DB 전환 — DB에서 데이터 조회 가능
- #81 sandbox 선행 검증 — 내지a(photo), 내지_gallery(collagePhotos), diaryText 긴 텍스트/줄바꿈 모두 정상 동작 확인

## 문제 (Problem)

**1. 인터페이스와 DB 변환 간의 필드 누락**

Prisma 스키마에는 이미 `Student.retrospective`(Json), `Student.portfolioLinks`(Json), `Project.problem/solution/techChoices/result` 등 신규 필드가 있었다. 그러나 `server.ts`의 DB→`Cohort[]` 변환 로직이 `retrospective.difficulty` 하나만 추출하고 나머지를 전부 버리고 있었다. 매퍼를 아무리 잘 만들어도 데이터가 도달하지 않으면 무의미하므로, 인터페이스 확장 + 변환 로직 수정이 선행되어야 했다.

**2. 접근법 선택: 단일 테마 vs 테마 혼용**

PRD에서 접근법 A(일기장A 단일 테마)와 접근법 B(일기장A + 구글포토북C 혼용)를 제시했다. #81 sandbox 검증에서 테마 혼용이 가능하다는 것이 확인되었지만, 접근법 A만으로도 핵심 목표(페이지별 다른 콘텐츠)를 달성할 수 있고 구현 범위가 작으므로 접근법 A를 선택했다.

**3. `certificateMessage` 빈 문자열 fallback**

QA 단계에서 발견된 P0 버그. `certificateMessage`가 빈 문자열(`""`)인 경우 `??` 연산자가 이를 유효한 값으로 취급하여 fallback 문구("수료를 축하합니다.")가 동작하지 않았다. `??`는 `null`/`undefined`만 체크하므로 빈 문자열을 통과시킨다. `||`로 변경하여 해결.

## 시도한 것들 (Attempts)

1. **페이지 타입 → 매퍼 디스패치 패턴:** `parsePageId()`로 pageId 문자열을 `{ type: PageType, index: number }`로 파싱하고, `mapPage()`에서 switch로 12종 매퍼에 디스패치하는 구조를 채택했다. 각 매퍼가 독립적이라 테스트가 용이하고, 새 페이지 타입 추가 시 매퍼 함수 하나 + switch case 하나만 추가하면 된다.

2. **템플릿 선택을 헬퍼 함수로 추상화:** `textPage()`(내지b), `textPhotoPage()`(내지a), `galleryPage()`(내지_gallery) 3개의 헬퍼로 템플릿 선택과 파라미터 구성을 캡슐화. 접근법 B로 확장 시 이 헬퍼만 수정하면 된다.

3. **기수 쇼케이스 분기:** `mentor-comment`와 `photo-gallery`는 student 유무에 따라 동작이 달라진다. student가 있으면 개인 데이터, 없으면 전체 수료생 데이터를 취합한다. `cohort-intro`는 index에 따라 기수 요약(0), staffMessage(1), cohortIntro(2)를 반환한다.

## 최종 해결 (Resolution)

- `src/data/cohorts.ts`: `ProjectSummary`에 problem/solution/techChoices/result, `StudentPortfolio`에 interests/achievements/portfolioLinks/thanksMessage + `RetrospectiveData` 타입 추가, `Cohort`에 operatorMessage/philosophy/photos 추가
- `src/server.ts`: DB→Cohort[] 변환에서 모든 신규 필드를 포함하도록 수정
- `src/config/env.ts`: `CONTENT_A_TEMPLATE_UID`(내지a), `GALLERY_TEMPLATE_UID`(내지_gallery) 추가
- `src/config/book-spec.ts`: `PageType` 12종 union type, `parsePageId()`, `DEFAULT_INDIVIDUAL_PAGES`, `DEFAULT_COHORT_PAGES` 상수 추가
- `src/lib/payload-mapper.ts`: 전면 리팩토링 — 12종 페이지 타입별 매퍼, 3종 템플릿 헬퍼, nullable fallback, 기수 쇼케이스 분기
- `src/__tests__/payload-mapper.test.ts`: 67개 테스트 (기존 25개 → 전면 재작성)
- `src/__tests__/book-spec.test.ts`: `parsePageId` 단위 테스트 9개 신규
- 총 테스트 154개, 빌드/타입체크 통과

## 배운 것 (Lessons Learned)

- `??`(nullish coalescing)와 `||`(logical OR)의 차이가 실 데이터에서 버그로 이어진다. DB에서 빈 문자열(`""`)이 올 수 있는 필드는 `||`로 fallback해야 한다. `??`는 `null`/`undefined`가 명확한 경우에만 사용할 것.
- DB 변환 레이어(server.ts)가 필드를 누락하면 downstream 매퍼가 아무리 정교해도 무의미하다. 신규 필드 추가 시 "DB 스키마 → 변환 레이어 → 인터페이스 → 매퍼" 전체 파이프라인을 한 번에 점검해야 한다.
- 페이지 타입별 매퍼를 독립 함수로 분리하면 테스트 작성이 직관적이고, 새 타입 추가 비용이 낮다. 반면 매퍼 수가 12개로 늘어나면서 payload-mapper.ts가 280줄이 되었다. 200줄 SRP 기준에 근접하므로, 향후 매퍼가 더 복잡해지면 `page-mappers/` 디렉토리로 분리를 고려할 것.
