// @vitest-environment happy-dom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BookPreview from "../BookPreview";
import { TEMPLATES } from "../templates";
import { createDefaultEditSession } from "@/lib/edit-session";

const PHOTO_URL = "https://example.com/photo.jpg";

const MOCK_PAYLOAD = {
  cover: {
    templateUid: TEMPLATES.cover.templateUid,
    parameters: {
      coverPhoto: PHOTO_URL,
      subtitle: "김코드",
      dateRange: "2026-04-30",
    },
  },
  contents: [
    {
      templateUid: TEMPLATES.contentB.templateUid,
      parameters: {
        monthNum: "04",
        dayNum: "25",
        diaryText: "기념 수료 페이지",
      },
    },
    {
      templateUid: TEMPLATES.contentA.templateUid,
      parameters: {
        monthNum: "04",
        dayNum: "25",
        diaryText: "수료생 소개",
        photo: PHOTO_URL,
      },
    },
  ],
};

function makeSession() {
  return createDefaultEditSession("individual", "김코드");
}

describe("BookPreview", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("isOpen=false", () => {
    it("isOpen이 false이면 아무것도 렌더링하지 않아야 한다", () => {
      const { container } = render(
        <BookPreview
          isOpen={false}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("성공 케이스", () => {
    beforeEach(() => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => MOCK_PAYLOAD,
      } as Response);
    });

    it("모달이 dialog role로 렌더링되어야 한다", async () => {
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeDefined();
      });
    });

    it("로딩 상태에서 '프리뷰를 불러오는 중...' 텍스트를 표시해야 한다", () => {
      // fetch가 즉시 resolve되지 않도록 pending Promise
      globalThis.fetch = vi.fn(() => new Promise<Response>(() => {}));
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      expect(screen.getByText(/프리뷰를 불러오는 중/)).toBeDefined();
    });

    it("성공 시 페이지 N/M 표시가 1/3이어야 한다 (cover 1 + contents 2)", async () => {
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByText("1 / 3")).toBeDefined();
      });
    });

    it("다음 버튼 클릭 시 페이지 인덱스가 증가해야 한다", async () => {
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByText("1 / 3")).toBeDefined();
      });
      fireEvent.click(screen.getByRole("button", { name: "다음" }));
      expect(screen.getByText("2 / 3")).toBeDefined();
    });

    it("첫 페이지에서 이전 버튼이 disabled여야 한다", async () => {
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByText("1 / 3")).toBeDefined();
      });
      const prevBtn = screen.getByRole("button", { name: "이전" });
      expect(prevBtn).toHaveProperty("disabled", true);
    });

    it("마지막 페이지에서 다음 버튼이 disabled여야 한다", async () => {
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByText("1 / 3")).toBeDefined();
      });
      // 끝까지 이동
      fireEvent.click(screen.getByRole("button", { name: "다음" }));
      fireEvent.click(screen.getByRole("button", { name: "다음" }));
      const nextBtn = screen.getByRole("button", { name: "다음" });
      expect(nextBtn).toHaveProperty("disabled", true);
    });

    it("닫기 버튼 클릭 시 onClose가 호출되어야 한다", async () => {
      const onClose = vi.fn();
      render(
        <BookPreview
          isOpen={true}
          onClose={onClose}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeDefined();
      });
      fireEvent.click(screen.getByRole("button", { name: "닫기" }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("에러 케이스", () => {
    it("fetch 실패 시 에러 메시지와 재시도 버튼을 표시해야 한다", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("네트워크 오류"));
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByText(/네트워크 오류/)).toBeDefined();
        expect(screen.getByRole("button", { name: "다시 시도" })).toBeDefined();
      });
    });

    it("응답이 ok=false면 message를 표시해야 한다", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "기수를 찾을 수 없습니다." }),
      } as Response);
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="invalid"
        />
      );
      await waitFor(() => {
        expect(screen.getByText(/기수를 찾을 수 없습니다/)).toBeDefined();
      });
    });
  });

  describe("알 수 없는 templateUid", () => {
    it("응답에 알 수 없는 templateUid가 있으면 'unknown' 메시지를 표시해야 한다", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          cover: {
            templateUid: "UNKNOWN_UID",
            parameters: {},
          },
          contents: [],
        }),
      } as Response);
      render(
        <BookPreview
          isOpen={true}
          onClose={() => {}}
          session={makeSession()}
          cohortId="cohort-1"
        />
      );
      await waitFor(() => {
        expect(screen.getByText(/알 수 없는 템플릿/)).toBeDefined();
      });
    });
  });
});
