"use client";

import { useState } from "react";

import type { BookTypeId } from "@/lib/book-types";
import { BOOK_TYPE_LABELS } from "@/lib/book-types";
import { createDefaultEditSession } from "@/lib/edit-session";
import type { EditSession } from "@/lib/edit-session";

interface CohortEditFormProps {
  bookType: BookTypeId;
  cohortName: string;
  cohortSummary: string;
}

export default function CohortEditForm({ bookType, cohortName, cohortSummary }: CohortEditFormProps) {
  const [session, setSession] = useState<EditSession>(() => ({
    ...createDefaultEditSession(bookType, cohortName),
    customText: {
      coverTitle: cohortName,
      graduationMessage: "",
      cohortIntro: cohortSummary,
      staffMessage: `${cohortName} 기수의 수료를 진심으로 축하합니다.`
    }
  }));

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

  function handleComplete() {
    // Epic #4에서 API 호출로 전환 예정
    void session;
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

      <button
        onClick={handleComplete}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white"
      >
        편집 완료
      </button>
    </aside>
  );
}
