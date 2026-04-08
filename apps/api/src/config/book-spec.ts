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

/**
 * 페이지 타입 — PRD 24페이지 구성표 기반 12종
 */
export type PageType =
  | "certificate"
  | "bio"
  | "tech-stack"
  | "project-summary"
  | "project-detail"
  | "retrospective"
  | "mentor-comment"
  | "photo-gallery"
  | "cohort-intro"
  | "thanks"
  | "portfolio-links"
  | "blank";

/**
 * 페이지 ID에서 PageType과 인덱스를 파싱한다.
 * 예: "project-summary:0" → { type: "project-summary", index: 0 }
 */
export interface ParsedPageId {
  type: PageType;
  index: number;
}

const VALID_PAGE_TYPES = new Set<string>([
  "certificate", "bio", "tech-stack", "project-summary", "project-detail",
  "retrospective", "mentor-comment", "photo-gallery", "cohort-intro",
  "thanks", "portfolio-links", "blank",
]);

export function parsePageId(pageId: string): ParsedPageId {
  const colonIdx = pageId.lastIndexOf(":");
  if (colonIdx === -1) {
    return { type: "blank", index: 0 };
  }
  const typePart = pageId.slice(0, colonIdx);
  const indexPart = Number(pageId.slice(colonIdx + 1));

  if (!VALID_PAGE_TYPES.has(typePart) || Number.isNaN(indexPart)) {
    return { type: "blank", index: 0 };
  }

  return { type: typePart as PageType, index: indexPart };
}

/**
 * 개인 북 기본 페이지 구성표 (PRD 섹션 5)
 * 프로젝트 수에 따라 동적으로 확장된다.
 */
export const DEFAULT_INDIVIDUAL_PAGES: string[] = [
  "certificate:0",
  "bio:0",
  "tech-stack:0",
  "project-summary:0",
  "project-detail:0",
  "project-summary:1",
  "project-detail:1",
  "retrospective:0",
  "mentor-comment:0",
  "photo-gallery:0",
  "cohort-intro:0",
  "thanks:0",
  "portfolio-links:0",
];

/**
 * 기수 쇼케이스 북 기본 페이지 구성표 (PRD 섹션 6)
 * 수료생 수에 따라 동적으로 확장된다.
 */
export const DEFAULT_COHORT_PAGES: string[] = [
  "cohort-intro:0",
  "cohort-intro:1",
  "cohort-intro:2",
  "mentor-comment:0",
  "photo-gallery:0",
  "thanks:0",
];
