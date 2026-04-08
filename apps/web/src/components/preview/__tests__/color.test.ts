import { describe, expect, it } from "vitest";

import { argbToRgba } from "../utils/color";

describe("argbToRgba", () => {
  it("불투명 흰색을 변환해야 한다", () => {
    expect(argbToRgba("#FFFFFFFF")).toBe("rgba(255, 255, 255, 1)");
  });

  it("불투명 검정을 변환해야 한다", () => {
    expect(argbToRgba("#FF000000")).toBe("rgba(0, 0, 0, 1)");
  });

  it("완전 투명을 변환해야 한다", () => {
    expect(argbToRgba("#00FFFFFF")).toBe("rgba(255, 255, 255, 0)");
  });

  it("반투명 빨강을 변환해야 한다", () => {
    expect(argbToRgba("#80FF0000")).toBe("rgba(255, 0, 0, 0.502)");
  });

  it("토프 색상(#FF8B7D6B)을 변환해야 한다", () => {
    expect(argbToRgba("#FF8B7D6B")).toBe("rgba(139, 125, 107, 1)");
  });

  it("# 없는 입력은 transparent를 반환해야 한다", () => {
    expect(argbToRgba("FFFFFFFF")).toBe("transparent");
  });

  it("8자리가 아닌 입력은 transparent를 반환해야 한다", () => {
    expect(argbToRgba("#FFF")).toBe("transparent");
    expect(argbToRgba("#FFFFFF")).toBe("transparent");
  });

  it("hex가 아닌 문자가 포함되면 transparent를 반환해야 한다", () => {
    expect(argbToRgba("#GGFFFFFF")).toBe("transparent");
  });

  it("빈 문자열은 transparent를 반환해야 한다", () => {
    expect(argbToRgba("")).toBe("transparent");
  });
});
