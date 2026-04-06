import { PHOTOBOOK_A4_SC } from "../config/book-spec.js";

/**
 * 콘텐츠 페이지 수를 PHOTOBOOK_A4_SC 판형 규칙에 맞게 보정한다.
 *
 * 규칙:
 * - 최소 24페이지
 * - 최대 130페이지 (초과 시 에러)
 * - 2페이지 단위 (홀수면 +1로 올림)
 */
export function adjustPageCount(count: number): number {
  if (count > PHOTOBOOK_A4_SC.MAX_PAGES) {
    throw new Error(
      `페이지 수(${count})가 최대 허용 페이지(${PHOTOBOOK_A4_SC.MAX_PAGES})를 초과합니다.`
    );
  }

  const adjusted = Math.max(count, PHOTOBOOK_A4_SC.MIN_PAGES);

  if (adjusted % PHOTOBOOK_A4_SC.PAGE_STEP === 0) {
    return adjusted;
  }

  return adjusted + 1;
}
