// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("제목과 메시지를 렌더링해야 한다", () => {
    render(
      <EmptyState
        title="등록된 기수가 없습니다"
        message="데이터가 준비되면 여기에 기수 목록이 표시됩니다."
      />
    );
    expect(screen.getByText("등록된 기수가 없습니다")).toBeDefined();
    expect(screen.getByText("데이터가 준비되면 여기에 기수 목록이 표시됩니다.")).toBeDefined();
  });

  it("빈 문자열 제목도 렌더링할 수 있어야 한다", () => {
    render(<EmptyState title="" message="메시지만 있는 경우" />);
    expect(screen.getByText("메시지만 있는 경우")).toBeDefined();
  });

  it("긴 한글 메시지가 잘리지 않고 렌더링되어야 한다", () => {
    const longMessage = "이 기수에 아직 등록된 수료생 데이터가 없습니다. 운영팀에서 데이터를 준비하면 이 화면에서 수료생 목록과 포트폴리오를 확인할 수 있습니다.";
    render(<EmptyState title="테스트" message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeDefined();
  });
});
