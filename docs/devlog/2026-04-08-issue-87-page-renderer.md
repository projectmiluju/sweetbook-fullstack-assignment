# 개발 일지: #87 PageRenderer + 요소별 렌더링 컴포넌트

**일자:** 2026-04-08
**관련 이슈:** #87
**관련 역할:** build, qa

## 배경 (Context)

#85 검증으로 fallback 결정이 확정되고 #86에서 4개 템플릿 데이터가 정적 저장된 상태. 이제 그 데이터를 HTML/CSS로 렌더링하는 PageRenderer + 5종 element 컴포넌트를 구현해야 한다. PRD §3, §4.1을 그대로 구현했으므로 어려운 설계 결정은 없었지만, 두 가지 사항이 기록할 가치가 있다.

## 구현 요약

- `PageRenderer.tsx`: 템플릿 + 파라미터 + containerWidth → 절대 배치 페이지
- `elements/{Text,Photo,Graphic,Rectangle,Collage}Element.tsx`: 5종 element 디스패치
- `utils/color.ts` (`#AARRGGBB` → `rgba()`), `utils/font.ts` (SweetBook 폰트명 → Google Fonts 매핑), `utils/scale.ts` (좌표 스케일링)
- `globals.css`에 6종 폰트 단일 `@import url(...)` 한 줄 추가
- 테스트 53개 신규 (color 9, font 9, scale 8, CollageElement helpers 12, elements 21, PageRenderer 통합 15)

## 시도한 것들 (Attempts)

1. **SweetBook 폰트명 매핑** — templates.ts의 fontFamily 값을 grep으로 추출해보니 `"NanumMyeongjo"`(공백 없음), `"DM Serif Display"`, `"Impact"`, `"Roboto"`, `"배달의민족 도현"`(한글) 5종이 실제 사용되고 있었다. Google Fonts는 모두 공백 있는 영문명을 쓰므로 매핑 테이블이 필요. PRD가 제시한 6종 폰트 외에 `Oswald`, `Nanum Gothic`은 4개 템플릿에 실제로 사용되지 않았지만, PRD §3.3 표에 명시되어 있어 globals.css에는 6종 모두 import (미래 확장 대비).

2. **collageGallery의 layout:"auto" 처리** — #85에서 확인한 대로 SweetBook 알고리즘은 블랙박스. CSS grid로 사진 수별 정적 규칙(1: 1col, 2: 2col, 3-4: 2x2, 5+: 3col) 적용. JSON 파싱 실패 시 빈 배열로 fallback.

3. **GraphicElement 회귀 방지** — `imageSource` 필드가 templates.ts에 그대로 남아 있어, 미래에 누군가 "이미지가 안 보여요"라며 `<img src={imageSource}>`를 추가할 위험이 있다. QA에서 명시적으로 "img 태그 절대 생성 안 함" + "imageSource 문자열이 DOM 어디에도 나타나지 않음" 회귀 방지 테스트를 추가했다.

## 배운 것 (Lessons Learned)

- **happy-dom의 색상 보존 차이**: GraphicElement 테스트를 작성할 때 `style.backgroundColor`가 `"rgb(139, 125, 107)"`로 정규화될 거라 가정했으나, happy-dom은 hex(`"#8B7D6B"`)를 그대로 보존한다. jsdom은 정규화하므로 두 환경 간 동작이 다르다. 실제 브라우저는 정규화하므로 코드 자체는 정상이지만, 단위 테스트 작성 시 happy-dom의 동작을 기준으로 expect 값을 맞춰야 한다. 향후 색상 검증 테스트 작성 시 주의.
- **PRD 가정과 실제 데이터의 작은 차이**: PRD §3.3 폰트 표는 6종을 명시했지만, 실제 4개 템플릿은 5종만 사용한다. 정합성 테스트가 없으면 미사용 폰트를 calling하는 코드가 dead로 남는다. 이번엔 미래 확장을 위해 그대로 import 유지.
- **회귀 방지 테스트의 가치**: imageSource가 DOM에 나타나지 않는다는 검증은 평소엔 "당연한 것"이지만, #85 검증이라는 맥락이 있어야 의미가 명확해진다. devlog/PRD에 결정 배경을 기록하고, 회귀 방지 테스트로 강제하는 패턴을 유지.
