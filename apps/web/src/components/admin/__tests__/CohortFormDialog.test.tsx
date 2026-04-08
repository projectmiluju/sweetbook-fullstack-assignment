// @vitest-environment happy-dom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CohortFormDialog from "../CohortFormDialog";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockOk(body: object) {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
}

const VALID_COHORT = {
  id: "c1",
  name: "기수1",
  program: "프로그램",
  graduationDate: "2026-04-30",
  summary: "요약",
  tagline: "태그",
};

describe("CohortFormDialog", () => {
  it("isOpen=false이면 렌더링하지 않아야 한다", () => {
    const { container } = render(
      <CohortFormDialog isOpen={false} onClose={() => {}} onSuccess={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  describe("create 모드 (initial 없음)", () => {
    it("제목이 '기수 추가'여야 한다", () => {
      render(
        <CohortFormDialog isOpen={true} onClose={() => {}} onSuccess={() => {}} />
      );
      expect(screen.getByText("기수 추가")).toBeDefined();
    });

    it("submit 버튼이 '추가'여야 한다", () => {
      render(
        <CohortFormDialog isOpen={true} onClose={() => {}} onSuccess={() => {}} />
      );
      expect(screen.getByRole("button", { name: "추가" })).toBeDefined();
    });

    it("submit 시 POST /api/cohorts를 호출해야 한다", async () => {
      mockOk({ cohort: VALID_COHORT });
      const onSuccess = vi.fn();
      const onClose = vi.fn();
      render(
        <CohortFormDialog
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      );

      fireEvent.change(screen.getByLabelText(/기수 이름/), { target: { value: "기수1" } });
      fireEvent.change(screen.getByLabelText(/과정명/), { target: { value: "프로그램" } });
      fireEvent.change(screen.getByLabelText(/수료일/), { target: { value: "2026-04-30" } });
      fireEvent.change(screen.getByLabelText(/요약/), { target: { value: "요약" } });
      fireEvent.change(screen.getByLabelText(/태그라인/), { target: { value: "태그" } });

      fireEvent.click(screen.getByRole("button", { name: "추가" }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
      });

      const call = vi.mocked(fetch).mock.calls[0];
      expect(String(call[0])).toContain("/api/cohorts");
      expect(String(call[0])).not.toContain("/api/cohorts/c1");
      expect(call[1]?.method).toBe("POST");
    });
  });

  describe("edit 모드 (initial.id 있음)", () => {
    const initial = { ...VALID_COHORT };

    it("제목이 '기수 수정'이어야 한다", () => {
      render(
        <CohortFormDialog
          isOpen={true}
          onClose={() => {}}
          onSuccess={() => {}}
          initial={initial}
        />
      );
      expect(screen.getByText("기수 수정")).toBeDefined();
    });

    it("submit 버튼이 '수정'이어야 한다", () => {
      render(
        <CohortFormDialog
          isOpen={true}
          onClose={() => {}}
          onSuccess={() => {}}
          initial={initial}
        />
      );
      expect(screen.getByRole("button", { name: "수정" })).toBeDefined();
    });

    it("초기 값이 폼에 채워져야 한다", () => {
      render(
        <CohortFormDialog
          isOpen={true}
          onClose={() => {}}
          onSuccess={() => {}}
          initial={initial}
        />
      );
      const nameInput = screen.getByLabelText(/기수 이름/) as HTMLInputElement;
      expect(nameInput.value).toBe("기수1");
    });

    it("submit 시 PATCH /api/cohorts/:id를 호출해야 한다", async () => {
      mockOk({ cohort: VALID_COHORT });
      render(
        <CohortFormDialog
          isOpen={true}
          onClose={() => {}}
          onSuccess={() => {}}
          initial={initial}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "수정" }));
      await waitFor(() => {
        const call = vi.mocked(fetch).mock.calls[0];
        expect(String(call[0])).toContain("/api/cohorts/c1");
        expect(call[1]?.method).toBe("PATCH");
      });
    });
  });

  describe("에러 처리", () => {
    it("API 실패 시 에러 메시지가 표시되고 모달이 유지되어야 한다", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "이름이 필요합니다" }),
      } as Response);
      const onClose = vi.fn();
      const onSuccess = vi.fn();
      render(
        <CohortFormDialog
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          initial={VALID_COHORT}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "수정" }));
      await waitFor(() => {
        expect(screen.getByText("이름이 필요합니다")).toBeDefined();
      });
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
