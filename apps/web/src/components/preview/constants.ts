/**
 * 책 프리뷰 렌더러 상수
 *
 * SweetBook 템플릿 좌표 단위는 추정 pt. 실제 인쇄 dpi와 무관하게
 * 좌표/크기의 비율만 유지하면 되므로, 단위는 의미가 없고 비율만 중요.
 */

/** 단일 내지 페이지 너비 (SweetBook 템플릿 좌표 단위) */
export const PAGE_WIDTH = 864;

/** 단일 내지 페이지 높이 */
export const PAGE_HEIGHT = 1212;

/** 표지 스프레드 너비 (뒷표지 + 책등 + 앞표지) */
export const COVER_SPREAD_WIDTH = 1716;

/**
 * Graphic 요소 fallback 색상 — #85 검증에서 외부 이미지 접근 불가 확인.
 * 일기장A 테마(토프 계열)와 조화되는 색상.
 */
export const GRAPHIC_FALLBACK_COLOR = "#8B7D6B";
