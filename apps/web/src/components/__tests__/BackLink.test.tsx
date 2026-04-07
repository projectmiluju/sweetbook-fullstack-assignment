// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BackLink } from "../BackLink";

describe("BackLink", () => {
  it("전달받은 텍스트를 렌더링해야 한다", () => {
    render(<BackLink href="/dashboard">대시보드로 돌아가기</BackLink>);
    expect(screen.getByText("대시보드로 돌아가기")).toBeDefined();
  });

  it("전달받은 href로 링크를 생성해야 한다", () => {
    render(<BackLink href="/dashboard">대시보드로 돌아가기</BackLink>);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  it("화살표 아이콘을 aria-hidden으로 렌더링해야 한다", () => {
    render(<BackLink href="/test">테스트</BackLink>);
    const arrow = screen.getByText("←");
    expect(arrow.getAttribute("aria-hidden")).toBe("true");
  });
});
