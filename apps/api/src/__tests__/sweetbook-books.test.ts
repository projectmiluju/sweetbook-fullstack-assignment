import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("../config/env.js", () => ({
  getEnv: () => ({
    BOOK_SPEC_UID: "PHOTOBOOK_A4_SC",
  }),
}));

import { createSweetBookClient } from "../lib/sweetbook-api.js";

const BASE_URL = "https://api-sandbox.sweetbook.com/v1";
const API_KEY = "test-api-key";

const MOCK_COVER_PAYLOAD = {
  templateUid: "cover-template-uid",
  parameters: { coverPhoto: "https://example.com/photo.jpg", subtitle: "김코드", dateRange: "2026-04-30" },
};

const MOCK_CONTENTS_PAYLOAD = {
  templateUid: "contents-template-uid",
  parameters: { monthNum: "04", dayNum: "30", diaryText: "김코드" },
};

// ────────────────────────────────────────────────
// createDraft
// ────────────────────────────────────────────────

describe("createDraft", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("중첩 data.bookUid 응답을 올바르게 파싱해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { bookUid: "book-abc-123" } }),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.createDraft("key-1");

    expect(result.bookUid).toBe("book-abc-123");
  });

  it("flat bookUid 응답도 올바르게 파싱해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-flat-456" }),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.createDraft("key-2");

    expect(result.bookUid).toBe("book-flat-456");
  });

  it("data.uid 필드도 fallback으로 파싱해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { uid: "book-uid-789" } }),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.createDraft("key-3");

    expect(result.bookUid).toBe("book-uid-789");
  });

  it("POST /books URL로 요청해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { bookUid: "book-abc" } }),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createDraft("key-1");

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/books`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("Idempotency-Key 헤더가 포함되어야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { bookUid: "book-abc" } }),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createDraft("my-idempotency-key");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "Idempotency-Key": "my-idempotency-key" }),
      })
    );
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve("Unprocessable Entity"),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(client.createDraft("key-1")).rejects.toThrow();
  });
});

// ────────────────────────────────────────────────
// createCover
// ────────────────────────────────────────────────

describe("createCover", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("성공 시 undefined를 반환해야 한다 (void)", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.createCover("book-abc", "key-cover", MOCK_COVER_PAYLOAD);

    expect(result).toBeUndefined();
  });

  it("POST /books/:uid/cover URL로 요청해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createCover("book-abc-123", "key-cover", MOCK_COVER_PAYLOAD);

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/books/book-abc-123/cover`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("Idempotency-Key 헤더가 포함되어야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createCover("book-abc", "cover-key-xyz", MOCK_COVER_PAYLOAD);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "Idempotency-Key": "cover-key-xyz" }),
      })
    );
  });

  it("FormData body로 요청해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createCover("book-abc", "key-cover", MOCK_COVER_PAYLOAD);

    const [, options] = vi.mocked(fetch).mock.calls[0];
    expect(options?.body).toBeInstanceOf(FormData);
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("templateUid required"),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(
      client.createCover("book-abc", "key-cover", MOCK_COVER_PAYLOAD)
    ).rejects.toThrow();
  });
});

// ────────────────────────────────────────────────
// addContentsPage
// ────────────────────────────────────────────────

describe("addContentsPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("성공 시 undefined를 반환해야 한다 (void)", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.addContentsPage("book-abc", "key-contents-0", MOCK_CONTENTS_PAYLOAD);

    expect(result).toBeUndefined();
  });

  it("POST /books/:uid/contents URL로 요청해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.addContentsPage("book-abc-123", "key-contents-0", MOCK_CONTENTS_PAYLOAD);

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/books/book-abc-123/contents`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("Idempotency-Key 헤더가 포함되어야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.addContentsPage("book-abc", "contents-key-5", MOCK_CONTENTS_PAYLOAD);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "Idempotency-Key": "contents-key-5" }),
      })
    );
  });

  it("FormData body로 요청해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.addContentsPage("book-abc", "key-0", MOCK_CONTENTS_PAYLOAD);

    const [, options] = vi.mocked(fetch).mock.calls[0];
    expect(options?.body).toBeInstanceOf(FormData);
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Bad Request"),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(
      client.addContentsPage("book-abc", "key-0", MOCK_CONTENTS_PAYLOAD)
    ).rejects.toThrow();
  });
});

// ────────────────────────────────────────────────
// finalize
// ────────────────────────────────────────────────

describe("finalize", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("성공 시 undefined를 반환해야 한다 (void)", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.finalize("book-abc", "key-finalize");

    expect(result).toBeUndefined();
  });

  it("POST /books/:uid/finalization URL로 요청해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.finalize("book-abc-123", "key-finalize");

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/books/book-abc-123/finalization`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("Idempotency-Key 헤더가 포함되어야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.finalize("book-abc", "finalize-key-xyz");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "Idempotency-Key": "finalize-key-xyz" }),
      })
    );
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve("pageCount 미달"),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(client.finalize("book-abc", "key-finalize")).rejects.toThrow();
  });

  it("에러 메시지에 step 정보가 포함되어야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve("pageCount 미달"),
    } as Response);

    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(client.finalize("book-abc", "key-finalize")).rejects.toThrow(/최종화/);
  });
});
