# [PRD] 책 프리뷰 렌더러

**Status:** Approved
**Date:** 2026-04-08
**Parent PRD:** `docs/prd/content-page-mapping-improvement.md`

## 1. 개요 (Overview)

### 배경 및 목적

SweetBook sandbox API는 생성된 책의 프리뷰(PDF, 이미지)를 제공하지 않는다. `/preview`, `/pdf`, `/pages` 엔드포인트 모두 404를 반환하며, `pdfStatus`도 null이다.

시연 시 "이 책이 이렇게 나옵니다"를 보여줄 수 없으면, 24페이지 콘텐츠 매핑 개선의 효과를 증명할 수 없다.

SweetBook 템플릿 API에서 제공하는 `layout.elements` 좌표·크기·폰트 데이터를 활용하여, 프론트엔드에서 실제 인쇄 결과와 유사한 프리뷰를 렌더링한다.

### 핵심 아이디어

SweetBook 템플릿의 `layout` 데이터는 각 요소의 **절대 좌표(x, y), 크기(width, height), 폰트, 색상**을 모두 포함하고 있다. 이것을 HTML/CSS `position: absolute`로 1:1 변환하면, 실제 인쇄 레이아웃을 재현할 수 있다.

## 2. 템플릿 레이아웃 데이터 분석

### 2.1 페이지 치수

템플릿 레이아웃에서 역산한 단일 페이지 크기:

- **내지 페이지:** 864 x 1212 (단위: 추정 pt 또는 자체 단위)
- **표지 스프레드:** ~1716 x 1212 (뒷표지 + 책등 + 앞표지)
- **책등(spine):** x=851, width=40

근거:
- 내지a의 `bg-taupe` 사각형: width=864, height=509 (페이지 상단 배경)
- 내지b의 `divider` 그래픽: width=203, height=1212 (페이지 전체 높이)
- 표지의 `front-photo`: x=1171, width=505 → 우측 끝 1676

### 2.2 사용할 템플릿 레이아웃

| 템플릿 | UID | 요소 수 | 렌더링 요소 |
|--------|-----|--------|------------|
| 표지 (구글포토북A) | `3S1ceGaglj5i` | 6 | rectangle, graphic, photo, text x3 |
| 내지b (일기장A) | `3mjKd8kcaVzT` | 4 | graphic, text x3 |
| 내지a (일기장A) | `3nWJ4wtPSQOb` | 5 | rectangle, text x2, photo, text |
| 내지_gallery (일기장A) | `msFsr6Ult7qw` | 4 | graphic, text x2, collageGallery |

### 2.3 요소 타입 → HTML 매핑

| SweetBook 타입 | HTML 렌더링 | 주요 속성 |
|----------------|------------|----------|
| `text` | `<div>` with absolute positioning | position, width, height, fontFamily, fontSize, textBrush(color), textAlignment, textLineHeight |
| `photo` | `<img>` with `object-fit: cover` | position, width, height, fileName(→src), fit, cornerRadius |
| `graphic` | `<img>` (스티커 이미지) | position, width, height, imageSource, opacity |
| `rectangle` | `<div>` with background-color | position, width, height, color |
| `collageGallery` | `<div>` with CSS grid/flex | position, width, height, 사진 배열 |

### 2.4 텍스트 파라미터 치환

템플릿의 `text` 필드에 `$$paramName$$` 패턴이 들어있다. 렌더링 시 이를 실제 값으로 치환한다.

```
"$$monthNum$$"  →  "04"
"$$dayNum$$"    →  "25"
"$$diaryText$$" →  "기능 구현보다 문제 정의가 더 중요하다는 점을 배웠고..."
"$$coverPhoto$$" → "https://picsum.photos/seed/bootcamp-team-1/1200/900"
"$$subtitle$$"  →  "김코드"
"$$dateRange$$" →  "2026-04-30"
```

## 3. 프리뷰 렌더러 설계

### 3.1 렌더링 파이프라인

```
EditSession + StudentData + CohortData
    ↓
페이지 타입별 파라미터 생성 (payload-mapper 로직 공유)
    ↓
템플릿 레이아웃 데이터 + 파라미터 결합
    ↓
HTML/CSS 렌더링 (scaled to viewport)
```

### 3.2 스케일링

실제 레이아웃 좌표(864x1212)를 화면 크기에 맞게 축소한다.

```typescript
const TEMPLATE_WIDTH = 864;
const TEMPLATE_HEIGHT = 1212;
const SCALE = containerWidth / TEMPLATE_WIDTH; // 예: 400px 컨테이너 → scale 0.463

// 각 요소의 좌표와 크기에 scale을 곱함
const style = {
  position: 'absolute',
  left: element.position.x * scale,
  top: element.position.y * scale,
  width: element.width * scale,
  height: element.height * scale,
  fontSize: element.fontSize * scale,
};
```

### 3.3 폰트 처리

| SweetBook 폰트 | 웹 대응 | 방법 |
|----------------|--------|------|
| `NanumMyeongjo` | Nanum Myeongjo | Google Fonts |
| `DM Serif Display` | DM Serif Display | Google Fonts |
| `Impact` | Impact | 시스템 폰트 |
| `Roboto` | Roboto | Google Fonts |
| `배달의민족 도현` | Baemin Dohyeon | Google Fonts (`Do Hyeon`) |
| `Oswald` | Oswald | Google Fonts |
| `나눔고딕` | Nanum Gothic | Google Fonts |

### 3.4 그래픽 리소스

템플릿의 `graphic` 요소가 참조하는 이미지(`imageSource`)는 SweetBook 내부 경로다:
```
/api_platform_image/public/image260312122639465.PNG
```

이 경로가 외부 접근 가능한지 확인 필요. 불가능하면:
- CSS로 유사한 시각 요소(세로 띠, 별 아이콘)를 대체
- 또는 해당 영역을 단색 배경으로 처리

### 3.5 프리뷰 UI 구성

```
┌─────────────────────────────────────┐
│  ← →  페이지 1 / 26                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   [템플릿 레이아웃 기반       │    │
│  │    렌더링된 페이지]          │    │
│  │                             │    │
│  │   04                        │    │
│  │   25                        │    │
│  │        기능 구현보다          │    │
│  │        문제 정의가 더         │    │
│  │        중요하다는 점을...     │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  [◀ 이전]  ● ● ● ○ ○ ○  [다음 ▶]  │
└─────────────────────────────────────┘
```

- 좌우 페이지 네비게이션
- 현재 페이지 번호 / 전체 페이지 수
- 각 페이지: 템플릿 레이아웃 좌표 기반 절대 배치 렌더링
- 표지는 스프레드(양면) 뷰로 표시

## 4. 구현 범위

### 4.1 컴포넌트 구조

```
apps/web/src/components/preview/
├── BookPreview.tsx          # 메인 프리뷰 컨테이너 (페이지 네비게이션)
├── PageRenderer.tsx         # 단일 페이지 렌더러 (템플릿 레이아웃 → HTML)
├── elements/
│   ├── TextElement.tsx      # text 요소 렌더링
│   ├── PhotoElement.tsx     # photo 요소 렌더링
│   ├── GraphicElement.tsx   # graphic 요소 렌더링
│   ├── RectElement.tsx      # rectangle 요소 렌더링
│   └── CollageElement.tsx   # collageGallery 요소 렌더링
├── templates.ts             # 템플릿 레이아웃 데이터 (API에서 가져온 것을 정적 저장)
└── types.ts                 # 렌더러 타입 정의
```

### 4.2 템플릿 데이터 저장 방식

템플릿 레이아웃 데이터는 **빌드 타임에 정적으로 저장**한다. 이유:

1. 템플릿 레이아웃은 자주 변경되지 않음
2. 런타임에 매번 API 호출하면 불필요한 지연
3. SweetBook API key를 프론트엔드에 노출하지 않음

```typescript
// templates.ts — API에서 한 번 가져와서 정적으로 저장
export const TEMPLATES = {
  cover: { /* 3S1ceGaglj5i layout data */ },
  contentB: { /* 3mjKd8kcaVzT layout data */ },
  contentA: { /* 3nWJ4wtPSQOb layout data */ },
  gallery: { /* msFsr6Ult7qw layout data */ },
} as const;
```

### 4.3 프리뷰 진입점

편집 화면(EditForm)에 **"프리뷰 보기"** 버튼을 추가한다. 클릭 시 모달 또는 사이드 패널로 프리뷰를 표시한다.

```
편집 화면
├── 블록 편집 영역 (기존)
├── [프리뷰 보기] 버튼 ← 신규
└── 프리뷰 모달/패널
    └── BookPreview 컴포넌트
```

## 5. 선행 검증 항목

| # | 검증 항목 | 방법 |
|---|----------|------|
| 1 | 그래픽 이미지 외부 접근 | `curl https://api-sandbox.sweetbook.com/api_platform_image/public/image260312122639465.PNG` |
| 2 | Google Fonts에 배달의민족 도현 존재 | Google Fonts 검색 (`Do Hyeon`) |
| 3 | collageGallery 렌더링 규칙 | flow.columns, columnGap 값에 따른 그리드 배치 |

## 6. 예외 처리

| 상황 | 대응 |
|------|------|
| 그래픽 이미지 로드 실패 | 단색 배경(#8B7D6B)으로 대체 |
| 사진 URL 로드 실패 | placeholder 이미지 표시 |
| 폰트 로드 실패 | fallback: serif(나눔명조 대용) 또는 sans-serif |
| 파라미터 값이 null | 빈 문자열로 렌더링 |
| diaryText가 요소 영역을 초과 | CSS overflow: hidden + text-overflow |

## 7. 아웃 오브 스코프

| 제외 기능 | 이유 |
|----------|------|
| 프리뷰에서 직접 텍스트 편집 | 편집은 EditForm에서, 프리뷰는 읽기 전용 |
| PDF 다운로드 | 브라우저 렌더링만 (html2canvas 등은 v2) |
| 인쇄 정확도 보장 | "유사한 프리뷰"이지 인쇄 교정(proof)이 아님 |
| 양면 펼침(spread) 뷰 | 단면 페이지 뷰만 지원 (표지만 예외적으로 스프레드) |
| 애니메이션/페이지 넘김 효과 | 단순 좌우 네비게이션 |

## 8. 코드 변경 범위

| 파일 | 변경 내용 | 크기 |
|------|----------|------|
| `src/components/preview/` (신규 디렉토리) | 프리뷰 컴포넌트 전체 | L |
| `src/components/preview/templates.ts` | 템플릿 레이아웃 정적 데이터 | M |
| `src/app/students/[studentId]/create/EditForm.tsx` | "프리뷰 보기" 버튼 + 모달 연결 | S |
| `src/app/cohorts/[cohortId]/create/CohortEditForm.tsx` | "프리뷰 보기" 버튼 + 모달 연결 | S |
| `src/app/globals.css` | Google Fonts import 추가 | S |

## 9. 다음 액션 플랜

1. 선행 검증 (그래픽 이미지 접근, 폰트 확인)
2. `templates.ts` — 템플릿 레이아웃 데이터 정적 저장
3. `PageRenderer` + 요소별 컴포넌트 구현
4. `BookPreview` 컨테이너 (페이지 네비게이션)
5. EditForm에 프리뷰 버튼 연결
6. 폰트·이미지 fallback 처리
