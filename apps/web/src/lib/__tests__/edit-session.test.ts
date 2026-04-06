import { describe, expect, it } from "vitest";

import { createDefaultEditSession } from "@/lib/edit-session";

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
