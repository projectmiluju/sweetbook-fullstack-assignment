"use client";

import { useState } from "react";

import type { OrderShipping, ProjectSummary } from "@/lib/api";
import { createBook, createOrder } from "@/lib/api";
import type { BookTypeId } from "@/lib/book-types";
import { BOOK_TYPE_LABELS } from "@/lib/book-types";
import {
  buildDefaultPages,
  buildPhotoBlockId,
  buildProjectBlockId,
  createDefaultEditSession,
  getPageLabel as getPageLabelUtil,
  isBlockHidden,
  movePage,
  toggleHiddenBlock
} from "@/lib/edit-session";
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

interface EditFormProps {
  bookType: BookTypeId;
  studentName: string;
  cohortId: string;
  studentId: string;
  projects: ProjectSummary[];
  photos: string[];
}

export default function EditForm({ bookType, studentName, cohortId, studentId, projects, photos }: EditFormProps) {
  const [session, setSession] = useState<EditSession>(() => ({
    ...createDefaultEditSession(bookType, studentName),
    pages: buildDefaultPages({ projectCount: projects.length, photoCount: photos.length, bookType })
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
    setSession((prev) => ({
      ...prev,
      customText: { ...prev.customText, coverTitle: value }
    }));
  }

  function handleGraduationMessageChange(value: string) {
    setSession((prev) => ({
      ...prev,
      customText: { ...prev.customText, graduationMessage: value }
    }));
  }

  function getPageLabel(pageId: string): string {
    const projectTitles = projects.map((p) => p.title);
    return getPageLabelUtil(pageId, projectTitles);
  }

  function handleMovePage(index: number, direction: "up" | "down") {
    setSession((prev) => ({
      ...prev,
      pages: movePage(prev.pages, index, direction)
    }));
  }

  function handleToggleBlock(blockId: string) {
    setSession((prev) => ({
      ...prev,
      hiddenBlocks: toggleHiddenBlock(prev.hiddenBlocks, blockId)
    }));
  }

  async function handleOrder() {
    if (!bookUid || orderStatus === "loading") return;
    setOrderStatus("loading");
    setOrderErrorMessage(null);
    try {
      const result = await createOrder({
        bookUid,
        shipping,
        idempotencyKey: `${studentId}-order-${Date.now()}`,
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
        studentId,
        idempotencyKey: `${studentId}-${Date.now()}`,
      });
      setBookUid(result.bookUid);
      setBookStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "책 생성에 실패했습니다.");
      setBookStatus("error");
    }
  }

  return (
    <aside className="animate-fade-up delay-2 rounded-2xl border border-[color:var(--accent)]/15 bg-gradient-to-b from-[color:var(--accent-soft)] to-[color:var(--surface)] p-7 shadow-[0_2px_16px_var(--shadow-tint)]">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">편집</p>
      <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)]">{bookTypeInfo.title}</h2>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="coverTitle" className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">
            표지 제목
          </label>
          <textarea
            id="coverTitle"
            value={session.customText.coverTitle}
            onChange={(e) => handleCoverTitleChange(e.target.value)}
            rows={2}
            className="mt-2 w-full resize-none rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder-[color:var(--text-dim)] outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>

        <div>
          <label htmlFor="graduationMessage" className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">
            기념 수료 문구
          </label>
          <textarea
            id="graduationMessage"
            value={session.customText.graduationMessage}
            onChange={(e) => handleGraduationMessageChange(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder-[color:var(--text-dim)] outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>

        {projects.length > 0 && (
          <div>
            <p className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">프로젝트 포함 여부</p>
            <div className="mt-2 space-y-2">
              {projects.map((project, index) => {
                const blockId = buildProjectBlockId(index);
                const hidden = isBlockHidden(session.hiddenBlocks, blockId);
                return (
                  <button
                    key={blockId}
                    type="button"
                    onClick={() => handleToggleBlock(blockId)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm hover:scale-[1.01] ${
                      hidden
                        ? "border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] text-[color:var(--text-dim)]"
                        : "border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
                    }`}
                  >
                    <span className="font-medium">{project.title}</span>
                    <span className={`text-xs font-semibold ${hidden ? "text-[color:var(--text-dim)]" : "text-[color:var(--accent)]"}`}>
                      {hidden ? "제외" : "포함"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div>
            <p className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">사진 포함 여부</p>
            <div className="mt-2 space-y-2">
              {photos.map((photo, index) => {
                const blockId = buildPhotoBlockId(index);
                const hidden = isBlockHidden(session.hiddenBlocks, blockId);
                return (
                  <button
                    key={blockId}
                    type="button"
                    onClick={() => handleToggleBlock(blockId)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm hover:scale-[1.01] ${
                      hidden
                        ? "border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] text-[color:var(--text-dim)]"
                        : "border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
                    }`}
                  >
                    <span className="font-medium">사진 {index + 1}</span>
                    <span className={`text-xs font-semibold ${hidden ? "text-[color:var(--text-dim)]" : "text-[color:var(--accent)]"}`}>
                      {hidden ? "제외" : "포함"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {session.pages.length > 0 && (
          <div>
            <p className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">페이지 순서</p>
            <div className="mt-2 space-y-2">
              {session.pages.map((pageId, index) => (
                <div key={pageId} className="flex items-center gap-2 rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-3 py-2.5">
                  <span className="flex-1 text-sm font-medium text-[color:var(--foreground)]">{getPageLabel(pageId)}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMovePage(index, "up")}
                      disabled={index === 0}
                      aria-label="위로 이동"
                      className="flex h-7 w-7 items-center justify-center rounded text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePage(index, "down")}
                      disabled={index === session.pages.length - 1}
                      aria-label="아래로 이동"
                      className="flex h-7 w-7 items-center justify-center rounded text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                  { id: "recipientName", label: TEXT.recipientName, key: "recipientName" as const },
                  { id: "recipientPhone", label: TEXT.recipientPhone, key: "recipientPhone" as const },
                  { id: "address1", label: TEXT.address1, key: "address1" as const },
                  { id: "postalCode", label: TEXT.postalCode, key: "postalCode" as const },
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
