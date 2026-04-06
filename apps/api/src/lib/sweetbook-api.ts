import type { CoverPayload, ContentPagePayload } from "./payload-mapper.js";

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
          bookSpecUid: process.env.BOOK_SPEC_UID,
        }),
      });
      await assertOk(response, "초안 생성");
      const data = (await response.json()) as { bookUid?: string; uid?: string };
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
        form.append("parameters", JSON.stringify(payload.parameters));
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
  };
}
