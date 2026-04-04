# [Design Guide] Foundation Set 디자인 가이드

**Status:** Draft
**Date:** 2026-04-04
**Related Spec:** `docs/prd/foundation-set-ui-spec.md`
**Reference:** `taste-skill/SKILL.md`

## 1. 목적

이 문서는 `Foundation Set` 5개 화면을 Stitch로 다시 설계할 때 사용할 시각적 기준 문서다.  
특히 `taste-skill`의 강점을 그대로 복제하는 것이 아니라, 우리 제품의 성격인 `결과물 중심 B2B2C 서비스`에 맞게 번역하는 것을 목표로 한다.

이 문서가 해결하려는 문제는 두 가지다.
- 부분 화면만 예쁘고 전체 제품의 리듬이 어긋나는 문제
- 한국어 카피와 한글 폰트 처리에서 흔히 생기는 번역투/가독성 문제

## 2. 적용 범위

이 가이드는 아래 5개 화면에 우선 적용한다.
1. 랜딩페이지
2. 운영자 대시보드
3. 기수 상세 / 수료생 목록
4. 수료생 상세
5. 책 종류 선택

편집, 미리보기, 생성/주문 결과 화면은 이후 `Production Set`에서 같은 규칙을 상속한다.

## 3. 우리가 가져올 taste-skill의 핵심

### 3.1 그대로 가져오는 것
- 결과물 중심 Hero
- 완전 대칭형 레이아웃 금지
- 보라/과한 블루 계열의 AI 톤 금지
- 한글 우선 타이포그래피
- 섹션마다 다른 레이아웃 패턴 사용
- tinted shadow와 material depth 사용
- 템플릿 같은 3열 균등 카드 남발 금지
- 자연스러운 한국어 카피 우선

### 3.2 선택적으로만 가져오는 것
- 랜딩페이지용 강한 전환 구조
- CTA 강조 규칙
- subtle motion
- glass / grain / mesh gradient

### 3.3 이번 단계에서 가져오지 않는 것
- 과도한 마케팅 urgency
- 후기/로고 클라우드 남발
- 너무 공격적인 conversion copy
- 과한 인터랙티브 효과

## 4. 제품 해석

이 서비스는 일반 SaaS 대시보드도 아니고, 전형적인 랜딩페이지도 아니다.

- 랜딩에서는 `결과물`을 먼저 보여줘야 한다
- 내부 화면에서는 `운영 흐름`이 자연스럽게 이어져야 한다
- 따라서 첫인상은 에디토리얼/브랜딩에 가깝고, 이후 화면은 차분한 운영 툴에 가까워야 한다

즉 하나의 제품 안에서 아래 두 톤을 이어야 한다.
- 앞단: `결과물 중심 브랜드 경험`
- 뒷단: `정리된 운영자 도구`

## 5. 전체 시각 방향

### 5.1 키워드
- `editorial`
- `premium`
- `book-first`
- `curated`
- `calm operations`

### 5.2 금지 키워드
- `generic SaaS`
- `AI purple`
- `dashboard template`
- `admin boilerplate`
- `translated Korean`

### 5.3 비주얼 원칙
- 결과물은 입구에서 가장 크게 보인다
- 운영 데이터는 안쪽으로 갈수록 정제되어 보인다
- 화면마다 레이아웃은 달라도 재질감과 타이포는 일관돼야 한다
- 눈에 띄는 색은 하나만 쓴다
- 검은 그림자 대신 톤이 섞인 그림자를 사용한다

## 6. 컬러 시스템

### 6.1 기본 팔레트
```text
Background Base:   #F5F1E8
Surface Base:      #FFFDF8
Surface Soft:      rgba(255, 251, 244, 0.78)
Text Strong:       #171717
Text Default:      #2C2A27
Text Muted:        #6C665F
Border Soft:       rgba(23, 23, 23, 0.08)
Hero Dark:         #1D1A17
Hero Deep:         #31281D
Accent Brass:      #8A6A2F
Accent Brass Soft: rgba(138, 106, 47, 0.14)
Error:             #C2410C
Error Soft:        #FFF3E8
```

### 6.2 컬러 사용 규칙
- 페이지당 주 강조색은 `Accent Brass` 하나만 사용한다
- 보조 강조는 같은 hue의 opacity/brightness 차이로만 만든다
- 따뜻한 배경을 쓰는 만큼, 차가운 회색을 섞지 않는다
- pure black `#000000` 사용 금지
- 과한 gradient text 금지

### 6.3 화면별 컬러 톤
- 랜딩 Hero: `Hero Dark + Brass highlight`
- 운영자 대시보드: 밝은 배경 + 아이보리 표면
- 상세 화면: 더 조용한 중성 톤, 정보 밀도 상승
- 선택 화면: accent 사용량을 조금 더 높여도 됨

## 7. 타이포그래피

## 7.1 폰트 정책

이 프로젝트는 한글이 중심이기 때문에 폰트 선택을 느슨하게 두면 안 된다.

### 기본 정책
- **Primary Korean Font:** `Pretendard`
- **English Display Font:** `Geist`
- **Fallback:** system-ui 계열

### 허용 폰트 조합
```text
Heading / Display:
'Geist', 'Pretendard Variable', 'Pretendard', system-ui, sans-serif

Body / UI:
'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif
```

### 금지 폰트
- `Inter`
- `Noto Sans KR`
- `Roboto`
- `Arial`
- `Open Sans`

이유:
- `Inter`는 너무 흔해서 결과물이 템플릿처럼 보인다
- `Noto Sans KR`는 무난하지만 지금 목표인 프리미엄 톤엔 다소 평평하다

## 7.2 한글 타이포 규칙

### 헤드라인
- 한국어 헤드라인은 `text-4xl ~ text-6xl`
- `tracking-tight`
- `leading-tight` 또는 `leading-snug`
- `leading-none` 금지
- `text-wrap: balance` 또는 동등한 균형 줄바꿈 권장

### 본문
- 기본 본문은 `16px`
- 긴 설명은 `line-height`를 충분히 확보
- `max-width: 65ch` 근처에서 제한

### 캡션
- `12px ~ 14px`
- 너무 흐리게 하지 않는다

### 숫자
- 카운트/지표는 `tabular-nums` 사용

### 한글 줄바꿈
- 모든 한글 텍스트 블록은 `word-break: keep-all`
- 카드 핵심 정보는 2줄 이상 늘어지지 않게 제어

## 7.3 화면별 타이포 해석

- 랜딩 Hero:
  - 큰 한국어 헤드라인
  - 보조 문단은 2줄 또는 3줄 이내
- 운영자 대시보드:
  - 스캔 가능한 중간 크기 헤드라인
  - 수치와 레이블 위계 명확화
- 수료생 상세:
  - 에디토리얼 페이지처럼 보이되 문서 페이지처럼 딱딱해지지 않게 조정

## 8. 한국어 카피 가이드

이 문서는 폰트만큼이나 한국어 카피를 민감하게 다뤄야 한다.

### 8.1 기본 원칙
- 번역투 금지
- 존댓말 체계는 `합니다/하세요`로 통일
- 기술 용어만 영문 허용
- 감탄문 남발 금지

### 8.2 금지 표현
- 혁신적인
- 획기적인
- 차세대
- 원활한
- 게임 체인저
- 한 차원 높은

### 8.3 권장 방향
- 구체적으로 설명한다
- 결과물과 활용 장면을 먼저 말한다
- 짧고 또렷한 문장을 쓴다

### 8.4 예시
```text
나쁜 예:
수료 경험을 혁신적으로 완성하는 차세대 북 제작 플랫폼

좋은 예:
수료생의 프로젝트와 성장 기록을 한 권의 포트폴리오 북으로 제작합니다
```

## 9. 레이아웃 규칙

### 9.1 공통 컨테이너
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### 9.2 랜딩페이지
- Hero는 완전 대칭 금지
- `text + book visual`의 split composition 권장
- 각 섹션은 인접 섹션과 다른 레이아웃 패턴을 사용
- 3열 균등 카드 섹션 금지

### 9.3 운영자 대시보드
- 차트형 admin 금지
- 카드 스캔 중심
- 요약 정보는 적게, 선택 단위는 크게

### 9.4 기수 상세 / 수료생 상세
- 정보 밀도는 올라가지만, 모두 같은 카드 반복으로 보이면 안 됨
- 프로젝트 / 회고 / 사진은 다른 레이아웃 문법을 써야 함

### 9.5 책 종류 선택
- 정확히 2개의 선택지
- 동등해 보이지 말고, `개인 북`이 조금 더 주인공처럼 보여야 함

## 10. 표면감과 깊이

### 10.1 허용
- glass 계열 표면
- inner border
- background mesh
- subtle grain
- tinted shadow

### 10.2 금지
- neon glow
- 강한 외곽 발광
- 과한 blur 남용
- 싸구려 glassmorphism

### 10.3 기본 재질감
- 랜딩: 종이와 금속 사이의 브랜딩 톤
- 운영 화면: 아이보리 표면 + 조용한 border + 약한 그림자

## 11. 모션 가이드

### 11.1 기본 강도
- `subtle to medium`

### 11.2 허용 모션
- 책이 펼쳐지는 Hero 연출
- staggered reveal
- CTA hover / active
- 카드 hover 시 미세한 상승
- decorative floating element

### 11.3 금지 모션
- 지속적으로 시선을 빼앗는 강한 루프 애니메이션
- layout reflow를 유발하는 애니메이션
- 과한 3D 인터랙션

### 11.4 성능 원칙
- `transform`, `opacity` 중심
- 모바일에서도 어색하지 않아야 함

## 12. 랜딩페이지 전용 규칙

### 12.1 필수 섹션 순서
1. Navigation
2. Hero
3. 결과물 소개 또는 social proof 성격의 신뢰 섹션
4. 왜 필요한가
5. 두 가지 책 종류 소개
6. 운영 흐름
7. CTA
8. Footer

### 12.2 랜딩에서 사용할 수 있는 taste-skill 패턴
- Split Hero
- Bento Grid
- Zig-zag alternating section
- Metrics strip
- Full-bleed CTA

### 12.2.a 랜딩에서 피해야 할 패턴
- 동일한 크기의 정보 카드 3개를 가로로 나열한 기본 SaaS 소개 섹션
- 모든 섹션을 `타이틀 + 카드 나열`로 반복하는 템플릿 리듬
- 결과물 소개 섹션을 단순 feature list처럼 처리하는 구성

### 12.3 랜딩에서 아직 보류할 것
- testimonial masonry
- 로고 클라우드
- urgency 요소

## 13. 아이콘 / 이미지 가이드

### 아이콘
- 가능하면 한 세트로 통일
- Stitch 단계에서는 outline 계열의 정제된 아이콘 사용

### 이미지
- 책 결과물 mockup이 가장 중요
- 일반 stock 느낌의 팀 사진 남용 금지
- 결과물과 활동 장면의 관계가 분명해야 함

## 14. Stitch 입력 시 꼭 반영할 문장

- 결과물 중심의 서비스이므로 Hero에서 운영자가 아니라 책 결과물이 먼저 보여야 한다
- 보라/사이버 블루 계열 대신 neutral + brass accent를 사용한다
- Pretendard를 기본 한글 폰트로 사용하고, 영어 디스플레이 폰트는 Geist 계열로 제한한다
- 한국어 헤드라인은 크게, 하지만 줄간을 너무 조이지 않는다
- 각 섹션은 같은 구조를 반복하지 말고 서로 다른 레이아웃 패턴을 가져야 한다
- 과한 SaaS admin 템플릿처럼 보이지 않게 한다

## 15. 안티 패턴 체크리스트

- [ ] Inter 기반 기본 SaaS 톤으로 회귀하지 않았는가
- [ ] 보라/블루 AI gradient가 다시 들어오지 않았는가
- [ ] 랜딩 Hero가 너무 대칭적이지 않은가
- [ ] 모든 섹션이 같은 카드 나열 구조가 아닌가
- [ ] 랜딩 초반 섹션이 3열 균등 카드 소개 블록으로 떨어지지 않았는가
- [ ] 한국어 문장이 번역투로 들리지 않는가
- [ ] 결과물보다 운영툴이 먼저 보이지 않는가
- [ ] 첫 화면이 “책을 만드는 서비스”로 즉시 읽히는가
- [ ] 선택 화면에서 현재 선택 대상이 사라지지 않았는가
- [ ] 상세 화면의 복귀 링크가 직전 맥락을 유지하는가

## 16. 다음 액션

- Stitch 1차 생성은 이 문서와 `foundation-set-ui-spec.md`를 함께 입력으로 사용한다
- 먼저 랜딩, 운영자 대시보드, 기수 상세, 수료생 상세, 책 종류 선택 화면을 생성한다
- 산출물 검토 시 가장 먼저 보는 기준은 `한국어 톤`, `폰트 인상`, `레이아웃 반복 여부`다
