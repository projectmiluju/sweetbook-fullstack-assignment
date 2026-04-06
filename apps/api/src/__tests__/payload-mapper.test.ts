import { describe, expect, it } from "vitest";

import type { EditSessionInput } from "../lib/payload-mapper.js";
import { buildCoverPayload, buildContentsPayload } from "../lib/payload-mapper.js";
import { COVER_TEMPLATE_UID } from "../config/book-spec.js";
const BLANK_TEMPLATE_UID = process.env.BLANK_TEMPLATE_UID ?? "";
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

    it("subtitle에 student.name이 설정되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.subtitle).toBe("김코드");
    });

    it("dateRange에 cohort.graduationDate가 설정되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.dateRange).toBe("2026-04-30");
    });

    it("coverPhoto에 student.photos[0] URL이 설정되어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.parameters.coverPhoto).toBe("https://example.com/photo1.jpg");
    });

    it("student.photos가 비어 있으면 coverPhoto가 폴백 URL이어야 한다", () => {
      const studentNoPhoto = { ...mockStudent, photos: [] };
      const payload = buildCoverPayload(makeSession(), mockCohort, studentNoPhoto);
      expect(payload.parameters.coverPhoto).toContain("picsum.photos");
    });

    it("student가 없으면 subtitle이 cohort.name이어야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort);
      expect(payload.parameters.subtitle).toBe("웹 풀스택 5기");
    });
  });

  describe("cohort-showcase 표지", () => {
    it("subtitle에 cohort.name이 설정되어야 한다", () => {
      const session = makeSession({ bookType: "cohort-showcase" });
      const payload = buildCoverPayload(session, mockCohort);
      expect(payload.parameters.subtitle).toBe("웹 풀스택 5기");
    });

    it("coverPhoto에 첫 번째 수료생의 photos[0]이 설정되어야 한다", () => {
      const cohortWithStudents: Cohort = { ...mockCohort, students: [mockStudent] };
      const session = makeSession({ bookType: "cohort-showcase" });
      const payload = buildCoverPayload(session, cohortWithStudents);
      expect(payload.parameters.coverPhoto).toBe("https://example.com/photo1.jpg");
    });

    it("수료생이 없으면 coverPhoto가 폴백 URL이어야 한다", () => {
      const session = makeSession({ bookType: "cohort-showcase" });
      const payload = buildCoverPayload(session, mockCohort);
      expect(payload.parameters.coverPhoto).toContain("picsum.photos");
    });
  });
});

// ────────────────────────────────────────────────
// buildContentsPayload
// ────────────────────────────────────────────────

describe("buildContentsPayload", () => {
  describe("templateUid", () => {
    it("모든 내지 payload의 templateUid가 BLANK_TEMPLATE_UID여야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.every((p) => p.templateUid === BLANK_TEMPLATE_UID)).toBe(true);
    });
  });

  describe("내지 기본 파라미터", () => {
    it("diaryText에 student.name이 설정되어야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toBe("김코드");
    });

    it("student가 없으면 diaryText에 cohort.name이 설정되어야 한다", () => {
      const session = makeSession({ bookType: "cohort-showcase", pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort);
      expect(payloads[0].parameters.diaryText).toBe("웹 풀스택 5기");
    });

    it("monthNum에 cohort.graduationDate의 월(2자리)이 설정되어야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.monthNum).toBe("04");
    });

    it("dayNum에 cohort.graduationDate의 일(2자리)이 설정되어야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.dayNum).toBe("30");
    });
  });

  describe("빈 페이지 자동 보강", () => {
    it("pages가 0개이면 최소 내지 26개가 생성되어야 한다 (MIN_PAGES 24 + COVER_OFFSET 2)", () => {
      const session = makeSession({ pages: [] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(26);
    });

    it("pages가 1개이면 보정 후 최소 26개 이상의 내지가 생성되어야 한다", () => {
      const session = makeSession({ pages: ["project:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length).toBeGreaterThanOrEqual(26);
    });

    it("최종 내지 수가 짝수여야 한다", () => {
      const session = makeSession({ pages: ["project:0", "photo:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length % 2).toBe(0);
    });

    it("최종 내지 수가 항상 26 이상이어야 한다", () => {
      const session = makeSession({ pages: ["project:0", "photo:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length).toBeGreaterThanOrEqual(26);
    });
  });

  describe("hiddenBlocks 필터링", () => {
    it("hiddenBlocks에 포함된 pageId는 내지 수에서 제외되어야 한다", () => {
      const sessionAll = makeSession({ pages: ["project:0", "project:1"] });
      const sessionHidden = makeSession({
        pages: ["project:0", "project:1"],
        hiddenBlocks: ["project:1"],
      });
      const payloadsAll = buildContentsPayload(sessionAll, mockCohort, mockStudent);
      const payloadsHidden = buildContentsPayload(sessionHidden, mockCohort, mockStudent);
      // hiddenBlocks로 1개 제외 → 보강 전 visiblePages가 1개 차이나므로 보정 후도 달라질 수 있음
      // 적어도 hiddenBlocks 없는 경우와 같거나 적어야 한다
      expect(payloadsHidden.length).toBeLessThanOrEqual(payloadsAll.length);
    });

    it("모든 pages가 hiddenBlocks에 포함되면 visiblePages가 0개로 빈 내지만 생성되어야 한다", () => {
      const session = makeSession({
        pages: ["project:0", "photo:0"],
        hiddenBlocks: ["project:0", "photo:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      // visiblePages = 0 → 내지 최소 26개 (24 + cover offset 2)
      expect(payloads).toHaveLength(26);
    });
  });
});
