# Foliocraft 디자인 시스템 토큰

**Status:** Active
**Date:** 2026-04-08
**Related:** `component-specs.md`, `wireframes.md`

---

## 1. 컬러 팔레트

### 기본 팔레트

```css
:root {
  /* 배경 */
  --background:       #fafaf9;  /* 페이지 배경 (warm stone white) */
  --surface:          #ffffff;  /* 카드/모달 배경 (순백) */
  --surface-elevated: #f5f5f4;  /* 높은 표면, 인라인 블록 배경 (stone-100) */

  /* 텍스트 */
  --foreground:    #1c1917;  /* 헤드라인 (stone-900) */
  --text-default:  #292524;  /* 본문 (stone-800) */
  --text-muted:    #78716c;  /* 보조 텍스트 (stone-500) */
  --text-dim:      #a8a29e;  /* 비활성/캡션 (stone-400) */

  /* 악센트 */
  --accent:       #b45309;  /* 유일한 주 강조색 (amber-700) */
  --accent-hover: #d97706;  /* hover 시 밝은 변형 (amber-600) */
  --accent-soft:  rgba(180, 83, 9, 0.06);  /* 배지, 태그, 약한 강조 배경 */
  --accent-glow:  rgba(180, 83, 9, 0.15);  /* CTA 글로우 그림자 */

  /* 상태 */
  --error:        #dc2626;
  --error-soft:   rgba(220, 38, 38, 0.06);
  --success:      #16a34a;
  --success-soft: rgba(22, 163, 74, 0.06);

  /* 유틸리티 */
  --border-soft:  rgba(28, 25, 23, 0.06);  /* 미세 구분선 */
  --border-mid:   rgba(28, 25, 23, 0.12);  /* 카드 테두리, 인풋 보더 */
  --shadow-tint:  rgba(120, 113, 108, 0.08);  /* stone 톤 틴트 그림자 */
}
```

### 컬러 규칙

- 페이지당 주 강조색은 `--accent` 하나만 사용
- 보조 강조는 같은 hue의 opacity 차이로만 (`--accent-soft`, `--accent-glow`)
- 차가운 회색 혼용 금지 — stone 계열만 사용
- pure black `#000000` 사용 금지 — `#1c1917` 사용
- 보라/블루 계열 악센트 금지 (AI 디자인 지문)
- 검은 그림자 대신 `--shadow-tint` 사용

### 화면별 컬러 톤

| 화면 | 배경 | 표면 | 강조 수준 |
|------|------|------|---------|
| 랜딩 Hero | `--background` + amber radial gradient | `--surface` | 높음 (CTA 글로우) |
| 운영자 대시보드 | `--background` | `--surface` | 보통 |
| 상세 화면 | `--background` | `--surface` | 낮음 (정보 밀도 우선) |
| 선택/편집 화면 | `--background` | `--surface` | 약간 높음 (accent gradient) |

---

## 2. 타이포그래피

### 폰트 스택

```css
:root {
  --font-sans:    "Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", system-ui, sans-serif;
  --font-display: "Outfit", "Pretendard Variable", "Pretendard", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "SFMono-Regular", "Consolas", monospace;
}
```

- **Outfit**: Google Fonts CDN으로 로드. 헤드라인/디스플레이용 기하학적 산세리프.
- **Pretendard**: 한글 본문. 영문 fallback으로도 사용.

### 금지 폰트

Inter, Noto Sans KR, Roboto, Arial, Open Sans, Space Grotesk, Cormorant Garamond

### 타이포 스케일

| 레벨 | Tailwind 클래스 | 굵기 | 용도 |
|------|----------------|------|------|
| display | `text-4xl md:text-6xl font-bold tracking-tight` | 700–800 | 랜딩 Hero 타이틀 |
| headline-lg | `text-3xl md:text-5xl font-bold tracking-tight` | 700 | 페이지 대제목 |
| headline-md | `text-2xl md:text-3xl font-bold tracking-tight` | 700 | 섹션 제목 |
| title | `text-2xl font-bold tracking-tight` | 700 | 카드 제목 |
| body-lg | `text-base leading-8` | 400 | 강조 본문 |
| body | `text-sm leading-7` | 400 | 기본 본문 |
| label | `text-[10px] font-semibold tracking-[0.2em] uppercase` | 600 | Eyebrow, 메타 라벨 |
| caption | `text-xs` | 400–500 | 캡션, 타임스탬프 |

### 한글 특화 규칙

- `word-break: keep-all` — body 레벨에 전역 적용
- 헤드라인: `tracking-tight`, `leading-tight` (never `leading-none`)
- 본문: `max-w-prose` 또는 `max-width: 65ch`
- 숫자/통계: `tabular-nums`
- 헤드라인: `[text-wrap:balance]` 균형 줄바꿈

---

## 3. 간격 체계

| 토큰 | Tailwind | 값 | 용도 |
|------|---------|-----|------|
| xs | `gap-1` | 4px | 아이콘-텍스트 간격 |
| sm | `gap-2` | 8px | 인라인 요소 간격 |
| md | `gap-4` / `p-4` | 16px | 카드 내부 패딩 |
| lg | `gap-5` / `p-6` | 20–24px | 카드 간 간격 |
| xl | `gap-8` / `p-7` | 28–32px | 섹션 내 블록 간격 |
| 2xl | `py-10` | 40px | 내부 페이지 섹션 패딩 |
| 3xl | `py-20 md:py-32` | 80–128px | 랜딩페이지 섹션 패딩 |

---

## 4. 모서리 둥글기

| 토큰 | Tailwind | 값 | 용도 |
|------|---------|-----|------|
| sm | `rounded` | 4px | 태그 보더 |
| md | `rounded-lg` | 8px | 버튼, 입력 필드, 내부 카드 |
| lg | `rounded-xl` | 12px | 사이드바 카드, 인라인 블록 |
| xl | `rounded-2xl` | 16px | 메인 카드, 섹션 컨테이너 |

---

## 5. 그림자

```css
/* 카드 기본 — 미세한 깊이감 */
shadow-[0_2px_16px_var(--shadow-tint)]

/* 카드 Hover — 부양 효과 */
shadow-[0_8px_32px_var(--shadow-tint)]

/* CTA 글로우 — accent 기반 */
shadow-[0_4px_24px_var(--accent-glow)]

/* CTA Hover 글로우 — 강화 */
shadow-[0_8px_32px_var(--accent-glow)]

/* Hero 요소 — 깊은 그림자 */
shadow-[0_40px_80px_var(--shadow-tint)]
```

규칙: 검은 그림자(`rgba(0,0,0,...)`) 사용 금지. 항상 `--shadow-tint` 또는 `--accent-glow` 사용.

---

## 6. 공통 컨테이너

```css
max-w-7xl mx-auto px-5 sm:px-8
```

- 최대 너비: `80rem` (1280px)
- 좌우 패딩: 모바일 `20px`, 태블릿+ `32px`

---

## 7. 트랜지션 & 모션

### 전역 트랜지션

```css
a, button {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

button:active, a:active {
  transform: scale(0.98);
}
```

### hover 패턴

| 요소 | hover 효과 |
|------|-----------|
| CTA 버튼 | `hover:scale-[1.02]` + 글로우 그림자 강화 |
| 카드 (링크) | `hover:scale-[1.01]` + 보더 accent 전환 + 그림자 강화 |
| 텍스트 링크 | `hover:text-[color:var(--accent)]` |
| 토글 버튼 | `hover:scale-[1.01]` |
| BackLink | 원형 아이콘 accent 전환 |

### 진입 애니메이션

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

- 스태거 딜레이: `80ms` 간격 (`.delay-1` ~ `.delay-6`)
- 모션 원칙: `transform`, `opacity` 중심. 과한 3D/루프 애니메이션 금지.

---

## 8. 텍스처 & 표면

### 그레인 오버레이

- SVG `feTurbulence` 노이즈, `opacity: 0.022`
- `position: fixed`, `pointer-events: none`, `z-index: 9999`
- 전체 뷰포트에 미세한 질감 부여

### 배경 그라데이션

- 랜딩 Hero: `radial-gradient(ellipse_70%_50%_at_20%_50%, rgba(180,83,9,0.06), transparent)` (앰버 메시)
- CTA 섹션: `radial-gradient(ellipse_60%_60%_at_50%_110%, rgba(180,83,9,0.06), transparent)` (하단 앰비언트)
- 강조 카드: `bg-gradient-to-br from-[color:var(--accent-soft)] to-[color:var(--surface)]`

### 스크롤바

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--text-dim); border-radius: 3px; }
```

### 기타

- `scroll-behavior: smooth` (html)
- `::selection { background: var(--accent); color: white; }`
