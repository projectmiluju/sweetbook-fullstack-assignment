import { describe, expect, it } from "vitest";

import type { EditSessionInput } from "../lib/payload-mapper.js";
import { buildCoverPayload, buildContentsPayload } from "../lib/payload-mapper.js";
import { COVER_TEMPLATE_UID, CONTENTS_TEMPLATE_UID } from "../config/book-spec.js";
import type { Cohort, StudentPortfolio } from "../data/cohorts.js";

// 테스트용 픽스처

const mockCohort: Cohort = {
  id: "cohort-test",
  name: "웹 풀스택 5기",
  program: "SweetBootcamp Web Fullstack",
  graduationDate: "2026-04-30",
  summary: "테스트 기수",
  tagline: "테스트",
  students: [],
};

const mockStudent: StudentPortfolio = {
  id: "student-001",
  name: "김코드",
  roleTrack: "풀스택",
  bio: "자기소개",
  techStack: ["TypeScript", "Next.js"],
  projects: [
    {
      title: "StudyFlow",
      summary: "스터디 운영 자동화",
      contribution: "백엔드 API 설계",
      links: [],
    },
    {
      title: "DemoBoard",
      summary: "발표 자료 관리",
      contribution: "프론트엔드 구현",
      links: [],
    },
  ],
  retrospective: "회고 내용",
  mentorComment: "멘토 코멘트",
  photos: [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg",
  ],
  certificateMessage: "축하합니다.",
};

function makeSession(
  overrides: Partial<EditSessionInput> = {}
): EditSessionInput {
  return {
    bookType: "individual",
    customText: {
      coverTitle: "김코드의 수료 포트폴리오 북",
      graduationMessage: "김코드의 수료를 진심으로 축하합니다.",
    },
    hiddenBlocks: [],
    pages: [],
    ...overrides,
  };
}

// ────────────────────────────────────────────────
// buildCoverPayload
// ────────────────────────────────────────────────

describe("buildCoverPayload", () => {
  describe("individual 표지", () => {
    it("반환 templateUid가 COVER_TEMPLATE_UID여야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.templateUid).toBe(COVER_TEMPLATE_UID);
    });

    it("customText.coverTitle이 parameters.title에 반영되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.title).toBe("김코드의 수료 포트폴리오 북");
    });

    it("coverTitle이 비어 있으면 student.name을 title로 사용해야 한다", () => {
      const session = makeSession({ customText: { coverTitle: "", graduationMessage: "" } });
      const payload = buildCoverPayload(session, mockCohort, mockStudent);
      expect(payload.parameters.title).toBe("김코드");
    });

    it("subtitle에 cohort.program과 cohort.name이 포함되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.subtitle).toContain("SweetBootcamp Web Fullstack");
      expect(payload.parameters.subtitle).toContain("웹 풀스택 5기");
    });

    it("periodText에 cohort.graduationDate가 설정되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.periodText).toBe("2026-04-30");
    });

    it("subjectName에 student.name이 설정되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.subjectName).toBe("김코드");
    });

    it("cohortIntro는 individual 표지에 포함되지 않아야 한다", () => {
      const session = makeSession({
        customText: { coverTitle: "제목", graduationMessage: "", cohortIntro: "기수 소개" },
      });
      const payload = buildCoverPayload(session, mockCohort, mockStudent);
      expect(payload.parameters.cohortIntro).toBeUndefined();
    });
  });

  describe("cohort-showcase 표지", () => {
    it("cohortIntro가 있으면 parameters에 포함되어야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        customText: {
          coverTitle: "5기 쇼케이스",
          graduationMessage: "",
          cohortIntro: "우리는 5기입니다.",
        },
      });
      const payload = buildCoverPayload(session, mockCohort);
      expect(payload.parameters.cohortIntro).toBe("우리는 5기입니다.");
    });

    it("subjectName이 포함되지 않아야 한다", () => {
      const session = makeSession({ bookType: "cohort-showcase" });
      const payload = buildCoverPayload(session, mockCohort);
      expect(payload.parameters.subjectName).toBeUndefined();
    });

    it("coverTitle이 비어 있으면 cohort.name을 title로 사용해야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        customText: { coverTitle: "", graduationMessage: "" },
      });
      const payload = buildCoverPayload(session, mockCohort);
      expect(payload.parameters.title).toBe("웹 풀스택 5기");
    });
  });
});

// ────────────────────────────────────────────────
// buildContentsPayload
// ────────────────────────────────────────────────

describe("buildContentsPayload", () => {
  describe("templateUid", () => {
    it("모든 내지 payload의 templateUid가 CONTENTS_TEMPLATE_UID여야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.every((p) => p.templateUid === CONTENTS_TEMPLATE_UID)).toBe(true);
    });
  });

  describe("빈 페이지 자동 보강", () => {
    it("pages가 0개이면 총 24페이지를 맞추기 위해 23개 내지가 생성되어야 한다", () => {
      const session = makeSession({ pages: [] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(23); // 총 24 = 1(표지) + 23(내지)
    });

    it("pages가 1개이면 보정 후 최소 23개 이상의 내지가 생성되어야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length).toBeGreaterThanOrEqual(23);
    });

    it("최종 내지 수 + 1(표지)의 합계가 짝수여야 한다", () => {
      const session = makeSession({ pages: ["project:0", "photo:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect((payloads.length + 1) % 2).toBe(0);
    });

    it("최종 내지 수 + 1(표지)의 합계가 항상 24 이상이어야 한다", () => {
      const session = makeSession({ pages: ["project:0", "photo:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length + 1).toBeGreaterThanOrEqual(24);
    });

    it("모든 pages가 hiddenBlocks에 포함되면 빈 페이지 23개만 생성되어야 한다", () => {
      const session = makeSession({
        pages: ["project:0", "photo:0"],
        hiddenBlocks: ["project:0", "photo:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(23);
      expect(payloads.every((p) => Object.keys(p.parameters).length === 0)).toBe(true);
    });
  });

  describe("hiddenBlocks 필터링", () => {
    it("hiddenBlocks에 포함된 pageId는 내지에서 제외되어야 한다", () => {
      const session = makeSession({
        pages: ["project:0", "project:1", "photo:0"],
        hiddenBlocks: ["project:1"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const hasProject1 = payloads.some(
        (p) => p.parameters.projectTitle === "DemoBoard"
      );
      expect(hasProject1).toBe(false);
    });

    it("hiddenBlocks에 없는 pageId는 포함되어야 한다", () => {
      const session = makeSession({
        pages: ["project:0", "project:1"],
        hiddenBlocks: ["project:1"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const hasProject0 = payloads.some(
        (p) => p.parameters.projectTitle === "StudyFlow"
      );
      expect(hasProject0).toBe(true);
    });
  });

  describe("pages 순서 반영", () => {
    it("pages 배열 순서대로 내지가 생성되어야 한다", () => {
      const session = makeSession({
        pages: ["project:1", "project:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      // 첫 번째 콘텐츠 페이지는 project:1 (DemoBoard)
      expect(payloads[0].parameters.projectTitle).toBe("DemoBoard");
      // 두 번째 콘텐츠 페이지는 project:0 (StudyFlow)
      expect(payloads[1].parameters.projectTitle).toBe("StudyFlow");
    });
  });

  describe("pageId → parameters 매핑", () => {
    it("project: 페이지는 projectTitle·projectSummary·projectContribution을 포함해야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.projectTitle).toBe("StudyFlow");
      expect(payloads[0].parameters.projectSummary).toBe("스터디 운영 자동화");
      expect(payloads[0].parameters.projectContribution).toBe("백엔드 API 설계");
    });

    it("photo:0은 photos[0] URL을 반환해야 한다", () => {
      const session = makeSession({ pages: ["photo:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.photoUrl).toBe("https://example.com/photo1.jpg");
    });

    it("photo:1은 photos[1] URL을 반환해야 한다", () => {
      const session = makeSession({ pages: ["photo:1"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.photoUrl).toBe("https://example.com/photo2.jpg");
    });

    it("photo: 범위 초과 인덱스는 빈 photoUrl을 반환해야 한다", () => {
      const session = makeSession({ pages: ["photo:99"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.photoUrl).toBe("");
    });

    it("존재하지 않는 project 인덱스는 빈 parameters를 반환해야 한다", () => {
      const session = makeSession({ pages: ["project:99"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters).toEqual({});
    });

    it("cohort-showcase에서 student 없이 photo: 페이지 처리 시 cohort 전체 사진을 사용해야 한다", () => {
      const cohortWithPhotos: Cohort = {
        ...mockCohort,
        students: [
          { ...mockStudent, photos: ["https://example.com/cohort1.jpg"] },
          { ...mockStudent, id: "student-002", photos: ["https://example.com/cohort2.jpg"] },
        ],
      };
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["photo:1"],
      });
      const payloads = buildContentsPayload(session, cohortWithPhotos);
      expect(payloads[0].parameters.photoUrl).toBe("https://example.com/cohort2.jpg");
    });
  });
});
