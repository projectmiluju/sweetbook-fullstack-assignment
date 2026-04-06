# 개발 일지: 수료생 상세 로딩 스켈레톤 및 Not Found 처리 (#8)

**일자:** 2026-04-06
**관련 버전:** v0.1.0
**관련 역할:** build

## 배경 (Context)

`#6`, `#7`에서 확립한 패턴(loading.tsx + 빈/에러 상태 분기)을 `/students/[studentId]` 페이지에도 동일하게 적용했다. #8의 DoD 중 미충족 항목은 로딩 스켈레톤과 존재하지 않는 수료생 접근 시 사용자 경험 처리였다.

수료생 상세 페이지는 대시보드나 기수 목록보다 정보 밀도가 높다. Hero 섹션, 프로젝트 목록, 기술 스택, 회고 + 멘토 코멘트, 사진 갤러리, Next Step CTA — 각 섹션의 구조를 그대로 스켈레톤에 반영해야 로딩 중 레이아웃 이탈(CLS)이 최소화된다.

## 문제 (Problem)

1. `/students/[studentId]/loading.tsx` 미존재 → 데이터 로딩 중 빈 화면.
2. `getCohort()`가 존재하지 않는 ID에서 throw 하고 `notFound()`를 호출하지만, 커스텀 `not-found.tsx`가 없어 Next.js 기본 404 화면으로 폴백.
3. 기본 404 화면은 브랜딩 없는 흰 화면으로, 이탈률을 높이고 대시보드 복귀 동선이 없음.

## 최종 해결 (Resolution)

### loading.tsx — 섹션별 스켈레톤 구성

`apps/web/src/app/students/[studentId]/loading.tsx` 신규 작성.

실제 페이지의 4개 섹션 구조를 그대로 반영했다:
- **Hero 섹션:** dark gradient 배경(`--hero-dark` → `--hero-deep`) 위에 흰색 반투명 pulse bar
- **프로젝트 + 우측 패널:** `lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]` 그리드 유지, 각 카드 내부 라인 구조 일치
- **사진 + Next Step:** `lg:grid-cols-[1.2fr_0.8fr]` 그리드, 사진 영역은 `h-60` block으로 처리

Hero 섹션의 배경은 `bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))]`로 실제 페이지와 동일하게 적용해 배경색 점프를 방지했다.

### not-found.tsx — 브랜딩 유지 + 복귀 동선

`apps/web/src/app/students/[studentId]/not-found.tsx` 신규 작성.

- 상단에 `404 Not Found` 레이블(accent 컬러, tracking 강조)
- "수료생을 찾을 수 없습니다" 메인 타이틀
- 안내 문구 + 대시보드 복귀 링크 버튼(accent 배경, rounded-full)
- 레이아웃: `flex-col items-center justify-center py-20`으로 수직 중앙 정렬

이 구조는 `/cohorts/[cohortId]/not-found.tsx`가 없는 상황에서 수료생 상세에만 우선 적용했다. 기수 상세 404는 이슈 미존재이므로 향후 별도 처리.

## 배운 것 (Lessons Learned)

로딩 스켈레톤의 핵심 원칙은 **실제 레이아웃과의 구조 일치**다. 단순히 bar를 채우는 것이 아니라 grid 컬럼 수, 카드 내부 행 간격, 배경색까지 맞춰야 CLS 없는 로딩 전환이 된다.

`#6` → `#7` → `#8` 패턴이 일관돼 `#8`도 삽질 없이 완료됐다. 단, 정보 밀도가 높은 페이지일수록 스켈레톤 코드 양도 비례해서 늘어난다 — 실제 레이아웃 코드를 참고하면서 작성하는 것이 정확도를 높이는 가장 빠른 방법이다.
