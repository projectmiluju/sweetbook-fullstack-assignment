import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { createSweetBookClient } from "../lib/sweetbook-api.js";

const BASE_URL = "https://api-sandbox.sweetbook.com/v1";
const API_KEY = "test-api-key";

const MOCK_SHIPPING = {
  recipientName: "김수령",
  recipientPhone: "01012345678",
  address1: "서울시 강남구 테헤란로 123",
  postalCode: "06234",
};

// ────────────────────────────────────────────────
// getCredits
// ────────────────────────────────────────────────

describe("getCredits", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("성공 응답 시 balance와 currency를 반환해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { balance: 1000000, currency: "KRW" } }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.getCredits();

    // Assert
    expect(result.balance).toBe(1000000);
    expect(result.currency).toBe("KRW");
  });

  it("GET /credits URL로 요청해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { balance: 500000, currency: "KRW" } }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.getCredits();

    // Assert
    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain("/credits");
  });

  it("Authorization 헤더가 포함되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { balance: 0, currency: "KRW" } }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.getCredits();

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe(`Bearer ${API_KEY}`);
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Unauthorized"),
    } as Response);

    // Act & Assert
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(client.getCredits()).rejects.toThrow();
  });

  it("data 래퍼 없는 flat 응답도 정상 파싱해야 한다", async () => {
    // Arrange — Credits API 일부 응답은 data 래퍼 없이 flat으로 올 수 있음
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ balance: 750000, currency: "KRW" }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.getCredits();

    // Assert
    expect(result.balance).toBe(750000);
    expect(result.currency).toBe("KRW");
  });
});

// ────────────────────────────────────────────────
// createOrder
// ────────────────────────────────────────────────

describe("createOrder", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("성공 응답 시 orderUid와 status를 반환해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderUid: "order-abc-123", status: "completed" }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.createOrder("idempotency-key-001", {
      bookUid: "book-xyz-789",
      shipping: MOCK_SHIPPING,
    });

    // Assert
    expect(result.orderUid).toBe("order-abc-123");
    expect(result.status).toBe("completed");
  });

  it("POST /orders URL로 요청해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderUid: "order-001", status: "completed" }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createOrder("key-001", { bookUid: "book-001", shipping: MOCK_SHIPPING });

    // Assert
    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain("/orders");
  });

  it("Idempotency-Key 헤더가 포함되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderUid: "order-001", status: "completed" }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createOrder("my-order-key", { bookUid: "book-001", shipping: MOCK_SHIPPING });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("my-order-key");
  });

  it("요청 바디에 Items[].bookUid와 Shipping 필드가 포함되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderUid: "order-001", status: "completed" }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createOrder("key-001", { bookUid: "book-xyz", shipping: MOCK_SHIPPING });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(options?.body as string) as {
      Items: Array<{ bookUid: string }>;
      Shipping: { RecipientName: string; RecipientPhone: string; Address1: string; PostalCode: string };
    };
    expect(body.Items[0].bookUid).toBe("book-xyz");
    expect(body.Shipping.RecipientName).toBe(MOCK_SHIPPING.recipientName);
    expect(body.Shipping.RecipientPhone).toBe(MOCK_SHIPPING.recipientPhone);
    expect(body.Shipping.Address1).toBe(MOCK_SHIPPING.address1);
    expect(body.Shipping.PostalCode).toBe(MOCK_SHIPPING.postalCode);
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Book을 찾을 수 없습니다."),
    } as Response);

    // Act & Assert
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await expect(
      client.createOrder("key-001", { bookUid: "invalid", shipping: MOCK_SHIPPING })
    ).rejects.toThrow();
  });

  it("Content-Type 헤더가 application/json이어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderUid: "order-001", status: "completed" }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    await client.createOrder("key-001", { bookUid: "book-001", shipping: MOCK_SHIPPING });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("data 래퍼가 있는 응답도 정상 파싱해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { orderUid: "order-wrapped-001", status: "pending" } }),
      text: () => Promise.resolve(""),
    } as Response);

    // Act
    const client = createSweetBookClient(BASE_URL, API_KEY);
    const result = await client.createOrder("key-001", { bookUid: "book-001", shipping: MOCK_SHIPPING });

    // Assert
    expect(result.orderUid).toBe("order-wrapped-001");
    expect(result.status).toBe("pending");
  });
});
