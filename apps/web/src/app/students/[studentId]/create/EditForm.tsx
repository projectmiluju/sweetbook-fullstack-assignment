"use client";

import { useState } from "react";

import type { ProjectSummary } from "@/lib/api";
import type { BookTypeId } from "@/lib/book-types";
import { BOOK_TYPE_LABELS } from "@/lib/book-types";
import {
  buildPhotoBlockId,
  buildProjectBlockId,
  createDefaultEditSession,
  isBlockHidden,
  toggleHiddenBlock
} from "@/lib/edit-session";
import type { EditSession } from "@/lib/edit-session";

interface EditFormProps {
  bookType: BookTypeId;
  studentName: string;
  projects: ProjectSummary[];
  photos: string[];
}

export default function EditForm({ bookType, studentName, projects, photos }: EditFormProps) {
  const [session, setSession] = useState<EditSession>(() =>
    createDefaultEditSession(bookType, studentName)
  );

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

  function handleToggleBlock(blockId: string) {
    setSession((prev) => ({
      ...prev,
      hiddenBlocks: toggleHiddenBlock(prev.hiddenBlocks, blockId)
    }));
  }

  function handleComplete() {
    // Epic #4에서 API 호출로 전환 예정
    // 현재는 편집 상태를 콘솔에 기록하는 플레이스홀더
    void session;
  }

  return (
    <aside className="rounded-[1.75rem] bg-[linear-gradient(145deg,#fffaf1,#f4e7cf)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
      <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">편집</p>
      <h2 className="font-display mt-3 text-2xl tracking-tight text-neutral-950">{bookTypeInfo.title}</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="coverTitle"
            className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase"
          >
            표지 제목
          </label>
          <textarea
            id="coverTitle"
            value={session.customText.coverTitle}
            onChange={(e) => handleCoverTitleChange(e.target.value)}
            rows={2}
            className="mt-2 w-full resize-none rounded-[1rem] border border-black/8 bg-white/70 px-3 py-2 text-sm text-neutral-950 placeholder-neutral-400 outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="graduationMessage"
            className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase"
          >
            기념 수료 문구
          </label>
          <textarea
            id="graduationMessage"
            value={session.customText.graduationMessage}
            onChange={(e) => handleGraduationMessageChange(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-[1rem] border border-black/8 bg-white/70 px-3 py-2 text-sm text-neutral-950 placeholder-neutral-400 outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </div>

        {projects.length > 0 && (
          <div>
            <p className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase">
              프로젝트 포함 여부
            </p>
            <div className="mt-2 space-y-2">
              {projects.map((project, index) => {
                const blockId = buildProjectBlockId(index);
                const hidden = isBlockHidden(session.hiddenBlocks, blockId);
                return (
                  <button
                    key={blockId}
                    type="button"
                    onClick={() => handleToggleBlock(blockId)}
                    className={`flex w-full items-center justify-between rounded-[1rem] border px-3 py-2.5 text-left text-sm transition-colors ${
                      hidden
                        ? "border-black/8 bg-white/40 text-neutral-400"
                        : "border-[color:var(--accent)]/20 bg-white/70 text-neutral-950"
                    }`}
                  >
                    <span className="font-medium">{project.title}</span>
                    <span className={`text-xs font-semibold ${hidden ? "text-neutral-400" : "text-[color:var(--accent)]"}`}>
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
            <p className="block text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase">
              사진 포함 여부
            </p>
            <div className="mt-2 space-y-2">
              {photos.map((photo, index) => {
                const blockId = buildPhotoBlockId(index);
                const hidden = isBlockHidden(session.hiddenBlocks, blockId);
                return (
                  <button
                    key={blockId}
                    type="button"
                    onClick={() => handleToggleBlock(blockId)}
                    className={`flex w-full items-center justify-between rounded-[1rem] border px-3 py-2.5 text-left text-sm transition-colors ${
                      hidden
                        ? "border-black/8 bg-white/40 text-neutral-400"
                        : "border-[color:var(--accent)]/20 bg-white/70 text-neutral-950"
                    }`}
                  >
                    <span className="font-medium">사진 {index + 1}</span>
                    <span className={`text-xs font-semibold ${hidden ? "text-neutral-400" : "text-[color:var(--accent)]"}`}>
                      {hidden ? "제외" : "포함"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
