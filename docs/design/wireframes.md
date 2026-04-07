# Foliocraft 와이어프레임

**Status:** Active
**Date:** 2026-04-08
**Related:** `design-system-tokens.md`, `component-specs.md`

---

## 1. 랜딩페이지

각 섹션은 **서로 다른 레이아웃 패턴**을 사용한다.

```
┌─────────────────────────────────────────────────────────────┐
│ 📖 Foliocraft                                   [대시보드]  │
│ font-display, text-lg, font-semibold          border button │
├─────────────────────────────────────────────────────────────┤
│ [SECTION 1: HERO — Asymmetric Split]                        │
│ bg: --background + amber radial gradient overlay            │
│ min-h: 100dvh                                               │
│                                                             │
│  ┌──── 56% ────────────────┐  ┌──── 44% ──────────────┐    │
│  │                          │  │   perspective: 1200px  │    │
│  │  PORTFOLIO BOOK STUDIO   │  │                        │    │
│  │  eyebrow, --accent       │  │  ┌── Back Book ─────┐  │    │
│  │                          │  │  │ Cohort Showcase   │  │    │
│  │  수료생의 성장을           │  │  │ rotateY(-6deg)   │  │    │
│  │  한 권의 책으로            │  │  │ --surface-elev   │  │    │
│  │                          │  │  └──────────────────┘  │    │
│  │  text-4xl md:text-6xl    │  │     ┌── Front Book ──┐ │    │
│  │  font-bold               │  │     │ ▌coral spine   │ │    │
│  │  [text-wrap:balance]     │  │     │ Graduation     │ │    │
│  │                          │  │     │ Portfolio      │ │    │
│  │  body text, --text-muted │  │     │ 김코드          │ │    │
│  │  max-width: 65ch         │  │     │ --surface      │ │    │
│  │                          │  │     └────────────────┘ │    │
│  │  [데모 대시보드 보기] >>>  │  │     shadow: 40px      │    │
│  │   px-8 py-4 text-lg      │  │     rotateY(-4deg)    │    │
│  │   accent-glow shadow     │  │                        │    │
│  │  [책 종류 살펴보기]        │  │  ambient glow:        │    │
│  │   border button           │  │  accent, 0.04, 120px  │    │
│  └──────────────────────────┘  └────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│ [SECTION 2: RESULTS — Bento Grid]                           │
│ bg: --background, py-20 md:py-32                            │
│ border-b: --border-soft                                     │
│                                                             │
│  이런 결과물이 만들어집니다    eyebrow                        │
│  프로젝트와 성장 기록이 한 권의 책이 됩니다                     │
│  text-3xl md:text-5xl font-bold [text-wrap:balance]          │
│                   ──────── (decorative line)                  │
│                                                             │
│  ┌───── 60% ────────────────┐  ┌── 40% ────────────┐       │
│  │ 프로젝트 소개 페이지       │  │ ┌── 회고 페이지 ──┐ │       │
│  │ inner bento: 2-col grid  │  │ │ hover:scale-1.01│ │       │
│  │ ┌─StudyFlow─┐ ┌─기술──┐  │  │ └────────────────┘ │       │
│  │ │           │ │스택태그│  │  │ ┌── 활동 사진 ────┐ │       │
│  │ └───────────┘ └───────┘  │  │ │ hover:scale-1.01│ │       │
│  │ hover: scale-[1.01]      │  │ └────────────────┘ │       │
│  └──────────────────────────┘  └────────────────────┘       │
├─────────────────────────────────────────────────────────────┤
│ [SECTION 3: VALUE — Zig-zag Alternating]                    │
│ bg: --surface, py-20 md:py-32                               │
│ border-b: --border-soft                                     │
│                                                             │
│  ┌── text (48%) ───────┐  ┌── visual (52%) ────┐  Row 1    │
│  │ eyebrow + headline  │  │  accent gradient    │           │
│  │ text-3xl md:text-4xl│  │  border card        │           │
│  │ font-bold           │  │  "1" — 7xl, accent  │           │
│  │ body, max-w-prose   │  │  수료생 한 명의 서사  │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                           gap: 14           │
│  ┌── visual (52%) ────┐  ┌── text (48%) ───────┐  Row 2    │
│  │  --surface-elevated │  │ eyebrow + headline  │           │
│  │  "N" — 7xl, dim    │  │ body, max-w-prose   │           │
│  │  기수 전체의 아카이브│  │                     │           │
│  └─────────────────────┘  └─────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ [SECTION 4: BOOK TYPES — Asymmetric Cards]                  │
│ bg: --background, py-20 md:py-32                            │
│ border-b: --border-soft                                     │
│                                                             │
│  두 가지 포트폴리오 북     eyebrow                            │
│  목적에 맞는 결과물을 선택합니다                                │
│  text-3xl md:text-5xl font-bold                              │
│                                                             │
│  ┌──── 55% (primary) ──────┐  ┌──── 45% (secondary) ──┐    │
│  │ accent gradient bg       │  │ --surface              │    │
│  │ border: accent/20        │  │ border: --border-soft  │    │
│  │ [메인] badge             │  │                        │    │
│  │ 개인 포트폴리오 북        │  │ 기수 쇼케이스 북        │    │
│  │ hover: scale-[1.01]      │  │ hover: scale-[1.01]    │    │
│  └──────────────────────────┘  └────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│ [SECTION 5: WORKFLOW — Horizontal Steps]                    │
│ bg: --surface, py-20 md:py-32                               │
│ border-b: --border-soft                                     │
│                                                             │
│  간단한 운영 흐름           eyebrow                           │
│  6단계로 결과물을 완성합니다                                    │
│                                                             │
│  ┌─①─┐  ┌─②─┐  ┌─③─┐  ┌─④─┐  ┌─⑤─┐  ┌─⑥─┐              │
│  │h-12│  │   │  │   │  │   │  │   │  │   │              │
│  │w-12│  │   │  │   │  │   │  │   │  │   │              │
│  └────┘  └───┘  └───┘  └───┘  └───┘  └───┘              │
│  기수   수료생  책 종류 내용   북     주문                     │
│  선택   확인   선택   편집   생성   완료                      │
│                                                             │
│  스텝 번호: rounded-xl, accent-soft bg, hover → accent bg    │
│  hover: scale-110                                           │
├─────────────────────────────────────────────────────────────┤
│ [SECTION 6: CTA — Full-bleed Ambient]                       │
│ bg: --background + bottom amber radial gradient             │
│ py-20 md:py-32, text-center                                 │
│                                                             │
│  지금 바로 시작하세요                                         │
│  text-3xl md:text-5xl font-bold [text-wrap:balance]          │
│                                                             │
│  데모 대시보드에서 직접 경험해 보세요                            │
│  text-base, --text-muted                                    │
│                                                             │
│  [대시보드 둘러보기 →]                                        │
│  px-8 py-4 text-lg, accent-glow shadow                      │
├─────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                    │
│ border-t: --border-soft                                     │
│                                                             │
│  📖 Foliocraft                          © 2026 Foliocraft   │
│  text-sm, --text-muted                  text-xs, --text-dim │
└─────────────────────────────────────────────────────────────┘
```

### 랜딩페이지 레이아웃 패턴 요약

| 섹션 | 패턴 | 배경 |
|------|------|------|
| Hero | Asymmetric Split + 3D Book Covers | `--background` + amber radial |
| 결과물 | Bento Grid (60/40) | `--background` |
| 가치 | Zig-zag Alternating | `--surface` |
| 책 종류 | Asymmetric Cards (55/45) | `--background` |
| 운영 흐름 | Horizontal Steps (6-col) | `--surface` |
| CTA | Full-bleed Ambient | `--background` + amber radial |

6개 섹션이 모두 다른 패턴. ✓

### 안티 패턴 체크리스트

- [x] 3열 균등 카드 없음
- [x] 완전 대칭 Hero 없음
- [x] 모든 섹션이 다른 레이아웃
- [x] 결과물이 운영 도구보다 먼저 노출
- [x] 한국어 카피 번역투 아님
- [x] 보라/블루 계열 없음
- [x] CTA 충분히 크고 글로우 적용

---

## 2. 수료생 상세 페이지

```
┌─────────────────────────────────────────────────────────────┐
│ ⟵ 대시보드로 돌아가기                                        │
│ BackLink component                                          │
├─────────────────────────────────────────────────────────────┤
│ [HERO CARD: rounded-2xl, border, --surface, shadow]         │
│                                                             │
│  프론트엔드 개발              eyebrow, --accent              │
│                                                             │
│  김서연                       font-display, text-3xl         │
│                               md:text-5xl, font-bold         │
│  바이오 텍스트...             text-sm, --text-muted          │
│                                                             │
│                ┌── 수료 기념 페이지 ──────────────┐           │
│                │ border: accent/15, accent-soft bg│           │
│                │ "수료를 기념하는 첫 장"            │           │
│                └─────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  ┌── 선정 프로젝트 (55%) ──┐  ┌── 사이드 (45%) ──────────┐  │
│  │ rounded-2xl, border     │  │                          │  │
│  │                         │  │ ┌── 기술 스택 ─────────┐ │  │
│  │ ┌─── 프로젝트 1 ──────┐ │  │ │ rounded-2xl, border  │ │  │
│  │ │ font-display 2xl    │ │  │ │ 태그 칩 flex-wrap    │ │  │
│  │ │ font-bold           │ │  │ │ rounded-lg tags      │ │  │
│  │ │ body-sm summary     │ │  │ └──────────────────────┘ │  │
│  │ │ contribution block  │ │  │                          │  │
│  │ │ project link button │ │  │ ┌── 회고 ──────────────┐ │  │
│  │ └────────────────────┘ │  │ │ border-l-2 accent    │ │  │
│  │ ─── border-t ────────  │  │ │ font-display pull-qt │ │  │
│  │ ┌─── 프로젝트 2 ──────┐ │  │ │ "따옴표 감싸기"      │ │  │
│  │ │ (same pattern)      │ │  │ └──────────────────────┘ │  │
│  │ └────────────────────┘ │  │                          │  │
│  │                         │  │ ┌── 멘토 코멘트 ────────┐ │  │
│  └─────────────────────────┘  │ │ border-l-2 --text-dim│ │  │
│                                │ │ body-sm, --text-muted│ │  │
│                                │ └──────────────────────┘ │  │
│                                └──────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌── 활동 사진 (55%) ──────┐  ┌── 다음 단계 CTA (45%) ──┐  │
│  │ rounded-2xl, border     │  │ accent gradient bg      │  │
│  │ 2-col grid, rounded-xl  │  │ border: accent/15       │  │
│  │ photos                  │  │                          │  │
│  │                         │  │ font-display 2xl bold    │  │
│  │                         │  │ [text-wrap:balance]      │  │
│  │                         │  │                          │  │
│  │                         │  │ [책 종류 선택하기 →]      │  │
│  │                         │  │  px-8 py-4 accent-glow   │  │
│  └─────────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 설계 원칙

- 오른쪽 사이드바 3개 카드는 **각각 다른 시각 처리** (태그/pull-quote/bordered)
- 다음 단계 CTA는 accent gradient로 시각적 차별화
- 전체적으로 에디토리얼 매거진 톤, admin 템플릿 금지

---

## 3. 운영자 대시보드

```
┌─────────────────────────────────────────────────────────────┐
│ [HERO CARD: rounded-2xl, border, --surface, shadow, py-10] │
│                                                             │
│  운영자 대시보드             eyebrow          ┌─ 등록된 기수 ┐│
│                                               │ --surface-el ││
│  어떤 기수의 기록을 먼저                       │ count: 4xl   ││
│  책으로 정리할지 선택하세요                     │ font-bold    ││
│  text-3xl md:text-5xl font-bold               └──────────────┘│
│                                                             │
│  설명 텍스트...                                              │
├─────────────────────────────────────────────────────────────┤
│  기수 라이브러리              eyebrow                        │
│  차트 대신 선택에 필요한 정보만 정리했습니다                     │
│                                                             │
│  ┌── Cohort Card ──────────┐  ┌── Cohort Card ──────────┐  │
│  │ hover: scale-[1.01]     │  │ hover: scale-[1.01]     │  │
│  │ hover: accent border    │  │ hover: accent border    │  │
│  │ hover: shadow-32px      │  │ hover: shadow-32px      │  │
│  │                         │  │                         │  │
│  │ [기수 상세 보기 →]       │  │ [기수 상세 보기 →]       │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 공통 레이아웃 패턴

### 페이지 컨테이너

```
max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-10
```

### 히어로 카드 (내부 페이지)

```
rounded-2xl border border-[--border-soft] bg-[--surface]
px-6 py-10 sm:px-8 shadow-[0_2px_16px_var(--shadow-tint)]
```

### 콘텐츠 카드

```
rounded-2xl border border-[--border-soft] bg-[--surface]
px-6 py-6~7 shadow-[0_2px_16px_var(--shadow-tint)]
```

### 2열 비대칭 그리드

```
grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]
```
