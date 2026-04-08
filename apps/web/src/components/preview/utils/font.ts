/**
 * SweetBook 폰트명을 CSS font-family 스택으로 변환.
 *
 * SweetBook은 자체 폰트명을 사용 (예: "NanumMyeongjo" 공백 없음, "배달의민족 도현" 한글).
 * Google Fonts는 공백 있는 영문명을 쓴다 (예: "Nanum Myeongjo", "Do Hyeon").
 *
 * 알 수 없는 폰트는 카테고리(serif/sans-serif)로 fallback.
 *
 * @example
 * getFontFamilyStack("NanumMyeongjo")  // → "'Nanum Myeongjo', serif"
 * getFontFamilyStack("배달의민족 도현") // → "'Do Hyeon', sans-serif"
 */

interface FontMapping {
  /** CSS font-family에 사용할 (Google Fonts) 패밀리명 */
  cssFamily: string;
  /** fallback 카테고리 */
  fallback: "serif" | "sans-serif";
}

const FONT_MAP: Record<string, FontMapping> = {
  // 일기장A 테마 — Google Fonts 그대로
  "DM Serif Display": { cssFamily: "DM Serif Display", fallback: "serif" },
  "Roboto": { cssFamily: "Roboto", fallback: "sans-serif" },
  "Oswald": { cssFamily: "Oswald", fallback: "sans-serif" },

  // SweetBook 변형 — 매핑 필요
  "NanumMyeongjo": { cssFamily: "Nanum Myeongjo", fallback: "serif" },
  "Nanum Myeongjo": { cssFamily: "Nanum Myeongjo", fallback: "serif" },
  "나눔명조": { cssFamily: "Nanum Myeongjo", fallback: "serif" },

  "NanumGothic": { cssFamily: "Nanum Gothic", fallback: "sans-serif" },
  "Nanum Gothic": { cssFamily: "Nanum Gothic", fallback: "sans-serif" },
  "나눔고딕": { cssFamily: "Nanum Gothic", fallback: "sans-serif" },

  "배달의민족 도현": { cssFamily: "Do Hyeon", fallback: "sans-serif" },
  "Do Hyeon": { cssFamily: "Do Hyeon", fallback: "sans-serif" },

  // 시스템 폰트
  "Impact": { cssFamily: "Impact", fallback: "sans-serif" },
};

export function getFontFamilyStack(swFontFamily: string): string {
  const mapping = FONT_MAP[swFontFamily];
  if (!mapping) {
    // 알 수 없는 폰트는 sans-serif로 fallback
    return "sans-serif";
  }
  return `'${mapping.cssFamily}', ${mapping.fallback}`;
}
