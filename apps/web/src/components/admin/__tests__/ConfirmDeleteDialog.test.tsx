// @vitest-environment happy-dom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

describe("ConfirmDeleteDialog", () => {
  it("isOpen이 false이면 아무것도 렌더링하지 않아야 한다", () => {
    const { container } = render(
      <ConfirmDeleteDialog
        isOpen={false}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="삭제"
        message="정말 삭제하시겠습니까?"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("title과 message를 표시해야 한다", () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={async () => {}}
        title="기수 삭제"
        message="이 기수가 영구 삭제됩니다."
      />
    );
    expect(screen.getByText("기수 삭제")).toBeDefined();
    expect(screen.getByText("이 기수가 영구 삭제됩니다.")).toBeDefined();
  });

  it("삭제 버튼 클릭 성공 시 onClose가 호출되어야 한다", async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="삭제"
        message="msg"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("API 실패 시 모달이 닫히지 않고 에러 메시지가 표시되어야 한다", async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn().mockRejectedValue(new Error("권한이 없습니다"));
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="삭제"
        message="msg"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() => {
      expect(screen.getByText("권한이 없습니다")).toBeDefined();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("취소 버튼 클릭 시 onClose가 호출되고 onConfirm은 호출되지 않아야 한다", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="삭제"
        message="msg"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("submitting 중에는 삭제 버튼이 '삭제 중...' 텍스트로 변경되어야 한다", async () => {
    let resolveConfirm: () => void = () => {};
    const onConfirm = vi.fn(
      () => new Promise<void>((res) => { resolveConfirm = res; })
    );
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        title="삭제"
        message="msg"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() => {
      expect(screen.getByText("삭제 중...")).toBeDefined();
    });
    resolveConfirm();
  });
});
