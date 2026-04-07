"use client";

import { useState } from "react";

import type { OrderShipping } from "@/lib/api";
import { createBook, createOrder } from "@/lib/api";
import type { BookTypeId } from "@/lib/book-types";
import { BOOK_TYPE_LABELS } from "@/lib/book-types";
import { createDefaultEditSession } from "@/lib/edit-session";
import type { EditSession } from "@/lib/edit-session";

type BookCreateStatus = "idle" | "loading" | "success" | "error";
type OrderStatus = "idle" | "loading" | "success" | "error";

const TEXT = {
  complete: "편집 완료",
  loading: "책 생성 중...",
  retry: "다시 시도",
  successLabel: "책 생성 완료",
  orderIdle: "주문하기",
  orderLoading: "주문 처리 중...",
  orderRetry: "다시 시도",
  orderSuccessLabel: "주문 완료",
  shippingTitle: "배송 정보",
  recipientName: "수령인 이름",
  recipientPhone: "전화번호",
  address1: "주소",
  postalCode: "우편번호",
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
  const [shipping, setShipping] = useState<OrderShipping>({
    recipientName: "",
    recipientPhone: "",
    address1: "",
    postalCode: "",
  });
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [orderUid, setOrderUid] = useState<string | null>(null);
  const [orderErrorMessage, setOrderErrorMessage] = useState<string | null>(null);

  const bookTypeInfo = BOOK_TYPE_LABELS[bookType];

  function handleCoverTitleChange(value: string) {
    setSession((prev) => ({ ...prev, customText: { ...prev.customText, coverTitle: value } }));
  }

  function handleCohortIntroChange(value: string) {
    setSession((prev) => ({ ...prev, customText: { ...prev.customText, cohortIntro: value } }));
  }

  function handleStaffMessageChange(value: string) {
    setSession((prev) => ({ ...prev, customText: { ...prev.customText, staffMessage: value } }));
  }

  async function handleOrder() {
    if (!bookUid || orderStatus === "loading") return;
    setOrderStatus("loading");
    setOrderErrorMessage(null);
    try {
      const result = await createOrder({
        bookUid,
        shipping,
        idempotencyKey: `${cohortId}-order-${Date.now()}`,
      });
      setOrderUid(result.orderUid);
      setOrderStatus("success");
    } catch (error) {
      setOrderErrorMessage(error instanceof Error ? error.message : "주문 생성에 실패했습니다.");
      setOrderStatus("error");
    }
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

  const inputClasses = "mt-2 w-full resize-none rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder-[color:var(--text-dim)] outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]";

  return (
    <aside className="animate-fade-up delay-2 rounded-2xl border border-[color:var(--accent)]/15 bg-gradient-to-b from-[color:var(--accent-soft)] to-[color:var(--surface)] p-7 shadow-[0_2px_16px_var(--shadow-tint)]">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">편집</p>
      <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)]">{bookTypeInfo.title}</h2>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="cohortCoverTitle" className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">표지 제목</label>
          <textarea id="cohortCoverTitle" value={session.customText.coverTitle} onChange={(e) => handleCoverTitleChange(e.target.value)} rows={2} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="cohortIntro" className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">기수 소개</label>
          <textarea id="cohortIntro" value={session.customText.cohortIntro ?? ""} onChange={(e) => handleCohortIntroChange(e.target.value)} rows={3} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="staffMessage" className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">운영진 메시지</label>
          <textarea id="staffMessage" value={session.customText.staffMessage ?? ""} onChange={(e) => handleStaffMessageChange(e.target.value)} rows={3} className={inputClasses} />
        </div>
      </div>

      {bookStatus === "success" && bookUid ? (
        <div className="mt-6 space-y-3">
          <div className="rounded-lg border border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] px-4 py-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">{TEXT.successLabel}</p>
            <p className="mt-1 break-all text-xs text-[color:var(--text-dim)]">{bookUid}</p>
          </div>

          {orderStatus === "success" && orderUid ? (
            <div className="rounded-lg border border-[color:var(--success)]/15 bg-[color:var(--success-soft)] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--success)] uppercase">{TEXT.orderSuccessLabel}</p>
              <p className="mt-1 break-all text-xs text-[color:var(--text-dim)]">{orderUid}</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">{TEXT.shippingTitle}</p>
                {([
                  { id: "cohortRecipientName", label: TEXT.recipientName, key: "recipientName" as const },
                  { id: "cohortRecipientPhone", label: TEXT.recipientPhone, key: "recipientPhone" as const },
                  { id: "cohortAddress1", label: TEXT.address1, key: "address1" as const },
                  { id: "cohortPostalCode", label: TEXT.postalCode, key: "postalCode" as const },
                ]).map(({ id, label, key }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs text-[color:var(--text-dim)]">{label}</label>
                    <input
                      id={id}
                      type="text"
                      value={shipping[key]}
                      onChange={(e) => setShipping((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
                    />
                  </div>
                ))}
              </div>
              {orderStatus === "error" && orderErrorMessage && (
                <p className="text-sm text-[color:var(--error)]">{orderErrorMessage}</p>
              )}
              <button
                type="button"
                onClick={() => { void handleOrder(); }}
                disabled={orderStatus === "loading"}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_var(--accent-glow)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {orderStatus === "loading" ? TEXT.orderLoading : orderStatus === "error" ? TEXT.orderRetry : TEXT.orderIdle}
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {bookStatus === "error" && errorMessage && (
            <p className="mt-4 text-sm text-[color:var(--error)]">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={() => { void handleComplete(); }}
            disabled={bookStatus === "loading"}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_var(--accent-glow)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {bookStatus === "loading" ? TEXT.loading : bookStatus === "error" ? TEXT.retry : TEXT.complete}
          </button>
        </>
      )}
    </aside>
  );
}
