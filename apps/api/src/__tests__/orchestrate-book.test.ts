import { describe, expect, it, vi, beforeEach } from "vitest";

import type { EditSessionInput } from "../lib/payload-mapper.js";
import type { SweetBookClient } from "../lib/sweetbook-api.js";
import type { Cohort } from "../data/cohorts.js";
import { orchestrateBook, OrchestrationError } from "../lib/orchestrate-book.js";

// ────────────────────────────────────────────────
// 픽스처
// ────────────────────────────────────────────────

const mockCohort: Cohort = {
  id: "cohort-test",
  name: "웹 풀스택 5기",
  program: "SweetBootcamp Web Fullstack",
  graduationDate: "2026-04-30",
  summary: "테스트 기수",
  tagline: "테스트",
  students: [
    {
      id: "student-001",
      name: "김코드",
      roleTrack: "풀스택",
      bio: "자기소개",
      techStack: ["TypeScript"],
      projects: [
        {
          title: "StudyFlow",
          summary: "스터디 운영 자동화",
          contribution: "백엔드 API 설계",
          links: [],
        },
      ],
      retrospective: "회고",
      mentorComment: "멘토",
      photos: ["https://example.com/photo1.jpg"],
      certificateMessage: "축하합니다.",
    },
  ],
};

function makeSession(
  overrides: Partial<EditSessionInput> = {}
): EditSessionInput {
  return {
    bookType: "individual",
    customText: {
      coverTitle: "김코드의 포트폴리오 북",
      graduationMessage: "축하합니다.",
    },
    hiddenBlocks: [],
    pages: ["project:0"],
    ...overrides,
  };
}

function makeClient(overrides: Partial<SweetBookClient> = {}): SweetBookClient {
  return {
    createDraft: vi.fn().mockResolvedValue({ bookUid: "book-abc-123" }),
    createCover: vi.fn().mockResolvedValue(undefined),
    addContentsPage: vi.fn().mockResolvedValue(undefined),
    finalize: vi.fn().mockResolvedValue(undefined),
    getCredits: vi.fn().mockResolvedValue({ balance: 1000000, currency: "KRW" }),
    createOrder: vi.fn().mockResolvedValue({ orderUid: "order-abc-123", status: "completed" }),
    ...overrides,
  };
}

// ────────────────────────────────────────────────
// 정상 흐름
// ────────────────────────────────────────────────

describe("orchestrateBook — 정상 흐름", () => {
  it("4단계가 순서대로 호출되어야 한다", async () => {
    const client = makeClient();
    const callOrder: string[] = [];
    (client.createDraft as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      callOrder.push("draft");
      return { bookUid: "book-abc-123" };
    });
    (client.createCover as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      callOrder.push("cover");
    });
    (client.addContentsPage as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      callOrder.push("contents");
    });
    (client.finalize as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      callOrder.push("finalize");
    });

    await orchestrateBook(
      { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "key-1" },
      client,
      [mockCohort]
    );

    expect(callOrder[0]).toBe("draft");
    expect(callOrder[1]).toBe("cover");
    expect(callOrder[callOrder.length - 1]).toBe("finalize");
  });

  it("반환값이 { bookUid, status: 'completed' }여야 한다", async () => {
    const client = makeClient();
    const result = await orchestrateBook(
      { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "key-1" },
      client,
      [mockCohort]
    );
    expect(result.bookUid).toBe("book-abc-123");
    expect(result.status).toBe("completed");
  });

  it("createDraft에 -draft 접미사 idempotencyKey가 전달되어야 한다", async () => {
    const client = makeClient();
    await orchestrateBook(
      { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    expect(client.createDraft).toHaveBeenCalledWith("k1-draft");
  });

  it("createCover에 -cover 접미사 idempotencyKey가 전달되어야 한다", async () => {
    const client = makeClient();
    await orchestrateBook(
      { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    expect(client.createCover).toHaveBeenCalledWith(
      "book-abc-123",
      "k1-cover",
      expect.any(Object)
    );
  });

  it("내지 N개에 대해 addContentsPage가 N번 호출되어야 한다", async () => {
    const client = makeClient();
    const session = makeSession({ pages: ["project:0"] });
    await orchestrateBook(
      { session, cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    // pages=1 → visiblePages=1 → adjustPageCount(2) = 24 → 23 blank 보강 → total 23 contents
    expect(client.addContentsPage).toHaveBeenCalledTimes(23);
  });

  it("내지 첫 번째 호출에 -contents-0 접미사가 전달되어야 한다", async () => {
    const client = makeClient();
    await orchestrateBook(
      { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    expect(client.addContentsPage).toHaveBeenNthCalledWith(
      1,
      "book-abc-123",
      "k1-contents-0",
      expect.any(Object)
    );
  });

  it("finalize에 -finalize 접미사 idempotencyKey가 전달되어야 한다", async () => {
    const client = makeClient();
    await orchestrateBook(
      { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    expect(client.finalize).toHaveBeenCalledWith("book-abc-123", "k1-finalize");
  });
});

// ────────────────────────────────────────────────
// 에러 처리
// ────────────────────────────────────────────────

describe("orchestrateBook — 에러 처리", () => {
  it("존재하지 않는 cohortId는 OrchestrationError를 던져야 한다", async () => {
    const client = makeClient();
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "존재하지않는기수", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toBeInstanceOf(OrchestrationError);
  });

  it("createDraft 실패 시 step이 'draft'인 OrchestrationError를 던져야 한다", async () => {
    const client = makeClient({
      createDraft: vi.fn().mockRejectedValue(new Error("API 오류")),
    });
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toMatchObject({ step: "draft" });
  });

  it("createCover 실패 시 step이 'cover'인 OrchestrationError를 던져야 한다", async () => {
    const client = makeClient({
      createCover: vi.fn().mockRejectedValue(new Error("표지 API 오류")),
    });
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toMatchObject({ step: "cover" });
  });

  it("addContentsPage 실패 시 step이 'contents'인 OrchestrationError를 던져야 한다", async () => {
    const client = makeClient({
      addContentsPage: vi.fn().mockRejectedValue(new Error("내지 API 오류")),
    });
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toMatchObject({ step: "contents" });
  });

  it("finalize 실패 시 step이 'finalize'인 OrchestrationError를 던져야 한다", async () => {
    const client = makeClient({
      finalize: vi.fn().mockRejectedValue(new Error("최종화 API 오류")),
    });
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toMatchObject({ step: "finalize" });
  });

  it("createDraft 실패 시 이후 단계가 호출되지 않아야 한다", async () => {
    const client = makeClient({
      createDraft: vi.fn().mockRejectedValue(new Error("오류")),
    });
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toThrow();
    expect(client.createCover).not.toHaveBeenCalled();
    expect(client.addContentsPage).not.toHaveBeenCalled();
    expect(client.finalize).not.toHaveBeenCalled();
  });

  it("createCover 실패 시 내지 및 최종화가 호출되지 않아야 한다", async () => {
    const client = makeClient({
      createCover: vi.fn().mockRejectedValue(new Error("오류")),
    });
    await expect(
      orchestrateBook(
        { session: makeSession(), cohortId: "cohort-test", idempotencyKey: "k1" },
        client,
        [mockCohort]
      )
    ).rejects.toThrow();
    expect(client.addContentsPage).not.toHaveBeenCalled();
    expect(client.finalize).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────
// cohort-showcase
// ────────────────────────────────────────────────

describe("orchestrateBook — cohort-showcase", () => {
  it("studentId 없이 cohort-showcase로 정상 실행되어야 한다", async () => {
    const client = makeClient();
    const session = makeSession({ bookType: "cohort-showcase", pages: [] });
    const result = await orchestrateBook(
      { session, cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    expect(result.status).toBe("completed");
  });

  it("studentId가 cohort에 존재하지 않아도 에러 없이 완료되어야 한다", async () => {
    // 잘못된 studentId → student=undefined → payload-mapper fallback 경로
    const client = makeClient();
    const result = await orchestrateBook(
      {
        session: makeSession(),
        cohortId: "cohort-test",
        studentId: "존재하지않는학생",
        idempotencyKey: "k1",
      },
      client,
      [mockCohort]
    );
    expect(result.status).toBe("completed");
  });
});

// ────────────────────────────────────────────────
// idempotencyKey 인덱스 연속성
// ────────────────────────────────────────────────

describe("orchestrateBook — idempotencyKey 인덱스 연속성", () => {
  it("addContentsPage 마지막 호출(index N-1)에 올바른 접미사가 전달되어야 한다", async () => {
    // pages=1 → visiblePages=1 → adjustPageCount(2)=24 → 23 내지 (index 0~22)
    const client = makeClient();
    await orchestrateBook(
      { session: makeSession({ pages: ["project:0"] }), cohortId: "cohort-test", idempotencyKey: "k1" },
      client,
      [mockCohort]
    );
    const callCount = (client.addContentsPage as ReturnType<typeof vi.fn>).mock.calls.length;
    const lastCall = (client.addContentsPage as ReturnType<typeof vi.fn>).mock.calls[callCount - 1];
    expect(lastCall[1]).toBe(`k1-contents-${callCount - 1}`);
  });
});
