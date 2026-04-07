# [PRD] 내지 콘텐츠 매핑 개선

**Status:** Approved
**Date:** 2026-04-08
**Parent PRD:** `docs/prd/bookprint-bootcamp-portfolio-book-prd.md` (섹션 24, 25, 28)

## 1. 개요 (Overview)

### 배경 및 문제

기존 PRD(섹션 24)는 24페이지를 각각 다른 목적의 콘텐츠(소개, 기술 스택, 프로젝트, 회고, 멘토 코멘트, 활동 사진 등)로 채우도록 설계했다. 그러나 현재 구현은 **모든 내지에 동일한 파라미터(`monthNum`, `dayNum`, `diaryText=수료생 이름`)를 반복 주입**하고 있다.

즉, 수료생의 프로젝트·회고·멘토 코멘트·사진 데이터가 DB에 존재하지만, 실제 책에는 반영되지 않는다.

### 원인 분석

`apps/api/src/lib/payload-mapper.ts`의 `buildContentsPayload()` 함수가 블록 ID(`project:0`, `photo:1` 등)를 **파싱하지 않고**, 모든 페이지에 동일한 `baseParams`를 복사한다:

```typescript
// 현재 코드 (payload-mapper.ts:87-98)
const baseParams = { monthNum, dayNum, diaryText: student?.name ?? cohort.name };

const contentPayloads = visiblePageIds.map(() => ({
  templateUid: contentTemplateUid,
  parameters: baseParams,  // ← 모든 페이지가 동일
}));
```

### 목적

PRD 페이지 구성표(섹션 24)를 실현하여, 각 페이지가 목적에 맞는 실제 데이터를 담도록 개선한다.

## 2. SweetBook API 템플릿 조사 결과

### 2.1 판형

- `PHOTOBOOK_A4_SC` (A4 소프트커버 포토북)
- 최소 24p / 최대 130p / 2p 단위
- 커버가 2페이지를 차지하므로 내지는 최소 26장 호출 필요

### 2.2 사용 가능한 A4 SC 내지 템플릿

sandbox API `/templates` 엔드포인트 조사 결과 (2026-04-08 기준):

#### 텍스트 전용

| UID | 이름 | 테마 | 파라미터 | 적합 용도 |
|-----|------|------|----------|-----------|
| `3mjKd8kcaVzT` | 내지b | 일기장A | `monthNum`, `dayNum`, `diaryText` | 텍스트 본문 (소개, 회고, 멘토 코멘트 등) |
| `3nWJ4wtPSQOb` | 내지a | 일기장A | `monthNum`, `dayNum`, `diaryText`, **`photo`** | 텍스트 + 사진 1장 |

#### 사진 갤러리 (배열)

| UID | 이름 | 테마 | 파라미터 | 적합 용도 |
|-----|------|------|----------|-----------|
| `4UJiQc6ZJzvX` | 내지_dateA | 구글포토북A | `monthYearLabel`, **`photos`** (rowGallery) | 날짜별 사진 갤러리 |
| `5NOAvNYRxKVM` | 내지_dateB | 구글포토북A | `dayLabel`, **`photos`** (rowGallery) | 날짜별 사진 갤러리 |
| `eNxNlWKPdlZn` | 내지 | 구글포토북B | `dateLabel`, **`photos`** (rowGallery) | 사진 갤러리 |
| `msFsr6Ult7qw` | 내지_gallery | 일기장A | `monthNum`, `dayNum`, **`collagePhotos`** (collageGallery) | 콜라주 갤러리 |
| `bclIBHO30JTf` | 내지_gallery | 일기장B | `date`, **`collagePhotos`** (collageGallery) | 콜라주 갤러리 |

#### 사진 단일

| UID | 이름 | 테마 | 파라미터 | 적합 용도 |
|-----|------|------|----------|-----------|
| `5ADDkCtrodEJ` | 내지_photo | 구글포토북C | `dayLabel`, **`photo`** (file), `hasDayLabel` | 사진 1장 (2컬럼 그리드) |

#### 헤더/구분

| UID | 이름 | 테마 | 파라미터 | 적합 용도 |
|-----|------|------|----------|-----------|
| `50f9kmXxelPG` | 내지_monthHeader | 구글포토북C | `monthYearLabel` | 섹션 구분 헤더 |

#### 빈 페이지

| UID | 이름 | 테마 | 비고 |
|-----|------|------|------|
| `73dHSfBDtnwk` | 빈내지 | 구글포토북A | pageCount +1 기여 확인 필요 |
| `4XtQ9w9Qav9k` | 빈내지 | 구글포토북B | pageCount +1 기여 확인 필요 |
| `5NxuQPBMyuTm` | 빈내지 | 구글포토북C | pageCount +1 기여 확인 필요 |
| `269L7PAwTUSS` | 빈내지 | 알림장B | pageCount +1 기여 확인 필요 |
| `6h1Zcwn00pGO` | 빈내지 | 알림장A | pageCount +1 기여 확인 필요 |
| `2lpHl6oLAYss` | 빈내지 | 알림장C | ADR-004에서 pageCount 미기여 확인됨 |

### 2.3 테마 혼용 가능 여부

⚠️ **미검증.** 한 책 안에서 서로 다른 테마(일기장A + 구글포토북C 등)의 템플릿을 혼용할 수 있는지 sandbox에서 실제 책 생성으로 확인해야 한다. 혼용 불가 시 단일 테마로 통일해야 하며, 선택지가 좁아진다.

### 2.4 빈내지 pageCount 기여 여부

⚠️ **미검증.** ADR-004에서 `2lpHl6oLAYss`(알림장C)가 pageCount에 기여하지 않는다고 확인되었다. 다른 테마의 빈내지도 동일한지 확인 필요. 패딩용 빈내지가 pageCount에 기여하지 않으면, 콘텐츠 내지로만 최소 페이지 수를 채워야 한다.

## 3. 현재 더미 데이터로 채울 수 있는 페이지 수

### 3.1 수료생별 데이터 현황

| 수료생 | 프로젝트 | 사진 | 회고 | 멘토 코멘트 | bio | techStack | certificateMessage |
|--------|---------|------|------|------------|-----|-----------|-------------------|
| 김코드 (student-001) | 2개 | 2장 | 1건 | 1건 | O | 4개 | O |
| 박설계 (student-002) | 1개 | 1장 | 1건 | 1건 | O | 4개 | O |
| 이서진 (student-003) | 2개 | 2장 | 1건 | 1건 | O | 4개 | O |

### 3.2 개인 북 — 김코드 기준 콘텐츠 페이지 산출

| 페이지 타입 | 필요 데이터 | 사용 템플릿 | 페이지 수 |
|-------------|------------|------------|----------|
| 기념 수료 | certificateMessage + name + graduationDate | 내지b (`diaryText`) | 1 |
| 수료생 소개 | bio + roleTrack | 내지b (`diaryText`) | 1 |
| 기술 스택 | techStack 배열 | 내지b (`diaryText`) | 1 |
| 프로젝트 1 (요약+상세) | projects[0] | 내지a (`diaryText` + `photo`) 또는 내지b | 2 |
| 프로젝트 2 (요약+상세) | projects[1] | 내지a 또는 내지b | 2 |
| 회고 | retrospective | 내지b (`diaryText`) | 1-2 |
| 멘토 코멘트 | mentorComment | 내지b (`diaryText`) | 1 |
| 활동 사진 | photos[] (2장) | 내지_gallery 또는 내지_dateA | 1-2 |
| 부트캠프 소개 | cohort.summary + cohort.tagline | 내지b (`diaryText`) | 1 |
| 감사 메시지 | customText.graduationMessage | 내지b (`diaryText`) | 1 |
| **실질 콘텐츠 합계** | | | **12-14** |
| **필요 최소 내지** | | | **26** |
| **패딩 필요** | | | **12-14** |

실질 콘텐츠로 절반 정도만 채울 수 있다. 나머지는 빈내지 또는 반복/확장 콘텐츠로 패딩해야 한다.

## 4. 개선안: 페이지 타입별 매핑 전략

### 4.1 페이지 타입 정의

현재 블록 ID가 `project:0`, `photo:1` 같은 단순 구조인데, 이를 확장하여 **페이지 타입**을 명시적으로 정의한다.

```typescript
type PageType =
  | "certificate"       // 기념 수료
  | "bio"               // 수료생 소개
  | "tech-stack"        // 기술 스택
  | "project-summary"   // 프로젝트 요약
  | "project-detail"    // 프로젝트 상세
  | "retrospective"     // 회고
  | "mentor-comment"    // 멘토 코멘트
  | "photo-gallery"     // 활동 사진 갤러리
  | "cohort-intro"      // 부트캠프/기수 소개
  | "thanks"            // 감사 메시지
  | "portfolio-links"   // 포트폴리오 링크
  | "blank";            // 빈 페이지 (패딩)
```

### 4.2 페이지 타입 → 템플릿 + 파라미터 매핑

#### 접근법 A: 일기장A 테마 단일 사용 (추천)

현재 사용 중인 `내지b`와 같은 테마(일기장A)의 템플릿만 사용. 테마 혼용 리스크 없음.

| 페이지 타입 | 템플릿 | 파라미터 매핑 |
|-------------|--------|-------------|
| certificate | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"{name}\n{cohort.program}\n수료일: {graduationDate}\n\n{certificateMessage}"` |
| bio | 내지a `3nWJ4wtPSQOb` | `diaryText` ← `"{name} · {roleTrack}\n\n{bio}"`, `photo` ← `photos[0]` |
| tech-stack | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"기술 스택\n\n{techStack.join(', ')}"` |
| project-summary | 내지a `3nWJ4wtPSQOb` | `diaryText` ← `"{project.title}\n{project.summary}\n\n{project.contribution}"`, `photo` ← picsum fallback |
| project-detail | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"{project.title} — 상세\n\n기여: {project.contribution}\n\n링크:\n{project.links.join('\n')}"` |
| retrospective | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"회고\n\n{retrospective}"` |
| mentor-comment | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"멘토 코멘트\n\n{mentorComment}"` |
| photo-gallery | 내지_gallery `msFsr6Ult7qw` | `collagePhotos` ← `photos[]` |
| cohort-intro | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"{cohort.name}\n{cohort.program}\n\n{cohort.summary}"` |
| thanks | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"감사합니다\n\n{customText.graduationMessage}"` |
| portfolio-links | 내지b `3mjKd8kcaVzT` | `diaryText` ← `"포트폴리오\n\n{project.links 전체 취합}"` |
| blank | 내지b `3mjKd8kcaVzT` | `diaryText` ← `" "` (공백) |

> **`monthNum`과 `dayNum`은 모든 내지b/내지a 호출에 공통으로 수료월/일을 넣는다** (현재와 동일).

#### 접근법 B: 테마 혼용 (고급)

일기장A(텍스트)와 구글포토북C(사진) 템플릿을 혼합하여 시각적 다양성 확보. 테마 혼용 sandbox 검증 필수.

- 텍스트 페이지 → 일기장A `내지b`
- 사진 페이지 → 구글포토북C `내지_photo` (2컬럼 그리드)
- 섹션 구분 → 구글포토북C `내지_monthHeader`

### 4.3 추천

**접근법 A를 추천한다.**

이유:
1. 테마 혼용 검증 없이 바로 구현 가능
2. 현재 사용 중인 `내지b` 기반이라 기존 테스트와 호환
3. 핵심 개선(페이지별 다른 콘텐츠)은 접근법 A만으로 달성됨
4. 1인 개발자 기준 구현 범위가 작음

접근법 B는 접근법 A 완료 후 테마 혼용 검증을 거쳐 v2로 진행할 수 있다.

## 5. 개인 북 기본 페이지 구성표 (개선 후)

커버(2p) + 내지(26p) = 28p → 짝수, 24p 최소 충족.

| 순서 | 페이지 타입 | 템플릿 | 데이터 소스 |
|------|-------------|--------|------------|
| 1 | certificate | 내지b | name, cohort, graduationDate, certificateMessage |
| 2 | bio | 내지a | name, roleTrack, bio, photos[0] |
| 3 | tech-stack | 내지b | techStack[] |
| 4 | project-summary | 내지a | projects[0].title/summary/contribution |
| 5 | project-detail | 내지b | projects[0].contribution/links |
| 6 | project-summary | 내지a | projects[1] (있으면) |
| 7 | project-detail | 내지b | projects[1] (있으면) |
| 8 | retrospective | 내지b | retrospective |
| 9 | mentor-comment | 내지b | mentorComment |
| 10 | photo-gallery | 내지_gallery | photos[] |
| 11 | cohort-intro | 내지b | cohort.name/program/summary |
| 12 | thanks | 내지b | customText.graduationMessage |
| 13 | portfolio-links | 내지b | 전체 project.links 취합 |
| 14-26 | blank | 내지b | 빈 텍스트 (패딩) |

프로젝트가 1개인 수료생(박설계)은 6-7번이 빠지고 패딩이 2장 늘어난다.

## 6. 기수 쇼케이스 북 기본 페이지 구성표 (개선 후)

| 순서 | 페이지 타입 | 템플릿 | 데이터 소스 |
|------|-------------|--------|------------|
| 1 | cohort-intro | 내지b | cohort.name/program/summary/tagline |
| 2 | staff-message | 내지b | customText.staffMessage |
| 3 | cohort-intro-detail | 내지b | customText.cohortIntro |
| 4-N | student-focus | 내지a | 각 student: name/bio/roleTrack + photos[0] |
| N+1-M | project-highlight | 내지b | 각 student의 대표 프로젝트 |
| M+1 | retrospective-quotes | 내지b | students[].retrospective 발췌 모음 |
| M+2 | mentor-comment | 내지b | students[].mentorComment 모음 |
| M+3 | photo-gallery | 내지_gallery | students[].photos 취합 |
| M+4 | thanks | 내지b | customText.graduationMessage |
| 나머지 | blank | 내지b | 패딩 |

## 7. 필요한 코드 변경

### 7.1 백엔드 (`apps/api`)

| 파일 | 변경 내용 | 크기 |
|------|----------|------|
| `src/lib/payload-mapper.ts` | `buildContentsPayload()` → 블록 ID별 분기 로직 추가. 페이지 타입에 따라 다른 templateUid + parameters 생성 | L |
| `src/config/book-spec.ts` | 페이지 타입 enum 및 기본 페이지 구성표 상수 추가 | S |
| `src/config/env.ts` | 추가 templateUid env 변수 (내지a용 `CONTENT_A_TEMPLATE_UID`, gallery용 `GALLERY_TEMPLATE_UID`) | S |
| `__tests__/payload-mapper.test.ts` | 페이지 타입별 매핑 테스트 전면 재작성 | L |

### 7.2 프론트엔드 (`apps/web`)

| 파일 | 변경 내용 | 크기 |
|------|----------|------|
| `src/lib/edit-session.ts` | 블록 ID 체계 확장 (`certificate:0`, `bio:0`, `tech-stack:0`, `project-summary:0` 등) | M |
| `src/lib/edit-session.ts` | `buildDefaultPages()` → PRD 페이지 구성표 기반으로 기본 페이지 목록 생성 | M |
| `src/app/students/[studentId]/create/EditForm.tsx` | 새 블록 타입에 대한 편집 UI (텍스트 수정) | M |
| `src/app/cohorts/[cohortId]/create/CohortEditForm.tsx` | 기수 쇼케이스 북 블록 타입 반영 | M |
| `lib/__tests__/edit-session.test.ts` | 확장된 블록 ID 테스트 | S |

### 7.3 환경변수 추가

```
CONTENT_A_TEMPLATE_UID=3nWJ4wtPSQOb    # 내지a (텍스트+사진)
GALLERY_TEMPLATE_UID=msFsr6Ult7qw      # 내지_gallery (콜라주)
```

## 8. 선행 검증 항목

구현 전에 sandbox API로 반드시 확인해야 하는 사항:

| # | 검증 항목 | 방법 | 실패 시 대안 |
|---|----------|------|-------------|
| 1 | 테마 혼용 가능 여부 | 한 책에 일기장A + 구글포토북C 템플릿을 섞어 finalization 호출 | 일기장A 단일 테마로 통일 (접근법 A) |
| 2 | `내지a`에 photo URL 전달 시 정상 렌더링 | picsum URL로 실제 호출 | photo 파라미터 제외하고 내지b로 대체 |
| 3 | `내지_gallery`에 collagePhotos 배열 전달 형식 | `["url1", "url2"]` JSON 배열로 호출 | 내지a로 사진 1장씩 개별 페이지 |
| 4 | `diaryText`에 긴 텍스트(500자+) 전달 시 잘림 여부 | 회고 전문을 넣어 호출 | 텍스트 길이 제한 후 분할 |
| 5 | `diaryText`에 줄바꿈(`\n`) 반영 여부 | 여러 줄 텍스트로 호출 | 줄바꿈 없이 공백으로 대체 |

## 9. 아웃 오브 스코프 (Out of Scope)

| 제외 기능 | 제외 이유 | 예상 도입 시기 |
|----------|----------|-------------|
| 템플릿 선택 UI | 운영자가 템플릿을 직접 고르는 기능. 현재 PRD 범위 밖 | v2 |
| 자유 텍스트 편집 (페이지별) | 모든 페이지의 텍스트를 개별 수정. 현재는 customText 필드만 편집 | v2 |
| 사진 업로드 | 운영자가 직접 사진을 올리는 기능. 현재 더미 데이터 사진 URL 사용 | v2 |
| 테마 혼용 (접근법 B) | sandbox 검증 후 별도 이슈로 진행 | 접근법 A 완료 후 |
| 동적 페이지 수 조정 UI | 24p 이상으로 페이지를 늘리거나 줄이는 운영자 조작 | v2 |

## 10. 다음 액션 플랜

1. **선행 검증** — sandbox API로 검증 항목 5개 실행 (검증 #2, #4, #5가 핵심)
2. **백엔드 매퍼 개선** — `payload-mapper.ts`에 페이지 타입별 분기 로직 추가
3. **프론트엔드 블록 확장** — `edit-session.ts`의 블록 ID 체계 및 `buildDefaultPages()` 개선
4. **편집 UI 반영** — EditForm에서 새 블록 타입 표시 및 편집 지원
5. **테스트 재작성** — payload-mapper 테스트를 페이지 타입별 매핑 기준으로 전면 재작성
