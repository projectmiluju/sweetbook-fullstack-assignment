# 개발 일지: #85 책 프리뷰 렌더러 선행 검증

**일자:** 2026-04-08
**관련 이슈:** #85
**관련 역할:** build

## 배경 (Context)

책 프리뷰 렌더러(#86~#88) 구현 전, PRD `book-preview-renderer.md` 섹션 5에서 명시한 3개의 외부 의존성을 sandbox API와 Google Fonts에 직접 호출하여 검증한다. ADR-004와 #81 검증의 교훈에 따라, **구현 전에 API 가용성을 직접 확인**하고 fallback 전략을 확정한다.

## 검증 항목 및 결과

### 1. 그래픽 이미지 외부 접근 — ❌ 불가

**검증:**
```bash
curl -sIL "https://api-sandbox.sweetbook.com/api_platform_image/public/image260312122639465.PNG"
# HTTP/2 301 → location: https://api.sweetbook.com/...
# HTTP/2 404 (production)
```

`Authorization: Bearer <SWEETBOOK_API_KEY>` 헤더를 추가해도 동일하게 404. sandbox는 production으로 301 리디렉트하지만 production에 해당 리소스가 존재하지 않는다. 두 번째 그래픽(`image260312122533797.PNG`, 표지의 `back-star`)도 동일하게 404 확인.

**영향 받는 요소 (템플릿 API 조회 결과):**
- 내지b `3mjKd8kcaVzT`: `divider` graphic — 좌측 세로 띠 (203 × 1212)
- 내지_gallery `msFsr6Ult7qw`: `left-divider` graphic — 좌측 세로 띠 (203 × 1212), 내지b와 동일 이미지
- 표지 `3S1ceGaglj5i`: `back-star` graphic — 뒷표지 별 모양 스티커

**Fallback 결정:**
| 요소 | 대체 방법 |
|------|---------|
| 내지b/내지_gallery `divider` | CSS `<div>` + 단색 배경 (`#8B7D6B` 토프 계열). 폭/높이는 템플릿 좌표 그대로 |
| 표지 `back-star` | CSS `::before` 의사 요소 + 유니코드 별표(★) 또는 단순 생략 |

### 2. Google Fonts 가용성 — ✅ 6/6 모두 사용 가능

**검증:**
```bash
for font in "Do+Hyeon" "Nanum+Myeongjo" "DM+Serif+Display" "Nanum+Gothic" "Oswald" "Roboto"; do
  curl -sI "https://fonts.googleapis.com/css2?family=${font}" | head -1
done
```

**결과:** 6종 모두 `HTTP/2 200`.

| SweetBook 폰트명 | Google Fonts 패밀리 | 상태 |
|-----------------|---------------------|------|
| 배달의민족 도현 | `Do Hyeon` | ✅ |
| NanumMyeongjo | `Nanum Myeongjo` | ✅ |
| DM Serif Display | `DM Serif Display` | ✅ |
| 나눔고딕 | `Nanum Gothic` | ✅ |
| Oswald | `Oswald` | ✅ |
| Roboto | `Roboto` | ✅ |
| Impact | (시스템 폰트) | n/a |

**구현 시:** `apps/web/src/app/globals.css`에 6개 패밀리를 단일 `@import url(...)` 한 줄로 로드. fallback은 `serif` (Nanum Myeongjo, DM Serif Display 계열) / `sans-serif` (나머지).

### 3. collageGallery 렌더링 규칙 — ✅ `layout: "auto"` 확인

`msFsr6Ult7qw` 템플릿의 `collage` 요소 데이터 (`/v1/templates/msFsr6Ult7qw` 응답에서 추출):

```json
{
  "element_id": "collage",
  "type": "collageGallery",
  "position": { "x": 216.44, "y": 87.44 },
  "width": 634.31,
  "height": 1036.64,
  "tag": "collageGallery",
  "photos": "$$collagePhotos$$",
  "fit": "cover",
  "verticalAlignment": "Top",
  "container": {
    "maxWidth": 864,
    "maxHeight": 513.48,
    "itemGap": 8.83
  },
  "layout": "auto",
  "gap": 10
}
```

추가로 `layoutRules.flow.columnGap = 17.67`이 있으나 이건 페이지 레벨 컬럼 간격이고 collage 내부와 무관.

**핵심 발견:**

- PRD가 언급한 `flow.columns` 속성은 **존재하지 않는다.** 대신 `layout: "auto"`로 SweetBook이 사진 개수에 따라 자체 알고리즘으로 배치한다.
- `gap: 10`이 사진 간 간격이고, `container.maxWidth/maxHeight`는 컨테이너 제약.
- `fit: "cover"`이므로 각 사진은 `object-fit: cover`로 영역을 채운다.

**Fallback (자체 그리드 규칙):**

SweetBook 내부 알고리즘을 정확히 재현할 수 없으므로, **사진 개수별 정적 그리드 규칙**을 정의한다:

| 사진 수 | grid-template-columns | grid-template-rows |
|--------|----------------------|---------------------|
| 1장 | `1fr` | `1fr` |
| 2장 | `1fr 1fr` | `1fr` |
| 3장 | `1fr 1fr` | `1fr 1fr` (3번째는 첫 칸에서 row-span 2 또는 단순 빈 칸) |
| 4장 | `1fr 1fr` | `1fr 1fr` |
| 5장 이상 | `repeat(3, 1fr)` | `auto` (row 자동) |

`gap: 10px`, `object-fit: cover`. 더 정교한 매스닉 레이아웃은 v2에 후순위.

## 시도한 것들 (Attempts)

1. **그래픽 이미지 직접 GET** — 401/403이 아닌 301→404가 떨어졌으므로 권한 문제가 아니라 **리소스 자체가 외부 노출되지 않음**. SweetBook 내부 렌더링 전용 경로로 추정.
2. **Auth 헤더 추가 재시도** — 동일하게 404. API key는 무관.
3. **다른 graphic 요소 확인** — 4개 템플릿(`3mjKd8kcaVzT`, `3nWJ4wtPSQOb`, `3S1ceGaglj5i`, `msFsr6Ult7qw`)을 모두 조회하여 graphic 요소 패턴을 확인. 모두 `/api_platform_image/public/...` 경로이고 모두 외부 접근 불가.
4. **템플릿 데이터 추출** — `/v1/templates/{uid}` 엔드포인트가 정상 동작 확인. #86에서 templates.ts를 작성할 때 이 엔드포인트로 4개 템플릿을 가져와 정적 저장 가능.

## 최종 해결 (Resolution)

3개 검증 항목 결과:

| 항목 | 결과 | Fallback 필요 여부 |
|------|------|------------------|
| 그래픽 이미지 접근 | ❌ 외부 접근 불가 | **필요** — CSS 단색 div로 대체 |
| Google Fonts 6종 | ✅ 모두 가용 | 불필요 |
| collageGallery 규칙 | ⚠️ `layout:"auto"` (재현 불가) | **필요** — 사진 수별 정적 그리드 규칙 |

`/v1/templates/{uid}` 엔드포인트는 sandbox에서 정상 동작하므로, #86에서 4개 템플릿(표지, 내지a, 내지b, 내지_gallery) 데이터를 build-time에 가져와 `templates.ts`에 정적 저장하는 PRD §4.2 전략은 그대로 진행 가능.

## 배운 것 (Lessons Learned)

- **PRD의 가정을 검증 없이 수용하지 말 것.** PRD는 `flow.columns` 속성이 존재한다고 가정했지만 실제 API 응답에는 없었다. `flow.columnGap`만 있고, collage 자체는 `layout: "auto"`라는 블랙박스. 검증 없이 구현했으면 잘못된 그리드 속성을 참조하는 코드가 나왔을 것.
- **graphic 요소 노출 정책은 SweetBook의 의도된 제약**으로 보인다. 같은 패턴으로 모든 graphic이 차단되어 있는데, 이는 SweetBook이 자사 디자인 자산을 외부 렌더링에서 보호하려는 것일 가능성. CSS 대체가 유일한 옵션.
- **#81 검증의 비용 대비 가치**가 이번에도 입증됐다. 만약 검증 없이 #86~#87을 진행했으면 그래픽 이미지 fallback 추가 작업 + collageGallery 그리드 규칙 잘못 가정으로 인한 재작업이 발생했을 것이다. 30분의 검증으로 수 시간의 재작업을 방지.
