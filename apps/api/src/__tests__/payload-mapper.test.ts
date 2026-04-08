import { describe, expect, it, vi } from "vitest";

import type { Env } from "../config/env.js";

const TEST_ENV: Env = {
  PORT: 4000,
  SWEETBOOK_API_KEY: "test-key",
  SWEETBOOK_API_BASE_URL: "https://test.example.com",
  BOOK_SPEC_UID: "TEST_BOOK_SPEC",
  COVER_TEMPLATE_UID: "TEST_COVER",
  CONTENTS_TEMPLATE_UID: "TEST_CONTENTS",
  BLANK_TEMPLATE_UID: "TEST_BLANK",
  CONTENT_TEMPLATE_UID: "TEST_CONTENT_B",
  CONTENT_A_TEMPLATE_UID: "TEST_CONTENT_A",
  GALLERY_TEMPLATE_UID: "TEST_GALLERY",
};

vi.mock("../config/env.js", () => ({
  getEnv: () => TEST_ENV,
}));

import type { EditSessionInput } from "../lib/payload-mapper.js";
import {
  buildCoverPayload,
  buildContentsPayload,
} from "../lib/payload-mapper.js";
import type { Cohort, StudentPortfolio } from "../data/cohorts.js";

// ────────────────────────────────────────────────
// 픽스처
// ────────────────────────────────────────────────

const mockCohort: Cohort = {
  id: "cohort-test",
  name: "웹 풀스택 5기",
  program: "SweetBootcamp Web Fullstack",
  graduationDate: "2026-04-30",
  summary: "테스트 기수 요약",
  tagline: "테스트",
  students: [],
};

const mockStudent: StudentPortfolio = {
  id: "student-001",
  name: "김코드",
  roleTrack: "풀스택",
  bio: "자기소개 텍스트",
  techStack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL"],
  projects: [
    {
      title: "StudyFlow",
      summary: "스터디 운영 자동화",
      contribution: "백엔드 API 설계",
      links: ["https://github.com/example/studyflow"],
      problem: "스터디 일정 관리가 비효율적",
      solution: "자동화된 일정 관리 시스템 구축",
      techChoices: ["Express", "PostgreSQL"],
      result: "운영 시간 50% 감소",
    },
    {
      title: "DemoBoard",
      summary: "발표 자료 관리",
      contribution: "프론트엔드 구현",
      links: [],
    },
  ],
  retrospective: {
    before: "프로그래밍 경험 없었음",
    process: "매일 코딩",
    turning: "첫 PR 머지",
    difficulty: "비동기 처리 이해",
    overcome: "페어 프로그래밍",
    learned: "협업의 중요성",
  },
  mentorComment: "성실하게 잘 따라왔습니다.",
  photos: [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg",
  ],
  certificateMessage: "축하합니다! 훌륭한 성과를 거두셨습니다.",
  interests: ["DevOps", "클라우드"],
  achievements: "최우수 수료생",
  portfolioLinks: {
    github: "https://github.com/kimcode",
    blog: "https://kimcode.dev",
  },
  thanksMessage: "멘토님과 동기들에게 감사합니다.",
};

function makeSession(
  overrides: Partial<EditSessionInput> = {}
): EditSessionInput {
  return {
    bookType: "individual",
    customText: {
      coverTitle: "김코드의 수료 포트폴리오 북",
      graduationMessage: "김코드의 수료를 진심으로 축하합니다.",
      cohortIntro: "부트캠프 소개 상세",
      staffMessage: "운영진 메시지",
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
    it("templateUid가 COVER_TEMPLATE_UID여야 한다", () => {
      const payload = buildCoverPayload(makeSession(), mockCohort, mockStudent);
      expect(payload.templateUid).toBe(TEST_ENV.COVER_TEMPLATE_UID);
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
      expect(payload.parameters.coverPhoto).toBe(
        "https://example.com/photo1.jpg"
      );
    });

    it("student.photos가 비어 있으면 coverPhoto가 폴백 URL이어야 한다", () => {
      const studentNoPhoto = { ...mockStudent, photos: [] };
      const payload = buildCoverPayload(
        makeSession(),
        mockCohort,
        studentNoPhoto
      );
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
      const cohortWithStudents: Cohort = {
        ...mockCohort,
        students: [mockStudent],
      };
      const session = makeSession({ bookType: "cohort-showcase" });
      const payload = buildCoverPayload(session, cohortWithStudents);
      expect(payload.parameters.coverPhoto).toBe(
        "https://example.com/photo1.jpg"
      );
    });

    it("수료생이 없으면 coverPhoto가 폴백 URL이어야 한다", () => {
      const session = makeSession({ bookType: "cohort-showcase" });
      const payload = buildCoverPayload(session, mockCohort);
      expect(payload.parameters.coverPhoto).toContain("picsum.photos");
    });
  });
});

// ────────────────────────────────────────────────
// buildContentsPayload — 페이지 타입별 매핑
// ────────────────────────────────────────────────

describe("buildContentsPayload", () => {
  // ── certificate ──

  describe("certificate 페이지", () => {
    it("diaryText에 이름, 과정명, 수료일, 축하 문구가 포함되어야 한다", () => {
      const session = makeSession({ pages: ["certificate:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;

      expect(text).toContain("김코드");
      expect(text).toContain("SweetBootcamp Web Fullstack");
      expect(text).toContain("2026-04-30");
      expect(text).toContain("축하합니다");
    });

    it("내지b 템플릿을 사용해야 한다", () => {
      const session = makeSession({ pages: ["certificate:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].templateUid).toBe(TEST_ENV.CONTENT_TEMPLATE_UID);
    });
  });

  // ── bio ──

  describe("bio 페이지", () => {
    it("내지a 템플릿을 사용하고 photo 파라미터가 있어야 한다", () => {
      const session = makeSession({ pages: ["bio:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].templateUid).toBe(TEST_ENV.CONTENT_A_TEMPLATE_UID);
      expect(payloads[0].parameters.photo).toBe(
        "https://example.com/photo1.jpg"
      );
    });

    it("diaryText에 이름, 역할, 자기소개가 포함되어야 한다", () => {
      const session = makeSession({ pages: ["bio:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("김코드");
      expect(text).toContain("풀스택");
      expect(text).toContain("자기소개 텍스트");
    });

    it("student가 없으면 빈 페이지여야 한다", () => {
      const session = makeSession({ pages: ["bio:0"] });
      const payloads = buildContentsPayload(session, mockCohort);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });
  });

  // ── tech-stack ──

  describe("tech-stack 페이지", () => {
    it("diaryText에 기술 스택이 포함되어야 한다", () => {
      const session = makeSession({ pages: ["tech-stack:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("TypeScript");
      expect(text).toContain("Next.js");
      expect(text).toContain("Prisma");
    });
  });

  // ── project-summary ──

  describe("project-summary 페이지", () => {
    it("index 0이면 첫 번째 프로젝트 정보가 포함되어야 한다", () => {
      const session = makeSession({ pages: ["project-summary:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("StudyFlow");
      expect(text).toContain("스터디 운영 자동화");
      expect(text).toContain("백엔드 API 설계");
    });

    it("내지a 템플릿을 사용해야 한다", () => {
      const session = makeSession({ pages: ["project-summary:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].templateUid).toBe(TEST_ENV.CONTENT_A_TEMPLATE_UID);
    });

    it("index 1이면 두 번째 프로젝트 정보가 포함되어야 한다", () => {
      const session = makeSession({ pages: ["project-summary:1"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toContain("DemoBoard");
    });

    it("존재하지 않는 index면 빈 페이지여야 한다", () => {
      const session = makeSession({ pages: ["project-summary:5"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });
  });

  // ── project-detail ──

  describe("project-detail 페이지", () => {
    it("PRD 신규 필드(problem, solution, techChoices, result)가 포함되어야 한다", () => {
      const session = makeSession({ pages: ["project-detail:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("StudyFlow — 상세");
      expect(text).toContain("스터디 일정 관리가 비효율적");
      expect(text).toContain("자동화된 일정 관리 시스템 구축");
      expect(text).toContain("Express");
      expect(text).toContain("운영 시간 50% 감소");
    });

    it("내지b 템플릿을 사용해야 한다", () => {
      const session = makeSession({ pages: ["project-detail:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].templateUid).toBe(TEST_ENV.CONTENT_TEMPLATE_UID);
    });

    it("신규 필드가 없는 프로젝트는 기본 정보만 포함해야 한다", () => {
      const session = makeSession({ pages: ["project-detail:1"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("DemoBoard — 상세");
      expect(text).toContain("프론트엔드 구현");
      expect(text).not.toContain("문제:");
    });
  });

  // ── retrospective ──

  describe("retrospective 페이지", () => {
    it("구조화된 retrospective Json에서 필드가 추출되어야 한다", () => {
      const session = makeSession({ pages: ["retrospective:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("회고");
      expect(text).toContain("프로그래밍 경험 없었음");
      expect(text).toContain("매일 코딩");
      expect(text).toContain("첫 PR 머지");
      expect(text).toContain("비동기 처리 이해");
      expect(text).toContain("페어 프로그래밍");
      expect(text).toContain("협업의 중요성");
    });

    it("retrospective가 문자열이면 그대로 사용해야 한다", () => {
      const studentStringRetro = {
        ...mockStudent,
        retrospective: "단순 문자열 회고",
      };
      const session = makeSession({ pages: ["retrospective:0"] });
      const payloads = buildContentsPayload(
        session,
        mockCohort,
        studentStringRetro
      );
      expect(payloads[0].parameters.diaryText).toContain("단순 문자열 회고");
    });
  });

  // ── mentor-comment ──

  describe("mentor-comment 페이지", () => {
    it("개인 북이면 student의 멘토 코멘트가 포함되어야 한다", () => {
      const session = makeSession({ pages: ["mentor-comment:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toContain(
        "성실하게 잘 따라왔습니다"
      );
    });

    it("기수 쇼케이스(student 없음)이면 전체 수료생 코멘트 모음이어야 한다", () => {
      const cohortWithStudents: Cohort = {
        ...mockCohort,
        students: [mockStudent],
      };
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["mentor-comment:0"],
      });
      const payloads = buildContentsPayload(session, cohortWithStudents);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("[김코드]");
      expect(text).toContain("성실하게 잘 따라왔습니다");
    });
  });

  // ── photo-gallery ──

  describe("photo-gallery 페이지", () => {
    it("내지_gallery 템플릿을 사용해야 한다", () => {
      const session = makeSession({ pages: ["photo-gallery:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].templateUid).toBe(TEST_ENV.GALLERY_TEMPLATE_UID);
    });

    it("collagePhotos에 JSON 배열이 설정되어야 한다", () => {
      const session = makeSession({ pages: ["photo-gallery:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const photos = JSON.parse(payloads[0].parameters.collagePhotos);
      expect(photos).toEqual([
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ]);
    });

    it("사진이 없으면 빈 페이지여야 한다", () => {
      const studentNoPhotos = { ...mockStudent, photos: [] };
      const session = makeSession({ pages: ["photo-gallery:0"] });
      const payloads = buildContentsPayload(
        session,
        mockCohort,
        studentNoPhotos
      );
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });
  });

  // ── cohort-intro ──

  describe("cohort-intro 페이지", () => {
    it("index 0이면 기수명, 과정명, 요약이 포함되어야 한다", () => {
      const session = makeSession({ pages: ["cohort-intro:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("웹 풀스택 5기");
      expect(text).toContain("SweetBootcamp Web Fullstack");
      expect(text).toContain("테스트 기수 요약");
    });
  });

  // ── thanks ──

  describe("thanks 페이지", () => {
    it("student의 thanksMessage가 있으면 우선 사용해야 한다", () => {
      const session = makeSession({ pages: ["thanks:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toContain(
        "멘토님과 동기들에게 감사합니다"
      );
    });

    it("thanksMessage가 없으면 customText.graduationMessage를 사용해야 한다", () => {
      const studentNoThanks = {
        ...mockStudent,
        thanksMessage: undefined,
      };
      const session = makeSession({ pages: ["thanks:0"] });
      const payloads = buildContentsPayload(
        session,
        mockCohort,
        studentNoThanks
      );
      expect(payloads[0].parameters.diaryText).toContain(
        "김코드의 수료를 진심으로 축하합니다"
      );
    });
  });

  // ── portfolio-links ──

  describe("portfolio-links 페이지", () => {
    it("portfolioLinks와 프로젝트 링크가 모두 포함되어야 한다", () => {
      const session = makeSession({ pages: ["portfolio-links:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("GitHub: https://github.com/kimcode");
      expect(text).toContain("Blog: https://kimcode.dev");
      expect(text).toContain("StudyFlow: https://github.com/example/studyflow");
    });
  });

  // ── blank ──

  describe("blank 페이지", () => {
    it("diaryText가 공백이어야 한다", () => {
      const session = makeSession({ pages: ["blank:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });
  });

  // ── 공통 파라미터 ──

  describe("공통 파라미터", () => {
    it("monthNum에 수료월(2자리)이 설정되어야 한다", () => {
      const session = makeSession({ pages: ["certificate:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.monthNum).toBe("04");
    });

    it("dayNum에 수료일(2자리)이 설정되어야 한다", () => {
      const session = makeSession({ pages: ["certificate:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.dayNum).toBe("30");
    });
  });

  // ── 빈 페이지 자동 보강 ──

  describe("빈 페이지 자동 보강", () => {
    it("pages가 0개이면 최소 내지 26개가 생성되어야 한다", () => {
      const session = makeSession({ pages: [] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(26);
    });

    it("콘텐츠 페이지가 부족하면 빈 페이지로 보강되어야 한다", () => {
      const session = makeSession({ pages: ["certificate:0", "bio:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length).toBeGreaterThanOrEqual(26);
    });

    it("최종 내지 수가 짝수여야 한다", () => {
      const session = makeSession({
        pages: ["certificate:0", "bio:0", "tech-stack:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads.length % 2).toBe(0);
    });

    it("보강된 빈 페이지는 diaryText가 공백이어야 한다", () => {
      const session = makeSession({ pages: ["certificate:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      const lastPayload = payloads[payloads.length - 1];
      expect(lastPayload.parameters.diaryText).toBe(" ");
    });
  });

  // ── hiddenBlocks 필터링 ──

  describe("hiddenBlocks 필터링", () => {
    it("hiddenBlocks에 포함된 pageId는 제외되어야 한다", () => {
      const session = makeSession({
        pages: ["certificate:0", "bio:0", "tech-stack:0"],
        hiddenBlocks: ["bio:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      // bio 페이지가 제외되므로 첫 번째는 certificate, 두 번째는 tech-stack
      expect(payloads[0].parameters.diaryText).toContain("김코드");
      expect(payloads[1].parameters.diaryText).toContain("기술 스택");
    });

    it("모든 pages가 hiddenBlocks에 포함되면 빈 내지만 생성되어야 한다", () => {
      const session = makeSession({
        pages: ["certificate:0", "bio:0"],
        hiddenBlocks: ["certificate:0", "bio:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(26);
      expect(payloads.every((p) => p.parameters.diaryText === " ")).toBe(true);
    });
  });

  // ── 잘못된 pageId 처리 ──

  describe("잘못된 pageId 처리", () => {
    it("구분자가 없는 pageId는 빈 페이지로 처리되어야 한다", () => {
      const session = makeSession({ pages: ["invalidpage"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });

    it("알 수 없는 타입의 pageId는 빈 페이지로 처리되어야 한다", () => {
      const session = makeSession({ pages: ["unknown-type:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });
  });

  // ════════════════════════════════════════════════
  // QA 추가 테스트: 기수 쇼케이스 매핑
  // ════════════════════════════════════════════════

  describe("기수 쇼케이스 전용 매핑", () => {
    const mockStudent2: StudentPortfolio = {
      id: "student-002",
      name: "박설계",
      roleTrack: "백엔드",
      bio: "설계를 좋아합니다",
      techStack: ["Go", "gRPC"],
      projects: [
        {
          title: "ArchFlow",
          summary: "아키텍처 시각화",
          contribution: "전체 설계",
          links: ["https://archflow.dev"],
        },
      ],
      retrospective: "한 줄 회고",
      mentorComment: "논리적 사고가 뛰어납니다.",
      photos: ["https://example.com/photo-park.jpg"],
      certificateMessage: "수료를 축하합니다.",
    };

    const cohortWithStudents: Cohort = {
      ...mockCohort,
      students: [mockStudent, mockStudent2],
    };

    it("photo-gallery가 전체 수료생 사진을 취합해야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["photo-gallery:0"],
      });
      const payloads = buildContentsPayload(session, cohortWithStudents);
      expect(payloads[0].templateUid).toBe(TEST_ENV.GALLERY_TEMPLATE_UID);
      const photos = JSON.parse(payloads[0].parameters.collagePhotos);
      expect(photos).toContain("https://example.com/photo1.jpg");
      expect(photos).toContain("https://example.com/photo2.jpg");
      expect(photos).toContain("https://example.com/photo-park.jpg");
      expect(photos).toHaveLength(3);
    });

    it("mentor-comment가 전체 수료생 코멘트를 모아야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["mentor-comment:0"],
      });
      const payloads = buildContentsPayload(session, cohortWithStudents);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("[김코드]");
      expect(text).toContain("[박설계]");
      expect(text).toContain("성실하게 잘 따라왔습니다");
      expect(text).toContain("논리적 사고가 뛰어납니다");
    });

    it("cohort-intro index 1이면 staffMessage를 사용해야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["cohort-intro:1"],
      });
      const payloads = buildContentsPayload(session, cohortWithStudents);
      expect(payloads[0].parameters.diaryText).toBe("운영진 메시지");
    });

    it("cohort-intro index 2이면 cohortIntro를 사용해야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["cohort-intro:2"],
      });
      const payloads = buildContentsPayload(session, cohortWithStudents);
      expect(payloads[0].parameters.diaryText).toBe("부트캠프 소개 상세");
    });

    it("cohort-intro index 1인데 staffMessage가 없으면 빈 페이지여야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["cohort-intro:1"],
        customText: {
          coverTitle: "기수 쇼케이스",
          graduationMessage: "축하합니다",
        },
      });
      const payloads = buildContentsPayload(session, cohortWithStudents);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });

    it("수료생이 모두 사진이 없으면 photo-gallery가 빈 페이지여야 한다", () => {
      const cohortNoPhotos: Cohort = {
        ...mockCohort,
        students: [
          { ...mockStudent, photos: [] },
          { ...mockStudent2, photos: [] },
        ],
      };
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["photo-gallery:0"],
      });
      const payloads = buildContentsPayload(session, cohortNoPhotos);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });

    it("수료생이 없는 기수의 mentor-comment는 폴백 메시지여야 한다", () => {
      const session = makeSession({
        bookType: "cohort-showcase",
        pages: ["mentor-comment:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort);
      expect(payloads[0].parameters.diaryText).toContain("멘토 코멘트가 없습니다");
    });
  });

  // ════════════════════════════════════════════════
  // QA 추가 테스트: nullable 필드 fallback 경계값
  // ════════════════════════════════════════════════

  describe("nullable 필드 fallback", () => {
    const minimalStudent: StudentPortfolio = {
      id: "student-minimal",
      name: "최소생",
      roleTrack: "프론트엔드",
      bio: "",
      techStack: [],
      projects: [],
      retrospective: "",
      mentorComment: "",
      photos: [],
      certificateMessage: "",
    };

    it("프로젝트 0개 수료생의 project-summary는 빈 페이지여야 한다", () => {
      const session = makeSession({ pages: ["project-summary:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });

    it("프로젝트 0개 수료생의 project-detail은 빈 페이지여야 한다", () => {
      const session = makeSession({ pages: ["project-detail:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].parameters.diaryText).toBe(" ");
    });

    it("사진 0장 수료생의 bio는 폴백 photo URL을 사용해야 한다", () => {
      const session = makeSession({ pages: ["bio:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].templateUid).toBe(TEST_ENV.CONTENT_A_TEMPLATE_UID);
      expect(payloads[0].parameters.photo).toContain("picsum.photos");
    });

    it("빈 문자열 mentorComment는 폴백 메시지를 사용해야 한다", () => {
      const session = makeSession({ pages: ["mentor-comment:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].parameters.diaryText).toContain("멘토 코멘트가 없습니다");
    });

    it("빈 문자열 retrospective는 폴백 메시지를 사용해야 한다", () => {
      const session = makeSession({ pages: ["retrospective:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].parameters.diaryText).toContain("회고 내용이 없습니다");
    });

    it("retrospective가 빈 객체({})이면 폴백 메시지를 사용해야 한다", () => {
      const studentEmptyRetro = { ...minimalStudent, retrospective: {} };
      const session = makeSession({ pages: ["retrospective:0"] });
      const payloads = buildContentsPayload(session, mockCohort, studentEmptyRetro);
      expect(payloads[0].parameters.diaryText).toContain("회고 내용이 없습니다");
    });

    it("techStack이 빈 배열이면 '기술 스택' 헤더만 있어야 한다", () => {
      const session = makeSession({ pages: ["tech-stack:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].parameters.diaryText).toBe("기술 스택\n\n");
    });

    it("portfolioLinks가 없는 수료생의 portfolio-links는 프로젝트 링크도 없으면 폴백이어야 한다", () => {
      const session = makeSession({ pages: ["portfolio-links:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      expect(payloads[0].parameters.diaryText).toContain("포트폴리오 링크가 없습니다");
    });

    it("certificateMessage가 빈 문자열이면 기본 축하 문구를 사용해야 한다", () => {
      const session = makeSession({ pages: ["certificate:0"] });
      const payloads = buildContentsPayload(session, mockCohort, minimalStudent);
      // 빈 문자열이므로 빈 메시지가 들어감 — 현재 구현은 빈 문자열 그대로 사용
      // certificateMessage가 falsy면 "수료를 축하합니다." 폴백이 동작하는지 확인
      expect(payloads[0].parameters.diaryText).toContain("수료를 축하합니다");
    });
  });

  // ════════════════════════════════════════════════
  // QA 추가 테스트: project-detail 세부 경계값
  // ════════════════════════════════════════════════

  describe("project-detail 세부 경계값", () => {
    it("links가 있는 프로젝트는 링크 섹션이 포함되어야 한다", () => {
      const session = makeSession({ pages: ["project-detail:0"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).toContain("링크:");
      expect(payloads[0].parameters.diaryText).toContain(
        "https://github.com/example/studyflow"
      );
    });

    it("links가 빈 프로젝트는 링크 섹션이 없어야 한다", () => {
      const session = makeSession({ pages: ["project-detail:1"] });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads[0].parameters.diaryText).not.toContain("링크:");
    });

    it("techChoices만 있고 problem/solution/result가 없는 프로젝트", () => {
      const studentPartial: StudentPortfolio = {
        ...mockStudent,
        projects: [
          {
            title: "PartialProject",
            summary: "요약",
            contribution: "기여",
            links: [],
            techChoices: ["React", "Vite"],
          },
        ],
      };
      const session = makeSession({ pages: ["project-detail:0"] });
      const payloads = buildContentsPayload(session, mockCohort, studentPartial);
      const text = payloads[0].parameters.diaryText;
      expect(text).toContain("기술 선택: React, Vite");
      expect(text).not.toContain("문제:");
      expect(text).not.toContain("해결:");
      expect(text).not.toContain("결과:");
    });
  });

  // ════════════════════════════════════════════════
  // QA 추가 테스트: 복합 시나리오
  // ════════════════════════════════════════════════

  describe("복합 시나리오", () => {
    it("DEFAULT_INDIVIDUAL_PAGES 전체 매핑 시 각 페이지가 올바른 템플릿을 사용해야 한다", () => {
      const pages = [
        "certificate:0", "bio:0", "tech-stack:0",
        "project-summary:0", "project-detail:0",
        "project-summary:1", "project-detail:1",
        "retrospective:0", "mentor-comment:0",
        "photo-gallery:0", "cohort-intro:0",
        "thanks:0", "portfolio-links:0",
      ];
      const session = makeSession({ pages });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);

      // 13개 콘텐츠 + 패딩 → 26 이상 짝수
      expect(payloads.length).toBeGreaterThanOrEqual(26);
      expect(payloads.length % 2).toBe(0);

      // 템플릿 종류 확인
      expect(payloads[0].templateUid).toBe(TEST_ENV.CONTENT_TEMPLATE_UID);   // certificate → 내지b
      expect(payloads[1].templateUid).toBe(TEST_ENV.CONTENT_A_TEMPLATE_UID); // bio → 내지a
      expect(payloads[2].templateUid).toBe(TEST_ENV.CONTENT_TEMPLATE_UID);   // tech-stack → 내지b
      expect(payloads[3].templateUid).toBe(TEST_ENV.CONTENT_A_TEMPLATE_UID); // project-summary → 내지a
      expect(payloads[4].templateUid).toBe(TEST_ENV.CONTENT_TEMPLATE_UID);   // project-detail → 내지b
      expect(payloads[9].templateUid).toBe(TEST_ENV.GALLERY_TEMPLATE_UID);   // photo-gallery → 내지_gallery
    });

    it("hiddenBlocks로 일부 페이지 제거 후 나머지가 올바른 순서여야 한다", () => {
      const pages = [
        "certificate:0", "bio:0", "tech-stack:0",
        "project-summary:0", "retrospective:0",
      ];
      const session = makeSession({
        pages,
        hiddenBlocks: ["bio:0", "project-summary:0"],
      });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);

      // 3개 남음: certificate, tech-stack, retrospective
      expect(payloads[0].parameters.diaryText).toContain("김코드");     // certificate
      expect(payloads[1].parameters.diaryText).toContain("기술 스택");   // tech-stack
      expect(payloads[2].parameters.diaryText).toContain("회고");       // retrospective
    });

    it("콘텐츠 27개면 짝수 보정으로 28개여야 한다", () => {
      const pages = Array.from({ length: 27 }, (_, i) => `blank:${i}`);
      const session = makeSession({ pages });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(28);
    });

    it("콘텐츠 정확히 26개면 보강 없이 26개여야 한다", () => {
      const pages = Array.from({ length: 26 }, (_, i) => `blank:${i}`);
      const session = makeSession({ pages });
      const payloads = buildContentsPayload(session, mockCohort, mockStudent);
      expect(payloads).toHaveLength(26);
    });
  });
});
