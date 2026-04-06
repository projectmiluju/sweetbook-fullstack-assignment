import type { Cohort, StudentPortfolio } from "../data/cohorts.js";
import { COVER_TEMPLATE_UID, CONTENTS_TEMPLATE_UID } from "../config/book-spec.js";
import { adjustPageCount } from "./page-adjuster.js";

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

function buildPageParameters(
  pageId: string,
  student: StudentPortfolio | undefined,
  cohort: Cohort
): Record<string, string> {
  if (pageId.startsWith("project:")) {
    const index = parseInt(pageId.split(":")[1], 10);
    const project = student?.projects[index];
    if (!project) return {};
    return {
      projectTitle: project.title,
      projectSummary: project.summary,
      projectContribution: project.contribution,
    };
  }

  if (pageId.startsWith("photo:")) {
    const index = parseInt(pageId.split(":")[1], 10);
    const photos = student?.photos ?? cohort.students.flatMap((s) => s.photos);
    const photoUrl = photos[index] ?? "";
    return { photoUrl };
  }

  return {};
}

/**
 * 표지 payload를 생성한다.
 *
 * individual: student.name + cohort 정보 + customText.coverTitle
 * cohort-showcase: cohort 정보 + customText.coverTitle + cohortIntro
 */
export function buildCoverPayload(
  session: EditSessionInput,
  cohort: Cohort,
  student?: StudentPortfolio
): CoverPayload {
  const isIndividual = session.bookType === "individual";

  const title =
    session.customText.coverTitle ||
    (isIndividual ? (student?.name ?? cohort.name) : cohort.name);

  const subtitle = `${cohort.program} ${cohort.name}`;

  const parameters: Record<string, string> = {
    title,
    subtitle,
    periodText: cohort.graduationDate,
  };

  if (isIndividual && student) {
    parameters.subjectName = student.name;
  }

  if (!isIndividual && session.customText.cohortIntro) {
    parameters.cohortIntro = session.customText.cohortIntro;
  }

  return { templateUid: COVER_TEMPLATE_UID, parameters };
}

/**
 * 내지 payload 배열을 생성한다.
 *
 * 1. hiddenBlocks에 포함된 pageId 제외
 * 2. pages 순서 반영
 * 3. pageId → templateUid + parameters 변환
 * 4. adjustPageCount(1 + visiblePages.length)로 부족분을 빈 페이지로 보강
 *    (1은 표지 페이지)
 */
export function buildContentsPayload(
  session: EditSessionInput,
  cohort: Cohort,
  student?: StudentPortfolio
): ContentPagePayload[] {
  const visiblePageIds = session.pages.filter(
    (pageId) => !session.hiddenBlocks.includes(pageId)
  );

  const contentPayloads: ContentPagePayload[] = visiblePageIds.map((pageId) => ({
    templateUid: CONTENTS_TEMPLATE_UID,
    parameters: buildPageParameters(pageId, student, cohort),
  }));

  // 표지 1장 포함한 총 페이지 수로 보정
  const totalWithCover = 1 + contentPayloads.length;
  const adjustedTotal = adjustPageCount(totalWithCover);
  const blankPagesNeeded = adjustedTotal - totalWithCover;

  for (let i = 0; i < blankPagesNeeded; i++) {
    contentPayloads.push({
      templateUid: CONTENTS_TEMPLATE_UID,
      parameters: {},
    });
  }

  return contentPayloads;
}
