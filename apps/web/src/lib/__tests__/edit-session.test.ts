import { describe, expect, it } from "vitest";

import {
  buildPhotoBlockId,
  buildProjectBlockId,
  createDefaultEditSession,
  isBlockHidden,
  toggleHiddenBlock
} from "@/lib/edit-session";

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
});

describe("buildProjectBlockId", () => {
  it("인덱스 0은 'project:0'을 반환해야 한다", () => {
    expect(buildProjectBlockId(0)).toBe("project:0");
  });

  it("인덱스 3은 'project:3'을 반환해야 한다", () => {
    expect(buildProjectBlockId(3)).toBe("project:3");
  });
});

describe("buildPhotoBlockId", () => {
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

describe("isBlockHidden", () => {
  it("hiddenBlocks에 포함된 blockId는 true를 반환해야 한다", () => {
    expect(isBlockHidden(["project:0", "photo:1"], "project:0")).toBe(true);
  });

  it("hiddenBlocks에 없는 blockId는 false를 반환해야 한다", () => {
    expect(isBlockHidden(["project:0"], "project:1")).toBe(false);
  });

  it("빈 hiddenBlocks에서는 항상 false를 반환해야 한다", () => {
    expect(isBlockHidden([], "project:0")).toBe(false);
  });
});

describe("toggleHiddenBlock", () => {
  it("없는 blockId를 전달하면 배열에 추가해야 한다", () => {
    const result = toggleHiddenBlock([], "project:0");
    expect(result).toContain("project:0");
    expect(result).toHaveLength(1);
  });

  it("이미 있는 blockId를 전달하면 배열에서 제거해야 한다", () => {
    const result = toggleHiddenBlock(["project:0", "project:1"], "project:0");
    expect(result).not.toContain("project:0");
    expect(result).toContain("project:1");
  });

  it("원본 배열을 변경하지 않고 새 배열을 반환해야 한다", () => {
    const original = ["project:0"];
    const result = toggleHiddenBlock(original, "project:1");
    expect(result).not.toBe(original);
    expect(original).toHaveLength(1);
  });

  it("여러 번 토글하면 원래 상태로 돌아와야 한다", () => {
    const after1 = toggleHiddenBlock([], "project:0");
    const after2 = toggleHiddenBlock(after1, "project:0");
    expect(after2).not.toContain("project:0");
    expect(after2).toHaveLength(0);
  });
});
