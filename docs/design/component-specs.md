# Foliocraft 컴포넌트 명세서

**Status:** Active
**Date:** 2026-04-08
**Related:** `design-system-tokens.md`, `wireframes.md`

---

## 1. BackLink

**역할:** 이전 화면으로 돌아가는 네비게이션 링크
**사용 화면:** 기수 상세, 수료생 상세, 책 종류 선택, 편집 화면
**파일:** `src/components/BackLink.tsx`

### Props

| Prop | 타입 | 설명 |
|------|------|------|
| href | `string` | 이동할 경로 |
| children | `React.ReactNode` | 링크 텍스트 |

### 스타일

- 텍스트: `text-sm font-medium text-[--text-muted]`
- 원형 아이콘: `h-7 w-7 rounded-full border border-[--border-mid]`, `←` 화살표
- Hover: 텍스트 `--accent`, 아이콘 `bg-[--accent] text-white border-[--accent]`
- 전체: `hover:scale-[1.02]`

---

## 2. EmptyState

**역할:** 데이터가 없을 때의 빈 상태 표시
**사용 화면:** 대시보드, 기수 상세
**파일:** `src/components/EmptyState.tsx`

### Props

| Prop | 타입 | 설명 |
|------|------|------|
| title | `string` | 제목 |
| message | `string` | 안내 메시지 |

### 스타일

- 컨테이너: `rounded-2xl border-2 border-dashed border-[--border-mid] bg-[--surface] py-24 text-center`
- 제목: `font-display text-2xl font-bold tracking-tight [text-wrap:balance]`
- 메시지: `text-sm leading-7 text-[--text-muted] max-w-sm`

---

## 3. SectionEyebrow

**역할:** 섹션 상단 카테고리 라벨
**사용 화면:** 전체
**파일:** `src/components/SectionEyebrow.tsx`

### Props

| Prop | 타입 | 설명 |
|------|------|------|
| children | `React.ReactNode` | 라벨 텍스트 |

### 스타일

- `text-xs font-semibold tracking-[0.25em] text-[--accent] uppercase`

---

## 4. 기수 카드 (인라인)

**역할:** 기수 목록에서 개별 기수를 카드 형태로 표시
**사용 화면:** 운영자 대시보드
**파일:** `src/app/dashboard/page.tsx` 내 인라인

### 데이터

| 필드 | 표시 |
|------|------|
| program | Eyebrow 라벨 (accent, uppercase) |
| name | `font-display text-2xl font-bold` |
| tagline | `text-sm text-[--text-muted]` |
| studentCount | 우측 상단 카운터 박스 |
| summary | `--surface-elevated` 배경 블록 |
| graduationDate | 하단 좌측, `tabular-nums` |

### 상태별 스타일

| 상태 | 스타일 |
|------|-------|
| Default | `rounded-2xl border border-[--border-soft] bg-[--surface] shadow-[0_2px_16px_var(--shadow-tint)]` |
| Hover | `border-[--accent]/20 shadow-[0_8px_32px_var(--shadow-tint)] scale-[1.01]` |

### 카운터 박스

- `rounded-xl border border-[--border-mid] bg-[--surface-elevated]`
- 숫자: `text-2xl font-bold tabular-nums`

---

## 5. 수료생 카드 (인라인)

**역할:** 기수 상세에서 개별 수료생을 카드 형태로 표시
**사용 화면:** 기수 상세
**파일:** `src/app/cohorts/[cohortId]/page.tsx` 내 인라인

### 데이터

| 필드 | 표시 |
|------|------|
| roleTrack | Eyebrow 라벨 |
| name | `font-display text-2xl font-bold` |
| bio | `text-sm text-[--text-muted]` |
| primaryProjectTitle | `--surface-elevated` 내부 블록 |
| projectCount | 하단 좌측, `tabular-nums` |

### 상태별 스타일

기수 카드와 동일한 hover 패턴.

---

## 6. 사이드바 정보 카드 (수료생 상세 전용)

수료생 상세 화면 오른쪽 영역에 사용되는 3가지 카드.
**각각 다른 시각 처리**가 핵심.

### 6-1. 기술 스택 카드

- 컨테이너: `rounded-2xl border border-[--border-soft] bg-[--surface] shadow-[0_2px_16px_var(--shadow-tint)]`
- 태그: `rounded-lg border border-[--border-mid] bg-[--surface-elevated] px-3 py-1.5 text-sm font-medium`
- 레이아웃: `flex-wrap gap-2`

### 6-2. 회고 카드

- 컨테이너: `rounded-2xl rounded-l-none border-l-2 border-[--accent] bg-[--surface]`
- pull-quote 스타일: `font-display text-lg font-medium leading-8`
- 따옴표로 감싸기: `&ldquo;...&rdquo;`

### 6-3. 멘토 코멘트 카드

- 컨테이너: `rounded-2xl rounded-l-none border-l-2 border-[--text-dim] bg-[--surface]`
- 라벨: `text-[--text-dim]` (accent 아님)
- 본문: `text-sm leading-7 text-[--text-muted]`

---

## 7. 편집 폼 사이드바

**역할:** 북 편집 인터페이스 (표지 제목, 수료 문구, 프로젝트/사진 토글, 페이지 순서)
**사용 화면:** 개인 북 편집, 기수 북 편집
**파일:** `EditForm.tsx`, `CohortEditForm.tsx`

### 컨테이너 스타일

- `rounded-2xl border border-[--accent]/15 bg-gradient-to-b from-[--accent-soft] to-[--surface] p-7`
- 제목: `font-display text-2xl font-bold`

### textarea 인풋

- `rounded-lg border border-[--border-mid] bg-[--surface] text-sm`
- Focus: `border-[--accent] ring-1 ring-[--accent]`

### 토글 버튼

| 상태 | 스타일 |
|------|-------|
| 포함 | `border-[--accent]/15 bg-[--accent-soft] text-[--foreground]` |
| 제외 | `border-[--border-soft] bg-[--surface-elevated] text-[--text-dim]` |
| Hover | `scale-[1.01]` |

### CTA 버튼

- `rounded-xl bg-[--accent] text-white px-6 py-3.5 text-sm font-semibold`
- 글로우: `shadow-[0_4px_16px_var(--accent-glow)]`
- Hover: `scale-[1.02]`
- Disabled: `opacity-60 cursor-not-allowed`

### 성공/에러 상태

| 상태 | 스타일 |
|------|-------|
| 책 생성 완료 | `border border-[--accent]/15 bg-[--accent-soft]` |
| 주문 완료 | `border border-[--success]/15 bg-[--success-soft]` |
| 에러 | `text-[--error]` |

---

## 8. 다음 단계 CTA 카드

**역할:** 현재 화면에서 다음 흐름으로 안내
**사용 화면:** 기수 상세, 수료생 상세

### 스타일

- `rounded-2xl border border-[--accent]/15 bg-gradient-to-br from-[--accent-soft] to-transparent p-7`
- 제목: `font-display text-2xl font-bold [text-wrap:balance]`
- 본문: `text-sm leading-7 text-[--text-muted] max-w-prose`
- CTA: `rounded-xl bg-[--accent] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] hover:scale-[1.02]`

---

## 9. 공통 상태 패턴

모든 데이터 표시 컴포넌트는 아래 상태를 고려해야 한다.

| 상태 | 시각 처리 |
|------|---------|
| Default | 정상 데이터 표시 |
| Loading | skeleton `animate-pulse` — `--surface-elevated` 배경 |
| Empty | EmptyState 컴포넌트 사용 |
| Error | `text-[--error]`, 재시도 버튼 |
| Disabled | `opacity-60`, `cursor-not-allowed` |
