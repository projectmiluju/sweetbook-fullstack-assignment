import { getEnv } from "../config/env.js";
import type { CoverPayload, ContentPagePayload } from "./payload-mapper.js";

export interface CreditsData {
  balance: number;
  currency: string;
}

export interface OrderShipping {
  recipientName: string;
  recipientPhone: string;
  address1: string;
  postalCode: string;
}

export interface CreateOrderPayload {
  bookUid: string;
  shipping: OrderShipping;
}

export interface OrderData {
  orderUid: string;
  status: string;
}

export interface SweetBookClient {
  createDraft(idempotencyKey: string): Promise<{ bookUid: string }>;
  createCover(
    bookUid: string,
    idempotencyKey: string,
    payload: CoverPayload
  ): Promise<void>;
  addContentsPage(
    bookUid: string,
    idempotencyKey: string,
    payload: ContentPagePayload
  ): Promise<void>;
  finalize(bookUid: string, idempotencyKey: string): Promise<void>;
  getCredits(): Promise<CreditsData>;
  createOrder(idempotencyKey: string, payload: CreateOrderPayload): Promise<OrderData>;
}

interface SweetBookApiError {
  message: string;
  status: number;
}

async function assertOk(response: Response, step: string): Promise<void> {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const error: SweetBookApiError = {
      message: `[${step}] SweetBook API 오류 ${response.status}: ${body}`,
      status: response.status,
    };
    throw error;
  }
}

export function createSweetBookClient(
  baseUrl: string,
  apiKey: string
): SweetBookClient {
  const headers = () => ({
    Authorization: `Bearer ${apiKey}`,
  });

  return {
    async createDraft(idempotencyKey) {
      const response = await fetch(`${baseUrl}/books`, {
        method: "POST",
        headers: {
          ...headers(),
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          title: "SweetBook Portfolio",
          bookSpecUid: getEnv().BOOK_SPEC_UID,
        }),
      });
      await assertOk(response, "초안 생성");
      const raw = (await response.json()) as { data?: { bookUid?: string; uid?: string }; bookUid?: string; uid?: string };
      const data = raw.data ?? raw;
      const bookUid = data.bookUid ?? data.uid ?? "";
      return { bookUid };
    },

    async createCover(bookUid, idempotencyKey, payload) {
      const form = new FormData();
      form.append("templateUid", payload.templateUid);
      if (Object.keys(payload.parameters).length > 0) {
        form.append("parameters", JSON.stringify(payload.parameters));
      }
      const response = await fetch(`${baseUrl}/books/${bookUid}/cover`, {
        method: "POST",
        headers: {
          ...headers(),
          "Idempotency-Key": idempotencyKey,
        },
        body: form,
      });
      await assertOk(response, "표지 생성");
    },

    async addContentsPage(bookUid, idempotencyKey, payload) {
      const form = new FormData();
      form.append("templateUid", payload.templateUid);
      if (Object.keys(payload.parameters).length > 0) {
        // collageGallery 파라미터(예: collagePhotos)는 payload-mapper에서
        // JSON 문자열로 들어오는데, 그대로 stringify하면 이중 인코딩되어
        // SweetBook이 빈 배열로 인식한다. JSON 문자열이면 parse해서 객체로 풀어준다.
        const params: Record<string, unknown> = { ...payload.parameters };
        for (const key of Object.keys(params)) {
          const value = params[key];
          if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
            try {
              const parsed: unknown = JSON.parse(value);
              if (Array.isArray(parsed)) {
                params[key] = parsed;
              }
            } catch {
              // JSON이 아닌 문자열이면 그대로 둠
            }
          }
        }
        form.append("parameters", JSON.stringify(params));
      }
      const response = await fetch(`${baseUrl}/books/${bookUid}/contents`, {
        method: "POST",
        headers: {
          ...headers(),
          "Idempotency-Key": idempotencyKey,
        },
        body: form,
      });
      await assertOk(response, "내지 추가");
    },

    async finalize(bookUid, idempotencyKey) {
      const response = await fetch(
        `${baseUrl}/books/${bookUid}/finalization`,
        {
          method: "POST",
          headers: {
            ...headers(),
            "Idempotency-Key": idempotencyKey,
          },
        }
      );
      await assertOk(response, "최종화");
    },

    async getCredits() {
      const response = await fetch(`${baseUrl}/credits`, {
        headers: headers(),
      });
      await assertOk(response, "잔액 조회");
      const body = (await response.json()) as { data?: { balance?: number; currency?: string }; balance?: number; currency?: string };
      const data = body.data ?? body;
      return {
        balance: data.balance ?? 0,
        currency: data.currency ?? "KRW",
      };
    },

    async createOrder(idempotencyKey, payload) {
      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          ...headers(),
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          Items: [{ bookUid: payload.bookUid }],
          Shipping: {
            RecipientName: payload.shipping.recipientName,
            RecipientPhone: payload.shipping.recipientPhone,
            Address1: payload.shipping.address1,
            PostalCode: payload.shipping.postalCode,
          },
        }),
      });
      await assertOk(response, "주문 생성");
      const body = (await response.json()) as { data?: { orderUid?: string; uid?: string; status?: string }; orderUid?: string; uid?: string; status?: string };
      const data = body.data ?? body;
      return {
        orderUid: data.orderUid ?? data.uid ?? "",
        status: data.status ?? "completed",
      };
    },
  };
}
