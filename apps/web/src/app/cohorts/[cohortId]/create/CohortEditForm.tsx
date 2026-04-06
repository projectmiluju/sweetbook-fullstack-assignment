"use client";

import { useState } from "react";

import { createBook } from "@/lib/api";
import type { BookTypeId } from "@/lib/book-types";
import { BOOK_TYPE_LABELS } from "@/lib/book-types";
import { createDefaultEditSession } from "@/lib/edit-session";
import type { EditSession } from "@/lib/edit-session";

type BookCreateStatus = "idle" | "loading" | "success" | "error";

const TEXT = {
  complete: "편집 완료",
  loading: "책 생성 중...",
  retry: "다시 시도",
  successLabel: "책 생성 완료",
  orderLabel: "주문하기 (준비 중)",
} as const;

interface CohortEditFormProps {
  bookType: BookTypeId;
  cohortId: string;
  cohortName: string;
  cohortSummary: string;
}

export default function CohortEditForm({ bookType, cohortId, cohortName, cohortSummary }: CohortEditFormProps) {
  const [session, setSession] = useState<EditSession>(() => ({
    ...createDefaultEditSession(bookType, cohortName),
    customText: {
      coverTitle: cohortName,
      graduationMessage: "",
      cohortIntro: cohortSummary,
      staffMessage: `${cohortName} 기수의 수료를 진심으로 축하합니다.`
    }
  }));
  const [bookStatus, setBookStatus] = useState<BookCreateStatus>("idle");
  const [bookUid, setBookUid] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookTypeInfo = BOOK_TYPE_LABELS[bookType];

  function handleCoverTitleChange(value: string) {
    setSession((prev) => ({
      ...prev,
      customText: { ...prev.customText, coverTitle: value }
    }));
  }

  function handleCohortIntroChange(value: string) {
    setSession((prev) => ({
      ...prev,
      customText: { ...prev.customText, cohortIntro: value }
    }));
  }

  function handleStaffMessageChange(value: string) {
    setSession((prev) => ({
      ...prev,
      customText: { ...prev.customText, staffMessage: value }
    }));
  }

  async function handleComplete() {
    if (bookStatus === "loading") return;
    setBookStatus("loading");
    setErrorMessage(null);
    try {
      const result = await createBook({
        session,
        cohortId,
        idempotencyKey: `${cohortId}-${Date.now()}`,
      });
      setBookUid(result.bookUid);
      setBookStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "책 생성에 실패했습니다.");
      setBookStatus("error");
    }
  }

  return (
    <aside className="rounded-[1.75rem] bg-[linear-gradient(145deg,#fffaf1,#f4e7cf)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
      <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">편집</p>
      <h2 className="font-display mt-3 text-2xl tracking-tight text-neutral-950">{bookTypeInfo.title}</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="cohortCoverTitle"
            className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase"
          >
            표지 제목
          </label>
          <textarea
            id="cohortCoverTitle"
            value={session.customText.coverTitle}
            onChange={(e) => handleCoverTitleChange(e.target.value)}
            rows={2}
            className="mt-2 w-full resize-none rounded-[1rem] border border-black/8 bg-white/70 px-3 py-2 text-sm text-neutral-950 placeholder-neutral-400 outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="cohortIntro"
            className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase"
          >
            기수 소개
          </label>
          <textarea
            id="cohortIntro"
            value={session.customText.cohortIntro ?? ""}
            onChange={(e) => handleCohortIntroChange(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-[1rem] border border-black/8 bg-white/70 px-3 py-2 text-sm text-neutral-950 placeholder-neutral-400 outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="staffMessage"
            className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase"
          >
            운영진 메시지
          </label>
          <textarea
            id="staffMessage"
            value={session.customText.staffMessage ?? ""}
            onChange={(e) => handleStaffMessageChange(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-[1rem] border border-black/8 bg-white/70 px-3 py-2 text-sm text-neutral-950 placeholder-neutral-400 outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>
      </div>

      {bookStatus === "success" && bookUid ? (
        <div className="mt-6 space-y-3">
          <div className="rounded-[1rem] border border-[color:var(--accent)]/20 bg-white/70 px-4 py-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase">
              {TEXT.successLabel}
            </p>
            <p className="mt-1 break-all text-xs text-neutral-500">{bookUid}</p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center rounded-full bg-neutral-200 px-5 py-3 text-sm font-medium text-neutral-400 cursor-not-allowed"
          >
            {TEXT.orderLabel}
          </button>
        </div>
      ) : (
        <>
          {bookStatus === "error" && errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={() => { void handleComplete(); }}
            disabled={bookStatus === "loading"}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {bookStatus === "loading"
              ? TEXT.loading
              : bookStatus === "error"
                ? TEXT.retry
                : TEXT.complete}
          </button>
        </>
      )}
    </aside>
  );
}
