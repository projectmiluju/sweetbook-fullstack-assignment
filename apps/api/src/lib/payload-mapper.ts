import type { Cohort, StudentPortfolio } from "../data/cohorts.js";
import { getEnv } from "../config/env.js";
import { adjustPageCount } from "./page-adjuster.js";
import { PHOTOBOOK_A4_SC } from "../config/book-spec.js";

export interface CustomTextInput {
  coverTitle: string;
  graduationMessage: string;
  cohortIntro?: string;
  staffMessage?: string;
}

export interface EditSessionInput {
  bookType: "individual" | "cohort-showcase";
  customText: CustomTextInput;
  hiddenBlocks: string[];
  pages: string[];
}

export interface CoverPayload {
  templateUid: string;
  parameters: Record<string, string>;
}

export interface ContentPagePayload {
  templateUid: string;
  parameters: Record<string, string>;
}


const COVER_PHOTO_FALLBACK = "https://picsum.photos/seed/sweetbook-cover/800/1200";

/**
 * 표지 payload를 생성한다. (구글포토북 계열 템플릿 기준)
 *
 *   coverPhoto → 수료생 대표 사진 URL
 *   subtitle   → 수료생 이름 (개인 북) 또는 기수명 (기수 북)
 *   dateRange  → 수료일
 */
export function buildCoverPayload(
  session: EditSessionInput,
  cohort: Cohort,
  student?: StudentPortfolio
): CoverPayload {
  const isIndividual = session.bookType === "individual";

  const subtitle = isIndividual
    ? (student?.name ?? cohort.name)
    : cohort.name;

  const coverPhoto = isIndividual
    ? (student?.photos?.[0] ?? COVER_PHOTO_FALLBACK)
    : (cohort.students[0]?.photos?.[0] ?? COVER_PHOTO_FALLBACK);

  return {
    templateUid: getEnv().COVER_TEMPLATE_UID,
    parameters: {
      coverPhoto,
      subtitle,
      dateRange: cohort.graduationDate,
    },
  };
}

/**
 * 내지 payload 배열을 생성한다.
 *
 * 커버 템플릿(구글포토북 계열)이 pageCount에 -COVER_PAGE_OFFSET을 기여하므로
 * 최종화 기준 MIN_PAGES를 맞추려면 내지를 MIN_PAGES + COVER_PAGE_OFFSET개 이상 보내야 함.
 *
 * 1. hiddenBlocks에 포함된 pageId 제외
 * 2. pages 순서 반영
 * 3. 부족분을 내지b 빈 페이지로 보강 (목표: MIN_PAGES + COVER_PAGE_OFFSET)
 */
export function buildContentsPayload(
  session: EditSessionInput,
  cohort: Cohort,
  student?: StudentPortfolio
): ContentPagePayload[] {
  const visiblePageIds = session.pages.filter(
    (pageId) => !session.hiddenBlocks.includes(pageId)
  );

  const monthNum = cohort.graduationDate.slice(5, 7);
  const dayNum = cohort.graduationDate.slice(8, 10);

  const baseParams: Record<string, string> = {
    monthNum,
    dayNum,
    diaryText: student?.name ?? cohort.name,
  };

  const contentTemplateUid = getEnv().CONTENT_TEMPLATE_UID;

  const contentPayloads: ContentPagePayload[] = visiblePageIds.map(() => ({
    templateUid: contentTemplateUid,
    parameters: baseParams,
  }));

  // 커버 오프셋을 보정한 실제 목표 페이지 수
  const targetMin = PHOTOBOOK_A4_SC.MIN_PAGES + PHOTOBOOK_A4_SC.COVER_PAGE_OFFSET;
  const adjustedTotal = adjustPageCount(contentPayloads.length, targetMin);
  const blankPagesNeeded = adjustedTotal - contentPayloads.length;

  for (let i = 0; i < blankPagesNeeded; i++) {
    contentPayloads.push({
      templateUid: contentTemplateUid,
      parameters: baseParams,
    });
  }

  return contentPayloads;
}
