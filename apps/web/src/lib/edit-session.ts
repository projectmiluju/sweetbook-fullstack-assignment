import type { BookTypeId } from "@/lib/book-types";

// ────────────────────────────────────────────────
// 블록 타입 상수 — 백엔드 PageType과 동일한 12종
// ────────────────────────────────────────────────

export const PAGE_BLOCK_TYPES = [
  "certificate",
  "bio",
  "tech-stack",
  "project-summary",
  "project-detail",
  "retrospective",
  "mentor-comment",
  "photo-gallery",
  "cohort-intro",
  "thanks",
  "portfolio-links",
  "blank",
] as const;

export type PageBlockType = (typeof PAGE_BLOCK_TYPES)[number];

export const PAGE_TYPE_LABELS: Record<PageBlockType, string> = {
  "certificate": "기념 수료",
  "bio": "수료생 소개",
  "tech-stack": "기술 스택",
  "project-summary": "프로젝트 요약",
  "project-detail": "프로젝트 상세",
  "retrospective": "회고",
  "mentor-comment": "멘토 코멘트",
  "photo-gallery": "활동 사진",
  "cohort-intro": "부트캠프 소개",
  "thanks": "감사 메시지",
  "portfolio-links": "포트폴리오 링크",
  "blank": "빈 페이지",
};

// ────────────────────────────────────────────────
// 세션 타입
// ────────────────────────────────────────────────

export interface CustomText {
  coverTitle: string;
  graduationMessage: string;
  cohortIntro?: string;
  staffMessage?: string;
}

export interface EditSession {
  bookType: BookTypeId;
  customText: CustomText;
  hiddenBlocks: string[];
  pages: string[];
}

// ────────────────────────────────────────────────
// 블록 ID 빌더
// ────────────────────────────────────────────────

export function buildBlockId(type: PageBlockType, index: number): string {
  return `${type}:${index}`;
}

/** @deprecated buildBlockId("project-summary", index) 또는 buildBlockId("project-detail", index) 사용 */
export function buildProjectBlockId(index: number): string {
  return `project:${index}`;
}

/** @deprecated buildBlockId("photo-gallery", index) 사용 */
export function buildPhotoBlockId(index: number): string {
  return `photo:${index}`;
}

/**
 * 블록 ID에서 타입 부분을 추출한다.
 * "project-summary:0" → "project-summary"
 * "project:0" (레거시) → "project"
 */
export function getBlockType(blockId: string): string {
  const colonIdx = blockId.lastIndexOf(":");
  if (colonIdx === -1) return blockId;
  return blockId.slice(0, colonIdx);
}

/**
 * 블록 ID에서 인덱스를 추출한다.
 * "project-summary:0" → 0
 */
export function getBlockIndex(blockId: string): number {
  const colonIdx = blockId.lastIndexOf(":");
  if (colonIdx === -1) return 0;
  const num = Number(blockId.slice(colonIdx + 1));
  return Number.isNaN(num) ? 0 : num;
}

/**
 * 블록 ID에 대한 한글 라벨을 반환한다.
 * "project-summary:0" → "프로젝트 요약 1"
 * "project:0" (레거시) → "프로젝트 1"
 */
export function getPageLabel(
  blockId: string,
  projectTitles?: string[]
): string {
  const type = getBlockType(blockId);
  const index = getBlockIndex(blockId);

  // 레거시 블록 ID 호환
  if (type === "project") {
    return projectTitles?.[index] ?? `프로젝트 ${index + 1}`;
  }
  if (type === "photo") {
    return `사진 ${index + 1}`;
  }

  // 새 블록 타입
  const label = PAGE_TYPE_LABELS[type as PageBlockType];
  if (!label) return blockId;

  // 프로젝트 계열은 프로젝트 제목 사용
  if (type === "project-summary" || type === "project-detail") {
    const title = projectTitles?.[index];
    if (title) return `${label} — ${title}`;
    return `${label} ${index + 1}`;
  }

  // 인덱스가 0이면 번호 생략, 1 이상이면 번호 표시
  if (index > 0) return `${label} ${index + 1}`;
  return label;
}

// ────────────────────────────────────────────────
// 세션 생성
// ────────────────────────────────────────────────

export function createDefaultEditSession(bookType: BookTypeId, subjectName: string): EditSession {
  return {
    bookType,
    customText: {
      coverTitle: subjectName,
      graduationMessage: `${subjectName}의 수료를 진심으로 축하합니다.`
    },
    hiddenBlocks: [],
    pages: []
  };
}

// ────────────────────────────────────────────────
// 블록 가시성
// ────────────────────────────────────────────────

export function isBlockHidden(hiddenBlocks: string[], blockId: string): boolean {
  return hiddenBlocks.includes(blockId);
}

export function toggleHiddenBlock(hiddenBlocks: string[], blockId: string): string[] {
  if (hiddenBlocks.includes(blockId)) {
    return hiddenBlocks.filter((id) => id !== blockId);
  }
  return [...hiddenBlocks, blockId];
}

// ────────────────────────────────────────────────
// 기본 페이지 구성
// ────────────────────────────────────────────────

interface BuildDefaultPagesOptions {
  projectCount: number;
  photoCount: number;
  bookType: BookTypeId;
}

/**
 * PRD 24페이지 구성표 기반 기본 페이지 목록을 생성한다.
 *
 * individual (PRD 섹션 5):
 *   certificate → bio → tech-stack → (project-summary + project-detail) × N
 *   → retrospective → mentor-comment → photo-gallery → cohort-intro
 *   → thanks → portfolio-links
 *
 * cohort-showcase (PRD 섹션 6):
 *   cohort-intro:0 → cohort-intro:1 → cohort-intro:2
 *   → mentor-comment → photo-gallery → thanks
 */
export function buildDefaultPages(options: BuildDefaultPagesOptions): string[];
/** @deprecated options 객체를 사용하세요 */
export function buildDefaultPages(projectCount: number, photoCount: number): string[];
export function buildDefaultPages(
  optionsOrProjectCount: BuildDefaultPagesOptions | number,
  photoCount?: number
): string[] {
  // 레거시 시그니처 호환
  if (typeof optionsOrProjectCount === "number") {
    return buildDefaultPagesLegacy(optionsOrProjectCount, photoCount ?? 0);
  }

  const { projectCount, photoCount: photos, bookType } = optionsOrProjectCount;

  if (bookType === "cohort-showcase") {
    return buildCohortShowcasePages(photos);
  }

  return buildIndividualPages(projectCount, photos);
}

function buildDefaultPagesLegacy(projectCount: number, photoCount: number): string[] {
  const pages: string[] = [];
  for (let i = 0; i < projectCount; i++) {
    pages.push(buildProjectBlockId(i));
  }
  for (let i = 0; i < photoCount; i++) {
    pages.push(buildPhotoBlockId(i));
  }
  return pages;
}

function buildIndividualPages(projectCount: number, photoCount: number): string[] {
  const pages: string[] = [
    buildBlockId("certificate", 0),
    buildBlockId("bio", 0),
    buildBlockId("tech-stack", 0),
  ];

  for (let i = 0; i < projectCount; i++) {
    pages.push(buildBlockId("project-summary", i));
    pages.push(buildBlockId("project-detail", i));
  }

  pages.push(buildBlockId("retrospective", 0));
  pages.push(buildBlockId("mentor-comment", 0));

  if (photoCount > 0) {
    pages.push(buildBlockId("photo-gallery", 0));
  }

  pages.push(buildBlockId("cohort-intro", 0));
  pages.push(buildBlockId("thanks", 0));
  pages.push(buildBlockId("portfolio-links", 0));

  return pages;
}

function buildCohortShowcasePages(photoCount: number): string[] {
  const pages: string[] = [
    buildBlockId("cohort-intro", 0),
    buildBlockId("cohort-intro", 1),
    buildBlockId("cohort-intro", 2),
    buildBlockId("mentor-comment", 0),
  ];

  if (photoCount > 0) {
    pages.push(buildBlockId("photo-gallery", 0));
  }

  pages.push(buildBlockId("thanks", 0));

  return pages;
}

// ────────────────────────────────────────────────
// 페이지 순서 변경
// ────────────────────────────────────────────────

export function movePage(pages: string[], index: number, direction: "up" | "down"): string[] {
  if (direction === "up" && index === 0) return pages;
  if (direction === "down" && index === pages.length - 1) return pages;

  const newPages = [...pages];
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  [newPages[index], newPages[swapIndex]] = [newPages[swapIndex], newPages[index]];
  return newPages;
}
