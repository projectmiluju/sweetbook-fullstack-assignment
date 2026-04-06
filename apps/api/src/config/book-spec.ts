/**
 * PHOTOBOOK_A4_SC 판형 규칙 상수
 * 출처: SweetBook BookSpecs API (Sandbox 검증 완료)
 */
export const PHOTOBOOK_A4_SC = {
  MIN_PAGES: 24,
  MAX_PAGES: 130,
  PAGE_STEP: 2
} as const;

/**
 * Books API 오케스트레이션에 사용할 식별자
 * 실제 값은 .env에서 주입 (BOOK_SPEC_UID, COVER_TEMPLATE_UID, CONTENTS_TEMPLATE_UID)
 */
export const BOOK_SPEC_UID = process.env.BOOK_SPEC_UID ?? "";
export const COVER_TEMPLATE_UID = process.env.COVER_TEMPLATE_UID ?? "";
export const CONTENTS_TEMPLATE_UID = process.env.CONTENTS_TEMPLATE_UID ?? "";
