import { describe, expect, it } from "vitest";

import {
  buildBlockId,
  buildDefaultPages,
  buildPhotoBlockId,
  buildProjectBlockId,
  createDefaultEditSession,
  getBlockIndex,
  getBlockType,
  getPageDescription,
  getPageLabel,
  isBlockHidden,
  movePage,
  PAGE_BLOCK_TYPES,
  PAGE_TYPE_LABELS,
  toggleHiddenBlock
} from "@/lib/edit-session";

// ────────────────────────────────────────────────
// createDefaultEditSession
// ────────────────────────────────────────────────

describe("createDefaultEditSession", () => {
  it("bookType이 올바르게 설정되어야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.bookType).toBe("individual");
  });

  it("cohort-showcase bookType도 올바르게 설정되어야 한다", () => {
    const session = createDefaultEditSession("cohort-showcase", "3기");
    expect(session.bookType).toBe("cohort-showcase");
  });

  it("coverTitle이 subjectName으로 초기화되어야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.customText.coverTitle).toBe("홍길동");
  });

  it("graduationMessage에 subjectName이 포함되어야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.customText.graduationMessage).toContain("홍길동");
  });

  it("hiddenBlocks가 빈 배열로 초기화되어야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.hiddenBlocks).toEqual([]);
  });

  it("pages가 빈 배열로 초기화되어야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.pages).toEqual([]);
  });

  it("서로 다른 subjectName으로 호출 시 독립된 객체를 반환해야 한다", () => {
    const sessionA = createDefaultEditSession("individual", "홍길동");
    const sessionB = createDefaultEditSession("individual", "김철수");
    expect(sessionA.customText.coverTitle).not.toBe(sessionB.customText.coverTitle);
  });

  it("빈 문자열 subjectName은 coverTitle을 빈 문자열로 초기화해야 한다", () => {
    const session = createDefaultEditSession("individual", "");
    expect(session.customText.coverTitle).toBe("");
  });

  it("기본 세션에 cohortIntro가 포함되지 않아야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.customText.cohortIntro).toBeUndefined();
  });

  it("기본 세션에 staffMessage가 포함되지 않아야 한다", () => {
    const session = createDefaultEditSession("individual", "홍길동");
    expect(session.customText.staffMessage).toBeUndefined();
  });
});

describe("cohort-showcase customText override 패턴", () => {
  it("cohortIntro가 override된 세션에서 cohortIntro가 올바르게 설정되어야 한다", () => {
    const cohortName = "3기";
    const cohortSummary = "함께 성장한 3기 수료생들입니다.";
    const session = {
      ...createDefaultEditSession("cohort-showcase", cohortName),
      customText: {
        coverTitle: cohortName,
        graduationMessage: "",
        cohortIntro: cohortSummary,
        staffMessage: `${cohortName} 기수의 수료를 진심으로 축하합니다.`
      }
    };
    expect(session.customText.cohortIntro).toBe(cohortSummary);
  });

  it("staffMessage가 override된 세션에서 staffMessage가 올바르게 설정되어야 한다", () => {
    const cohortName = "3기";
    const session = {
      ...createDefaultEditSession("cohort-showcase", cohortName),
      customText: {
        coverTitle: cohortName,
        graduationMessage: "",
        cohortIntro: "소개글",
        staffMessage: `${cohortName} 기수의 수료를 진심으로 축하합니다.`
      }
    };
    expect(session.customText.staffMessage).toBe("3기 기수의 수료를 진심으로 축하합니다.");
  });

  it("customText 전체 override 시 bookType과 hiddenBlocks는 보존되어야 한다", () => {
    const cohortName = "3기";
    const session = {
      ...createDefaultEditSession("cohort-showcase", cohortName),
      customText: {
        coverTitle: cohortName,
        graduationMessage: "",
        cohortIntro: "소개글",
        staffMessage: "메시지"
      }
    };
    expect(session.bookType).toBe("cohort-showcase");
    expect(session.hiddenBlocks).toEqual([]);
  });
});

// ────────────────────────────────────────────────
// buildBlockId
// ────────────────────────────────────────────────

describe("buildBlockId", () => {
  it("타입과 인덱스로 블록 ID를 생성해야 한다", () => {
    expect(buildBlockId("certificate", 0)).toBe("certificate:0");
    expect(buildBlockId("project-summary", 2)).toBe("project-summary:2");
  });

  it("12종 블록 타입 모두 생성 가능해야 한다", () => {
    for (const type of PAGE_BLOCK_TYPES) {
      const id = buildBlockId(type, 0);
      expect(id).toBe(`${type}:0`);
    }
  });
});

// ────────────────────────────────────────────────
// 레거시 블록 ID 빌더 (하위 호환)
// ────────────────────────────────────────────────

describe("buildProjectBlockId (레거시)", () => {
  it("인덱스 0은 'project:0'을 반환해야 한다", () => {
    expect(buildProjectBlockId(0)).toBe("project:0");
  });

  it("인덱스 3은 'project:3'을 반환해야 한다", () => {
    expect(buildProjectBlockId(3)).toBe("project:3");
  });
});

describe("buildPhotoBlockId (레거시)", () => {
  it("인덱스 0은 'photo:0'을 반환해야 한다", () => {
    expect(buildPhotoBlockId(0)).toBe("photo:0");
  });

  it("인덱스 2는 'photo:2'를 반환해야 한다", () => {
    expect(buildPhotoBlockId(2)).toBe("photo:2");
  });
});

describe("buildProjectBlockId / buildPhotoBlockId 네임스페이스 분리", () => {
  it("같은 인덱스라도 project와 photo의 blockId는 달라야 한다", () => {
    expect(buildProjectBlockId(0)).not.toBe(buildPhotoBlockId(0));
  });

  it("project blockId를 숨겨도 같은 인덱스의 photo는 숨겨지지 않아야 한다", () => {
    const hiddenBlocks = [buildProjectBlockId(0)];
    expect(isBlockHidden(hiddenBlocks, buildPhotoBlockId(0))).toBe(false);
  });
});

// ────────────────────────────────────────────────
// getBlockType / getBlockIndex
// ────────────────────────────────────────────────

describe("getBlockType", () => {
  it("새 블록 ID에서 타입을 추출해야 한다", () => {
    expect(getBlockType("project-summary:0")).toBe("project-summary");
    expect(getBlockType("certificate:0")).toBe("certificate");
  });

  it("레거시 블록 ID에서 타입을 추출해야 한다", () => {
    expect(getBlockType("project:0")).toBe("project");
    expect(getBlockType("photo:1")).toBe("photo");
  });

  it("콜론이 없으면 전체 문자열을 반환해야 한다", () => {
    expect(getBlockType("invalid")).toBe("invalid");
  });
});

describe("getBlockIndex", () => {
  it("블록 ID에서 인덱스를 추출해야 한다", () => {
    expect(getBlockIndex("project-summary:2")).toBe(2);
    expect(getBlockIndex("certificate:0")).toBe(0);
  });

  it("콜론이 없으면 0을 반환해야 한다", () => {
    expect(getBlockIndex("invalid")).toBe(0);
  });

  it("인덱스가 숫자가 아니면 0을 반환해야 한다", () => {
    expect(getBlockIndex("certificate:abc")).toBe(0);
  });
});

// ────────────────────────────────────────────────
// getPageLabel
// ────────────────────────────────────────────────

describe("getPageLabel", () => {
  it("새 블록 타입의 한글 라벨을 반환해야 한다", () => {
    expect(getPageLabel("certificate:0")).toBe("기념 수료");
    expect(getPageLabel("bio:0")).toBe("수료생 소개");
    expect(getPageLabel("retrospective:0")).toBe("회고");
  });

  it("인덱스가 1 이상이면 번호를 포함해야 한다", () => {
    expect(getPageLabel("cohort-intro:1")).toBe("부트캠프 소개 2");
    expect(getPageLabel("cohort-intro:2")).toBe("부트캠프 소개 3");
  });

  it("project-summary는 프로젝트 제목을 포함해야 한다", () => {
    expect(getPageLabel("project-summary:0", ["StudyFlow", "DemoBoard"])).toBe(
      "프로젝트 요약 — StudyFlow"
    );
    expect(getPageLabel("project-detail:1", ["StudyFlow", "DemoBoard"])).toBe(
      "프로젝트 상세 — DemoBoard"
    );
  });

  it("프로젝트 제목이 없으면 번호를 사용해야 한다", () => {
    expect(getPageLabel("project-summary:0")).toBe("프로젝트 요약 1");
    expect(getPageLabel("project-detail:2")).toBe("프로젝트 상세 3");
  });

  it("레거시 project 블록 ID는 프로젝트 제목을 반환해야 한다", () => {
    expect(getPageLabel("project:0", ["StudyFlow"])).toBe("StudyFlow");
    expect(getPageLabel("project:1")).toBe("프로젝트 2");
  });

  it("레거시 photo 블록 ID는 '사진 N'을 반환해야 한다", () => {
    expect(getPageLabel("photo:0")).toBe("사진 1");
    expect(getPageLabel("photo:2")).toBe("사진 3");
  });

  it("알 수 없는 타입은 원본 blockId를 반환해야 한다", () => {
    expect(getPageLabel("unknown:0")).toBe("unknown:0");
  });

  it("12종 PAGE_TYPE_LABELS가 모두 정의되어 있어야 한다", () => {
    for (const type of PAGE_BLOCK_TYPES) {
      expect(PAGE_TYPE_LABELS[type]).toBeDefined();
      expect(typeof PAGE_TYPE_LABELS[type]).toBe("string");
    }
  });
});

// ────────────────────────────────────────────────
// isBlockHidden / toggleHiddenBlock
// ────────────────────────────────────────────────

describe("isBlockHidden", () => {
  it("hiddenBlocks에 포함된 blockId는 true를 반환해야 한다", () => {
    expect(isBlockHidden(["certificate:0", "bio:0"], "certificate:0")).toBe(true);
  });

  it("hiddenBlocks에 없는 blockId는 false를 반환해야 한다", () => {
    expect(isBlockHidden(["certificate:0"], "bio:0")).toBe(false);
  });

  it("빈 hiddenBlocks에서는 항상 false를 반환해야 한다", () => {
    expect(isBlockHidden([], "certificate:0")).toBe(false);
  });

  it("새 블록 타입과 레거시 블록 타입이 혼재해도 정확히 동작해야 한다", () => {
    const hidden = ["project:0", "certificate:0"];
    expect(isBlockHidden(hidden, "project:0")).toBe(true);
    expect(isBlockHidden(hidden, "certificate:0")).toBe(true);
    expect(isBlockHidden(hidden, "project-summary:0")).toBe(false);
  });
});

describe("toggleHiddenBlock", () => {
  it("없는 blockId를 전달하면 배열에 추가해야 한다", () => {
    const result = toggleHiddenBlock([], "certificate:0");
    expect(result).toContain("certificate:0");
    expect(result).toHaveLength(1);
  });

  it("이미 있는 blockId를 전달하면 배열에서 제거해야 한다", () => {
    const result = toggleHiddenBlock(["certificate:0", "bio:0"], "certificate:0");
    expect(result).not.toContain("certificate:0");
    expect(result).toContain("bio:0");
  });

  it("원본 배열을 변경하지 않고 새 배열을 반환해야 한다", () => {
    const original = ["certificate:0"];
    const result = toggleHiddenBlock(original, "bio:0");
    expect(result).not.toBe(original);
    expect(original).toHaveLength(1);
  });

  it("여러 번 토글하면 원래 상태로 돌아와야 한다", () => {
    const after1 = toggleHiddenBlock([], "certificate:0");
    const after2 = toggleHiddenBlock(after1, "certificate:0");
    expect(after2).not.toContain("certificate:0");
    expect(after2).toHaveLength(0);
  });
});

// ────────────────────────────────────────────────
// buildDefaultPages — 레거시 시그니처 (하위 호환)
// ────────────────────────────────────────────────

describe("buildDefaultPages (레거시 시그니처)", () => {
  it("프로젝트 2개, 사진 1개이면 project:0, project:1, photo:0 순서로 반환해야 한다", () => {
    expect(buildDefaultPages(2, 1)).toEqual(["project:0", "project:1", "photo:0"]);
  });

  it("프로젝트만 있을 때 photo ID는 포함되지 않아야 한다", () => {
    const pages = buildDefaultPages(2, 0);
    expect(pages).toEqual(["project:0", "project:1"]);
  });

  it("둘 다 0이면 빈 배열을 반환해야 한다", () => {
    expect(buildDefaultPages(0, 0)).toEqual([]);
  });
});

// ────────────────────────────────────────────────
// buildDefaultPages — individual (PRD 섹션 5)
// ────────────────────────────────────────────────

describe("buildDefaultPages (individual)", () => {
  it("프로젝트 2개, 사진 2장이면 PRD 구성표 순서대로 생성해야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 2, photoCount: 2, bookType: "individual" });
    expect(pages).toEqual([
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
    ]);
  });

  it("프로젝트 1개이면 project-summary/detail이 1쌍만 있어야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 1, photoCount: 1, bookType: "individual" });
    const summaryCount = pages.filter((p) => p.startsWith("project-summary:")).length;
    const detailCount = pages.filter((p) => p.startsWith("project-detail:")).length;
    expect(summaryCount).toBe(1);
    expect(detailCount).toBe(1);
  });

  it("프로젝트 0개이면 project 관련 페이지가 없어야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 0, photoCount: 1, bookType: "individual" });
    expect(pages.some((p) => p.startsWith("project-summary:"))).toBe(false);
    expect(pages.some((p) => p.startsWith("project-detail:"))).toBe(false);
  });

  it("사진 0장이면 photo-gallery가 없어야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 1, photoCount: 0, bookType: "individual" });
    expect(pages.some((p) => p.startsWith("photo-gallery:"))).toBe(false);
  });

  it("certificate, bio, tech-stack은 항상 첫 3개여야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 0, photoCount: 0, bookType: "individual" });
    expect(pages[0]).toBe("certificate:0");
    expect(pages[1]).toBe("bio:0");
    expect(pages[2]).toBe("tech-stack:0");
  });

  it("thanks, portfolio-links는 항상 마지막 2개여야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 2, photoCount: 1, bookType: "individual" });
    expect(pages[pages.length - 1]).toBe("portfolio-links:0");
    expect(pages[pages.length - 2]).toBe("thanks:0");
  });
});

// ────────────────────────────────────────────────
// buildDefaultPages — cohort-showcase (PRD 섹션 6)
// ────────────────────────────────────────────────

describe("buildDefaultPages (cohort-showcase)", () => {
  it("사진이 있으면 PRD 구성표 순서대로 생성해야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 0, photoCount: 3, bookType: "cohort-showcase" });
    expect(pages).toEqual([
      "cohort-intro:0",
      "cohort-intro:1",
      "cohort-intro:2",
      "mentor-comment:0",
      "photo-gallery:0",
      "thanks:0",
    ]);
  });

  it("사진 0장이면 photo-gallery가 없어야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 0, photoCount: 0, bookType: "cohort-showcase" });
    expect(pages.some((p) => p.startsWith("photo-gallery:"))).toBe(false);
    expect(pages).toHaveLength(5);
  });

  it("cohort-showcase에서 projectCount는 무시되어야 한다", () => {
    const pagesA = buildDefaultPages({ projectCount: 0, photoCount: 1, bookType: "cohort-showcase" });
    const pagesB = buildDefaultPages({ projectCount: 5, photoCount: 1, bookType: "cohort-showcase" });
    expect(pagesA).toEqual(pagesB);
  });
});

// ────────────────────────────────────────────────
// movePage
// ────────────────────────────────────────────────

describe("movePage", () => {
  it("위로 이동하면 해당 항목이 앞으로 이동해야 한다", () => {
    const result = movePage(["a", "b", "c"], 1, "up");
    expect(result).toEqual(["b", "a", "c"]);
  });

  it("아래로 이동하면 해당 항목이 뒤로 이동해야 한다", () => {
    const result = movePage(["a", "b", "c"], 1, "down");
    expect(result).toEqual(["a", "c", "b"]);
  });

  it("첫 번째 항목을 위로 이동하면 원본과 동일한 배열을 반환해야 한다", () => {
    const pages = ["a", "b", "c"];
    const result = movePage(pages, 0, "up");
    expect(result).toEqual(pages);
  });

  it("마지막 항목을 아래로 이동하면 원본과 동일한 배열을 반환해야 한다", () => {
    const pages = ["a", "b", "c"];
    const result = movePage(pages, 2, "down");
    expect(result).toEqual(pages);
  });

  it("원본 배열을 변경하지 않고 새 배열을 반환해야 한다", () => {
    const original = ["a", "b", "c"];
    const result = movePage(original, 1, "up");
    expect(result).not.toBe(original);
    expect(original).toEqual(["a", "b", "c"]);
  });

  it("항목이 1개인 배열에서 위로 이동 시 원본과 동일해야 한다", () => {
    expect(movePage(["a"], 0, "up")).toEqual(["a"]);
  });

  it("항목이 1개인 배열에서 아래로 이동 시 원본과 동일해야 한다", () => {
    expect(movePage(["a"], 0, "down")).toEqual(["a"]);
  });
});

// ════════════════════════════════════════════════
// QA 추가 테스트: 프론트-백엔드 블록 ID 정합성
// ════════════════════════════════════════════════

describe("프론트-백엔드 블록 ID 정합성", () => {
  // 백엔드 book-spec.ts의 VALID_PAGE_TYPES와 동일한 집합
  const BACKEND_VALID_PAGE_TYPES = new Set([
    "certificate", "bio", "tech-stack", "project-summary", "project-detail",
    "retrospective", "mentor-comment", "photo-gallery", "cohort-intro",
    "thanks", "portfolio-links", "blank",
  ]);

  it("individual buildDefaultPages가 생성하는 모든 블록 ID가 백엔드 PageType으로 유효해야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 3, photoCount: 2, bookType: "individual" });
    for (const pageId of pages) {
      const type = getBlockType(pageId);
      expect(BACKEND_VALID_PAGE_TYPES.has(type)).toBe(true);
    }
  });

  it("cohort-showcase buildDefaultPages가 생성하는 모든 블록 ID가 백엔드 PageType으로 유효해야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 0, photoCount: 5, bookType: "cohort-showcase" });
    for (const pageId of pages) {
      const type = getBlockType(pageId);
      expect(BACKEND_VALID_PAGE_TYPES.has(type)).toBe(true);
    }
  });

  it("PAGE_BLOCK_TYPES가 백엔드 PageType 집합과 동일해야 한다", () => {
    const frontendSet = new Set(PAGE_BLOCK_TYPES);
    expect(frontendSet).toEqual(BACKEND_VALID_PAGE_TYPES);
  });

  it("블록 ID 형식이 'type:index'이고 index가 0 이상 정수여야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 2, photoCount: 1, bookType: "individual" });
    for (const pageId of pages) {
      expect(pageId).toMatch(/^[a-z-]+:\d+$/);
      expect(getBlockIndex(pageId)).toBeGreaterThanOrEqual(0);
    }
  });
});

// ════════════════════════════════════════════════
// QA 추가 테스트: getPageLabel 경계값
// ════════════════════════════════════════════════

describe("getPageLabel 경계값", () => {
  it("프로젝트 제목 배열 범위를 초과하는 인덱스는 번호 fallback이어야 한다", () => {
    expect(getPageLabel("project-summary:5", ["A", "B"])).toBe("프로젝트 요약 6");
  });

  it("빈 프로젝트 제목 배열이면 번호 fallback이어야 한다", () => {
    expect(getPageLabel("project-detail:0", [])).toBe("프로젝트 상세 1");
  });

  it("projectTitles가 undefined이면 번호 fallback이어야 한다", () => {
    expect(getPageLabel("project-summary:0", undefined)).toBe("프로젝트 요약 1");
  });

  it("blank 타입은 '빈 페이지'를 반환해야 한다", () => {
    expect(getPageLabel("blank:0")).toBe("빈 페이지");
  });

  it("blank:3은 '빈 페이지 4'를 반환해야 한다", () => {
    expect(getPageLabel("blank:3")).toBe("빈 페이지 4");
  });
});

// ════════════════════════════════════════════════
// QA 추가 테스트: 레거시 vs 새 시그니처 차이 명시
// ════════════════════════════════════════════════

describe("레거시 vs 새 시그니처 차이", () => {
  it("레거시 시그니처는 project:/photo: ID를 생성하고, 새 시그니처는 PRD 타입 ID를 생성해야 한다", () => {
    const legacy = buildDefaultPages(2, 1);
    const modern = buildDefaultPages({ projectCount: 2, photoCount: 1, bookType: "individual" });

    // 레거시: project:0, project:1, photo:0
    expect(legacy[0]).toBe("project:0");
    expect(legacy.some((p) => p.startsWith("certificate:"))).toBe(false);

    // 새 시그니처: certificate:0, bio:0, ... project-summary:0, ...
    expect(modern[0]).toBe("certificate:0");
    expect(modern.some((p) => p.startsWith("project:"))).toBe(false);
  });

  it("새 시그니처는 프로젝트/사진 0개여도 고정 페이지(certificate, bio 등)를 포함해야 한다", () => {
    const legacy = buildDefaultPages(0, 0);
    const modern = buildDefaultPages({ projectCount: 0, photoCount: 0, bookType: "individual" });

    expect(legacy).toEqual([]);
    expect(modern.length).toBeGreaterThan(0);
    expect(modern).toContain("certificate:0");
  });
});

// ════════════════════════════════════════════════
// QA 추가 테스트: 대량 프로젝트
// ════════════════════════════════════════════════

describe("getPageDescription", () => {
  it("12종 페이지 타입 모두 설명을 반환해야 한다", () => {
    for (const type of PAGE_BLOCK_TYPES) {
      const description = getPageDescription(`${type}:0`);
      expect(description).toBeDefined();
      expect(description.length).toBeGreaterThan(0);
    }
  });

  it("PAGE_TYPE_LABELS와 동일한 12종 키를 가져야 한다 (정합성)", () => {
    // 모든 PAGE_BLOCK_TYPES가 PAGE_TYPE_LABELS와 PAGE_TYPE_DESCRIPTIONS 양쪽에 있어야 한다
    for (const type of PAGE_BLOCK_TYPES) {
      expect(PAGE_TYPE_LABELS[type]).toBeDefined();
      expect(PAGE_TYPE_LABELS[type].length).toBeGreaterThan(0);
      // getPageDescription이 빈 문자열이 아닌 의미 있는 값을 반환해야 한다
      const desc = getPageDescription(`${type}:0`);
      expect(desc).not.toBe("");
      expect(desc).not.toBe("기타 페이지");
    }
  });

  it("certificate 페이지는 수료 관련 설명을 반환해야 한다", () => {
    expect(getPageDescription("certificate:0")).toContain("수료");
  });

  it("project-detail 페이지는 문제·해결 관련 설명을 반환해야 한다", () => {
    const desc = getPageDescription("project-detail:0");
    expect(desc).toContain("문제");
    expect(desc).toContain("해결");
  });

  it("레거시 project 블록은 폴백 설명을 반환해야 한다", () => {
    expect(getPageDescription("project:0")).toBe("프로젝트 정보");
  });

  it("레거시 photo 블록은 폴백 설명을 반환해야 한다", () => {
    expect(getPageDescription("photo:0")).toBe("활동 사진");
  });

  it("알 수 없는 타입은 '기타 페이지'를 반환해야 한다", () => {
    expect(getPageDescription("unknown-type:0")).toBe("기타 페이지");
  });
});

describe("대량 프로젝트 시나리오", () => {
  it("프로젝트 10개이면 project-summary/detail이 각 10개씩 있어야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 10, photoCount: 0, bookType: "individual" });
    const summaryCount = pages.filter((p) => p.startsWith("project-summary:")).length;
    const detailCount = pages.filter((p) => p.startsWith("project-detail:")).length;
    expect(summaryCount).toBe(10);
    expect(detailCount).toBe(10);
  });

  it("프로젝트 인덱스가 연속적이어야 한다", () => {
    const pages = buildDefaultPages({ projectCount: 5, photoCount: 0, bookType: "individual" });
    const summaryIndices = pages
      .filter((p) => p.startsWith("project-summary:"))
      .map((p) => getBlockIndex(p));
    expect(summaryIndices).toEqual([0, 1, 2, 3, 4]);
  });
});
