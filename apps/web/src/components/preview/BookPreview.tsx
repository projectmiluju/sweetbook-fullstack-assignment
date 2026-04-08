"use client";

import { useEffect, useState } from "react";

import {
  getPreviewPayload,
  type PreviewPagePayload,
  type PreviewPayloadResult,
} from "@/lib/api";
import type { EditSession } from "@/lib/edit-session";

import PageRenderer from "./PageRenderer";
import { COVER_SPREAD_WIDTH, PAGE_WIDTH } from "./constants";
import { resolveTemplate } from "./template-resolver";

const TEXT = {
  title: "책 프리뷰",
  loading: "프리뷰를 불러오는 중...",
  error: "프리뷰를 불러오지 못했습니다.",
  retry: "다시 시도",
  close: "닫기",
  prev: "이전",
  next: "다음",
  pageOf: (current: number, total: number) => `${current} / ${total}`,
  emptyPage: "표시할 페이지가 없습니다.",
  unknownTemplate: "알 수 없는 템플릿입니다.",
} as const;

interface BookPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  session: EditSession;
  cohortId: string;
  studentId?: string;
}

type FetchStatus = "idle" | "loading" | "success" | "error";

interface PageEntry {
  payload: PreviewPagePayload;
  isCover: boolean;
}

const COVER_CONTAINER_WIDTH = 720;
const CONTENT_CONTAINER_WIDTH = 400;

export default function BookPreview({
  isOpen,
  onClose,
  session,
  cohortId,
  studentId,
}: BookPreviewProps) {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 모달 열릴 때 fetch
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    /* eslint-disable react-hooks/set-state-in-effect -- 모달 open/dependency 변화 시 1회성 초기화 */
    setStatus("loading");
    setErrorMessage(null);
    setCurrentIndex(0);
    /* eslint-enable react-hooks/set-state-in-effect */

    getPreviewPayload({ session, cohortId, studentId })
      .then((result: PreviewPayloadResult) => {
        if (cancelled) return;
        const entries: PageEntry[] = [
          { payload: result.cover, isCover: true },
          ...result.contents.map((p) => ({ payload: p, isCover: false })),
        ];
        setPages(entries);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(error instanceof Error ? error.message : TEXT.error);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, session, cohortId, studentId]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setCurrentIndex((i) => Math.min(pages.length - 1, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, pages.length]);

  if (!isOpen) return null;

  const currentPage = pages[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={TEXT.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-full w-full max-w-4xl flex-col rounded-2xl bg-[color:var(--surface)] shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[color:var(--border-soft)] px-6 py-4">
          <h2 className="font-display text-xl font-bold text-[color:var(--foreground)]">
            {TEXT.title}
          </h2>
          <div className="flex items-center gap-4">
            {status === "success" && pages.length > 0 && (
              <span className="text-sm tabular-nums text-[color:var(--text-dim)]">
                {TEXT.pageOf(currentIndex + 1, pages.length)}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={TEXT.close}
              className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--text-muted)] hover:bg-[color:var(--surface-elevated)]"
            >
              {TEXT.close}
            </button>
          </div>
        </div>

        {/* 메인 — 페이지 렌더링 영역 */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-[color:var(--surface-elevated)] p-6">
          {status === "loading" && (
            <p className="text-sm text-[color:var(--text-dim)]">{TEXT.loading}</p>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-[color:var(--error)]">
                {errorMessage ?? TEXT.error}
              </p>
              <button
                type="button"
                onClick={() => {
                  // useEffect dependency를 트리거하기 위해 isOpen 토글 대신 직접 fetch
                  setStatus("loading");
                  getPreviewPayload({ session, cohortId, studentId })
                    .then((result) => {
                      const entries: PageEntry[] = [
                        { payload: result.cover, isCover: true },
                        ...result.contents.map((p) => ({
                          payload: p,
                          isCover: false,
                        })),
                      ];
                      setPages(entries);
                      setStatus("success");
                    })
                    .catch((err: unknown) => {
                      setErrorMessage(
                        err instanceof Error ? err.message : TEXT.error
                      );
                      setStatus("error");
                    });
                }}
                className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              >
                {TEXT.retry}
              </button>
            </div>
          )}

          {status === "success" && currentPage && <RenderedPage entry={currentPage} />}

          {status === "success" && !currentPage && (
            <p className="text-sm text-[color:var(--text-dim)]">{TEXT.emptyPage}</p>
          )}
        </div>

        {/* 푸터 — 네비게이션 */}
        {status === "success" && pages.length > 1 && (
          <div className="flex items-center justify-between border-t border-[color:var(--border-soft)] px-6 py-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              aria-label={TEXT.prev}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ◀ {TEXT.prev}
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((i) => Math.min(pages.length - 1, i + 1))
              }
              disabled={currentIndex === pages.length - 1}
              aria-label={TEXT.next}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {TEXT.next} ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RenderedPage({ entry }: { entry: PageEntry }) {
  const resolved = resolveTemplate(entry.payload.templateUid);

  if (!resolved) {
    return (
      <p className="text-sm text-[color:var(--text-dim)]">
        {TEXT.unknownTemplate} ({entry.payload.templateUid})
      </p>
    );
  }

  // 표지는 spread 폭 1716, 내지는 단면 폭 864
  const containerWidth = entry.isCover
    ? COVER_CONTAINER_WIDTH
    : CONTENT_CONTAINER_WIDTH;
  const templateWidth = entry.isCover ? COVER_SPREAD_WIDTH : PAGE_WIDTH;

  return (
    <PageRenderer
      template={resolved.template}
      params={entry.payload.parameters}
      containerWidth={containerWidth}
      templateWidth={templateWidth}
    />
  );
}
