/**
 * PHOTOBOOK_A4_SC 판형 규칙 상수
 * 출처: SweetBook BookSpecs API (Sandbox 검증 완료)
 */
export const PHOTOBOOK_A4_SC = {
  MIN_PAGES: 24,
  MAX_PAGES: 130,
  PAGE_STEP: 2,
  /**
   * 커버 템플릿(구글포토북 계열)이 pageCount에 -2를 기여하므로
   * 최종화 기준 MIN_PAGES를 맞추려면 내지를 2장 더 보내야 함.
   */
  COVER_PAGE_OFFSET: 2,
} as const;

/**
 * Books API 오케스트레이션에 사용할 식별자는
 * config/env.ts에서 zod로 검증 후 getEnv()를 통해 접근합니다.
 */
