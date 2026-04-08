import type {
  Cohort,
  StudentPortfolio,
  RetrospectiveData,
} from "../data/cohorts.js";
import { getEnv } from "../config/env.js";
import { adjustPageCount } from "./page-adjuster.js";
import { PHOTOBOOK_A4_SC, parsePageId } from "../config/book-spec.js";
import type { PageType } from "../config/book-spec.js";

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

const COVER_PHOTO_FALLBACK =
  "https://picsum.photos/seed/sweetbook-cover/800/1200";
const PHOTO_FALLBACK = "https://picsum.photos/seed/sweetbook-project/800/1200";

// ────────────────────────────────────────────────
// 표지
// ────────────────────────────────────────────────

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

// ────────────────────────────────────────────────
// 내지 — 페이지 타입별 매핑
// ────────────────────────────────────────────────

interface PageMapperContext {
  cohort: Cohort;
  student?: StudentPortfolio;
  customText: CustomTextInput;
  monthNum: string;
  dayNum: string;
}

/** 내지b 공통 파라미터 (monthNum + dayNum + diaryText) */
function textPage(ctx: PageMapperContext, diaryText: string): ContentPagePayload {
  return {
    templateUid: getEnv().CONTENT_TEMPLATE_UID,
    parameters: { monthNum: ctx.monthNum, dayNum: ctx.dayNum, diaryText },
  };
}

/** 내지a 파라미터 (monthNum + dayNum + diaryText + photo) */
function textPhotoPage(
  ctx: PageMapperContext,
  diaryText: string,
  photo: string
): ContentPagePayload {
  return {
    templateUid: getEnv().CONTENT_A_TEMPLATE_UID,
    parameters: {
      monthNum: ctx.monthNum,
      dayNum: ctx.dayNum,
      diaryText,
      photo,
    },
  };
}

/** 내지_gallery 파라미터 (monthNum + dayNum + collagePhotos) */
function galleryPage(
  ctx: PageMapperContext,
  photos: string[]
): ContentPagePayload {
  return {
    templateUid: getEnv().GALLERY_TEMPLATE_UID,
    parameters: {
      monthNum: ctx.monthNum,
      dayNum: ctx.dayNum,
      collagePhotos: JSON.stringify(photos),
    },
  };
}

function blankPage(ctx: PageMapperContext): ContentPagePayload {
  return textPage(ctx, " ");
}

// ────────────────────────────────────────────────
// 페이지 타입별 매퍼
// ────────────────────────────────────────────────

function mapCertificatePage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;
  const name = s?.name ?? ctx.cohort.name;
  const program = ctx.cohort.program;
  const date = ctx.cohort.graduationDate;
  const message = s?.certificateMessage || "수료를 축하합니다.";

  return textPage(ctx, `${name}\n${program}\n수료일: ${date}\n\n${message}`);
}

function mapBioPage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;
  if (!s) return blankPage(ctx);

  const diaryText = `${s.name} · ${s.roleTrack}\n\n${s.bio}`;
  const photo = s.photos[0] ?? PHOTO_FALLBACK;

  return textPhotoPage(ctx, diaryText, photo);
}

function mapTechStackPage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;
  if (!s) return blankPage(ctx);

  const stackText = s.techStack.join(", ");
  return textPage(ctx, `기술 스택\n\n${stackText}`);
}

function mapProjectSummaryPage(
  ctx: PageMapperContext,
  projectIndex: number
): ContentPagePayload {
  const s = ctx.student;
  const project = s?.projects[projectIndex];
  if (!project) return blankPage(ctx);

  const diaryText = `${project.title}\n${project.summary}\n\n기여: ${project.contribution}`;
  const photo = PHOTO_FALLBACK;

  return textPhotoPage(ctx, diaryText, photo);
}

function mapProjectDetailPage(
  ctx: PageMapperContext,
  projectIndex: number
): ContentPagePayload {
  const s = ctx.student;
  const project = s?.projects[projectIndex];
  if (!project) return blankPage(ctx);

  const parts: string[] = [`${project.title} — 상세`];

  if (project.problem) {
    parts.push(`\n문제: ${project.problem}`);
  }
  if (project.solution) {
    parts.push(`해결: ${project.solution}`);
  }
  if (project.techChoices && project.techChoices.length > 0) {
    parts.push(`기술 선택: ${project.techChoices.join(", ")}`);
  }
  if (project.result) {
    parts.push(`결과: ${project.result}`);
  }

  parts.push(`\n기여: ${project.contribution}`);

  if (project.links.length > 0) {
    parts.push(`\n링크:\n${project.links.join("\n")}`);
  }

  return textPage(ctx, parts.join("\n"));
}

function formatRetrospective(retro: string | RetrospectiveData): string {
  if (typeof retro === "string") return retro;

  const sections: string[] = [];
  if (retro.before) sections.push(`시작 전: ${retro.before}`);
  if (retro.process) sections.push(`과정: ${retro.process}`);
  if (retro.turning) sections.push(`전환점: ${retro.turning}`);
  if (retro.difficulty) sections.push(`어려움: ${retro.difficulty}`);
  if (retro.overcome) sections.push(`극복: ${retro.overcome}`);
  if (retro.learned) sections.push(`배운 점: ${retro.learned}`);

  return sections.join("\n");
}

function mapRetrospectivePage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;
  if (!s) return blankPage(ctx);

  const retroText = formatRetrospective(s.retrospective);
  const fallback = "회고 내용이 없습니다.";

  return textPage(ctx, `회고\n\n${retroText || fallback}`);
}

function mapMentorCommentPage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;
  if (!s) {
    // 기수 쇼케이스: 모든 수료생 멘토 코멘트 모음
    const comments = ctx.cohort.students
      .filter((st) => st.mentorComment)
      .map((st) => `[${st.name}] ${st.mentorComment}`)
      .join("\n\n");
    return textPage(ctx, `멘토 코멘트\n\n${comments || "멘토 코멘트가 없습니다."}`);
  }

  const fallback = "멘토 코멘트가 없습니다.";
  return textPage(ctx, `멘토 코멘트\n\n${s.mentorComment || fallback}`);
}

function mapPhotoGalleryPage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;

  if (s) {
    if (s.photos.length > 0) {
      return galleryPage(ctx, s.photos);
    }
    return blankPage(ctx);
  }

  // 기수 쇼케이스: 전체 수료생 사진 취합
  const allPhotos = ctx.cohort.students.flatMap((st) => st.photos);
  if (allPhotos.length > 0) {
    return galleryPage(ctx, allPhotos);
  }
  return blankPage(ctx);
}

function mapCohortIntroPage(
  ctx: PageMapperContext,
  index: number
): ContentPagePayload {
  const c = ctx.cohort;

  if (index === 0) {
    return textPage(ctx, `${c.name}\n${c.program}\n\n${c.summary}`);
  }
  if (index === 1 && ctx.customText.staffMessage) {
    return textPage(ctx, ctx.customText.staffMessage);
  }
  if (index === 2 && ctx.customText.cohortIntro) {
    return textPage(ctx, ctx.customText.cohortIntro);
  }

  return blankPage(ctx);
}

function mapThanksPage(ctx: PageMapperContext): ContentPagePayload {
  const message =
    ctx.student?.thanksMessage ??
    ctx.customText.graduationMessage;

  return textPage(ctx, `감사합니다\n\n${message}`);
}

function mapPortfolioLinksPage(ctx: PageMapperContext): ContentPagePayload {
  const s = ctx.student;
  if (!s) return blankPage(ctx);

  const parts: string[] = ["포트폴리오"];

  if (s.portfolioLinks) {
    const pl = s.portfolioLinks;
    if (pl.github) parts.push(`GitHub: ${pl.github}`);
    if (pl.blog) parts.push(`Blog: ${pl.blog}`);
    if (pl.email) parts.push(`Email: ${pl.email}`);
    if (pl.demo) parts.push(`Demo: ${pl.demo}`);
  }

  // 프로젝트 링크 취합
  const projectLinks = s.projects
    .flatMap((p) => p.links.map((link) => `${p.title}: ${link}`));
  if (projectLinks.length > 0) {
    parts.push("", ...projectLinks);
  }

  if (parts.length === 1) {
    parts.push("\n포트폴리오 링크가 없습니다.");
  }

  return textPage(ctx, parts.join("\n"));
}

// ────────────────────────────────────────────────
// 페이지 타입 → 매퍼 디스패치
// ────────────────────────────────────────────────

function mapPage(
  pageType: PageType,
  index: number,
  ctx: PageMapperContext
): ContentPagePayload {
  switch (pageType) {
    case "certificate":
      return mapCertificatePage(ctx);
    case "bio":
      return mapBioPage(ctx);
    case "tech-stack":
      return mapTechStackPage(ctx);
    case "project-summary":
      return mapProjectSummaryPage(ctx, index);
    case "project-detail":
      return mapProjectDetailPage(ctx, index);
    case "retrospective":
      return mapRetrospectivePage(ctx);
    case "mentor-comment":
      return mapMentorCommentPage(ctx);
    case "photo-gallery":
      return mapPhotoGalleryPage(ctx);
    case "cohort-intro":
      return mapCohortIntroPage(ctx, index);
    case "thanks":
      return mapThanksPage(ctx);
    case "portfolio-links":
      return mapPortfolioLinksPage(ctx);
    case "blank":
      return blankPage(ctx);
  }
}

// ────────────────────────────────────────────────
// buildContentsPayload
// ────────────────────────────────────────────────

/**
 * 내지 payload 배열을 생성한다.
 *
 * 1. hiddenBlocks에 포함된 pageId 제외
 * 2. 각 pageId를 PageType으로 파싱하여 타입별 매퍼 호출
 * 3. 부족분을 빈 페이지로 보강 (목표: MIN_PAGES + COVER_PAGE_OFFSET)
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

  const ctx: PageMapperContext = {
    cohort,
    student,
    customText: session.customText,
    monthNum,
    dayNum,
  };

  const contentPayloads: ContentPagePayload[] = visiblePageIds.map((pageId) => {
    const { type, index } = parsePageId(pageId);
    return mapPage(type, index, ctx);
  });

  // 커버 오프셋을 보정한 실제 목표 페이지 수
  const targetMin =
    PHOTOBOOK_A4_SC.MIN_PAGES + PHOTOBOOK_A4_SC.COVER_PAGE_OFFSET;
  const adjustedTotal = adjustPageCount(contentPayloads.length, targetMin);
  const blankPagesNeeded = adjustedTotal - contentPayloads.length;

  for (let i = 0; i < blankPagesNeeded; i++) {
    contentPayloads.push(blankPage(ctx));
  }

  return contentPayloads;
}
