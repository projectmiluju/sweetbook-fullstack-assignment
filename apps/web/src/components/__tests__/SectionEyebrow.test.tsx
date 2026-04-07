// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionEyebrow } from "../SectionEyebrow";

describe("SectionEyebrow", () => {
  it("전달받은 텍스트를 렌더링해야 한다", () => {
    render(<SectionEyebrow>운영자 대시보드</SectionEyebrow>);
    expect(screen.getByText("운영자 대시보드")).toBeDefined();
  });

  it("uppercase 스타일이 적용되어야 한다", () => {
    render(<SectionEyebrow>Portfolio</SectionEyebrow>);
    const element = screen.getByText("Portfolio");
    expect(element.className).toContain("uppercase");
  });

  it("accent 색상 클래스가 적용되어야 한다", () => {
    render(<SectionEyebrow>테스트</SectionEyebrow>);
    const element = screen.getByText("테스트");
    expect(element.className).toContain("accent");
  });
});
