// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { toggleHiddenBlock } from "@/lib/edit-session";
import PageBlockList from "../PageBlockList";

describe("PageBlockList", () => {
  const defaultProps = {
    pages: ["certificate:0", "bio:0", "tech-stack:0"],
    hiddenBlocks: [],
    onToggle: vi.fn(),
    onMove: vi.fn(),
  };

  it("pages가 비어 있으면 아무것도 렌더링하지 않아야 한다", () => {
    const { container } = render(
      <PageBlockList {...defaultProps} pages={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("페이지 라벨이 한글로 표시되어야 한다", () => {
    render(<PageBlockList {...defaultProps} />);
    expect(screen.getByText("기념 수료")).toBeDefined();
    expect(screen.getByText("수료생 소개")).toBeDefined();
    expect(screen.getByText("기술 스택")).toBeDefined();
  });

  it("페이지 설명이 표시되어야 한다", () => {
    render(<PageBlockList {...defaultProps} />);
    expect(screen.getByText("수료생 이름·과정명·축하 문구")).toBeDefined();
    expect(screen.getByText("자기소개와 사진")).toBeDefined();
  });

  it("프로젝트 제목이 project-summary 라벨에 포함되어야 한다", () => {
    render(
      <PageBlockList
        {...defaultProps}
        pages={["project-summary:0"]}
        projectTitles={["StudyFlow"]}
      />
    );
    expect(screen.getByText("프로젝트 요약 — StudyFlow")).toBeDefined();
  });

  it("hiddenBlocks에 포함된 페이지는 '제외' 라벨을 표시해야 한다", () => {
    render(
      <PageBlockList
        {...defaultProps}
        hiddenBlocks={["bio:0"]}
      />
    );
    const buttons = screen.getAllByRole("button", { name: /포함|제외/ });
    const excludeButton = buttons.find((b) => b.textContent === "제외");
    expect(excludeButton).toBeDefined();
  });

  it("hiddenBlocks에 없는 페이지는 '포함' 라벨을 표시해야 한다", () => {
    render(<PageBlockList {...defaultProps} />);
    const includeButtons = screen
      .getAllByRole("button", { name: /포함|제외/ })
      .filter((b) => b.textContent === "포함");
    expect(includeButtons.length).toBe(3);
  });

  it("토글 버튼 클릭 시 onToggle이 해당 blockId로 호출되어야 한다", () => {
    const onToggle = vi.fn();
    render(<PageBlockList {...defaultProps} onToggle={onToggle} />);
    const toggleButtons = screen
      .getAllByRole("button", { name: /포함|제외/ });
    fireEvent.click(toggleButtons[0]);
    expect(onToggle).toHaveBeenCalledWith("certificate:0");
  });

  it("위로 이동 버튼 클릭 시 onMove가 호출되어야 한다", () => {
    const onMove = vi.fn();
    render(<PageBlockList {...defaultProps} onMove={onMove} />);
    const upButtons = screen.getAllByRole("button", { name: "위로 이동" });
    fireEvent.click(upButtons[1]); // 두 번째 페이지를 위로 이동
    expect(onMove).toHaveBeenCalledWith(1, "up");
  });

  it("아래로 이동 버튼 클릭 시 onMove가 호출되어야 한다", () => {
    const onMove = vi.fn();
    render(<PageBlockList {...defaultProps} onMove={onMove} />);
    const downButtons = screen.getAllByRole("button", { name: "아래로 이동" });
    fireEvent.click(downButtons[0]);
    expect(onMove).toHaveBeenCalledWith(0, "down");
  });

  it("첫 번째 페이지의 '위로 이동' 버튼은 비활성화되어야 한다", () => {
    render(<PageBlockList {...defaultProps} />);
    const upButtons = screen.getAllByRole("button", { name: "위로 이동" });
    expect(upButtons[0]).toHaveProperty("disabled", true);
  });

  it("마지막 페이지의 '아래로 이동' 버튼은 비활성화되어야 한다", () => {
    render(<PageBlockList {...defaultProps} />);
    const downButtons = screen.getAllByRole("button", { name: "아래로 이동" });
    expect(downButtons[downButtons.length - 1]).toHaveProperty("disabled", true);
  });

  // ════════════════════════════════════════════════
  // QA: 동일 type + 다른 index 시나리오 (cohort-intro 케이스)
  // ════════════════════════════════════════════════

  it("동일 타입의 여러 페이지(cohort-intro:0/1/2)가 모두 렌더링되어야 한다", () => {
    const pages = ["cohort-intro:0", "cohort-intro:1", "cohort-intro:2"];
    render(<PageBlockList {...defaultProps} pages={pages} />);

    // 각각 다른 라벨로 표시되어야 함
    expect(screen.getByText("부트캠프 소개")).toBeDefined();
    expect(screen.getByText("부트캠프 소개 2")).toBeDefined();
    expect(screen.getByText("부트캠프 소개 3")).toBeDefined();
  });

  it("동일 타입 페이지에서 특정 인덱스만 토글되어야 한다", () => {
    const onToggle = vi.fn();
    const pages = ["cohort-intro:0", "cohort-intro:1", "cohort-intro:2"];
    render(<PageBlockList {...defaultProps} pages={pages} onToggle={onToggle} />);

    const toggleButtons = screen.getAllByRole("button", { name: /포함|제외/ });
    fireEvent.click(toggleButtons[1]); // 두 번째 (cohort-intro:1) 토글

    expect(onToggle).toHaveBeenCalledWith("cohort-intro:1");
    expect(onToggle).not.toHaveBeenCalledWith("cohort-intro:0");
    expect(onToggle).not.toHaveBeenCalledWith("cohort-intro:2");
  });

  it("동일 타입 페이지에서 특정 인덱스만 hidden 상태가 되어야 한다", () => {
    const pages = ["cohort-intro:0", "cohort-intro:1", "cohort-intro:2"];
    render(
      <PageBlockList
        {...defaultProps}
        pages={pages}
        hiddenBlocks={["cohort-intro:1"]}
      />
    );

    const toggleButtons = screen
      .getAllByRole("button", { name: /포함|제외/ });
    expect(toggleButtons[0].textContent).toBe("포함");
    expect(toggleButtons[1].textContent).toBe("제외");
    expect(toggleButtons[2].textContent).toBe("포함");
  });

  // ════════════════════════════════════════════════
  // QA: 토글 상태 변화 통합 시나리오
  // ════════════════════════════════════════════════

  function StatefulWrapper({ initialPages }: { initialPages: string[] }) {
    const [hidden, setHidden] = useState<string[]>([]);
    return (
      <PageBlockList
        pages={initialPages}
        hiddenBlocks={hidden}
        onToggle={(id) => setHidden((prev) => toggleHiddenBlock(prev, id))}
        onMove={() => {}}
      />
    );
  }

  it("토글 클릭 후 라벨이 '포함' → '제외'로 변경되어야 한다", () => {
    render(<StatefulWrapper initialPages={["certificate:0"]} />);

    const toggleBtn = screen.getByRole("button", { name: /포함|제외/ });
    expect(toggleBtn.textContent).toBe("포함");

    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toBe("제외");
  });

  it("토글을 두 번 클릭하면 다시 '포함'으로 돌아와야 한다", () => {
    render(<StatefulWrapper initialPages={["certificate:0"]} />);

    const toggleBtn = screen.getByRole("button", { name: /포함|제외/ });
    fireEvent.click(toggleBtn);
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toBe("포함");
  });

  it("여러 페이지에서 한 페이지만 토글해도 다른 페이지는 영향을 받지 않아야 한다", () => {
    render(
      <StatefulWrapper
        initialPages={["certificate:0", "bio:0", "tech-stack:0"]}
      />
    );

    const toggleButtons = screen
      .getAllByRole("button", { name: /포함|제외/ });
    fireEvent.click(toggleButtons[1]); // bio만 토글

    expect(toggleButtons[0].textContent).toBe("포함");
    expect(toggleButtons[1].textContent).toBe("제외");
    expect(toggleButtons[2].textContent).toBe("포함");
  });

  it("12종 페이지 모두 라벨과 설명이 함께 표시되어야 한다", () => {
    const allPages = [
      "certificate:0",
      "bio:0",
      "tech-stack:0",
      "project-summary:0",
      "project-detail:0",
      "retrospective:0",
      "mentor-comment:0",
      "photo-gallery:0",
      "cohort-intro:0",
      "thanks:0",
      "portfolio-links:0",
      "blank:0",
    ];
    render(<PageBlockList {...defaultProps} pages={allPages} />);

    expect(screen.getByText("기념 수료")).toBeDefined();
    expect(screen.getByText("회고")).toBeDefined();
    expect(screen.getByText("활동 사진")).toBeDefined();
    expect(screen.getByText("포트폴리오 링크")).toBeDefined();
    expect(screen.getByText("빈 페이지")).toBeDefined();
  });
});
