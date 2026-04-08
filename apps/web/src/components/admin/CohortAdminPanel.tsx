"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCohort } from "@/lib/api";
import type { CohortSummary } from "@/lib/api";

import CohortFormDialog, { type CohortFormInitial } from "./CohortFormDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

interface CohortAdminPanelProps {
  cohorts: CohortSummary[];
}

const TEXT = {
  add: "기수 추가",
  edit: "수정",
  delete: "삭제",
  deleteTitle: "기수 삭제",
  deleteMessage: (name: string) =>
    `'${name}' 기수와 소속된 모든 수료생·프로젝트가 삭제됩니다. 되돌릴 수 없습니다.`,
} as const;

export default function CohortAdminPanel({ cohorts }: CohortAdminPanelProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<CohortFormInitial | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<CohortSummary | null>(null);

  function openCreate() {
    setFormInitial(undefined);
    setFormOpen(true);
  }

  function openEdit(c: CohortSummary) {
    setFormInitial({
      id: c.id,
      name: c.name,
      program: c.program,
      graduationDate: c.graduationDate,
      summary: c.summary,
      tagline: c.tagline,
    });
    setFormOpen(true);
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[color:var(--foreground)]">
          기수 관리
        </h2>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          + {TEXT.add}
        </button>
      </div>

      {cohorts.length === 0 ? (
        <p className="mt-4 text-sm text-[color:var(--text-dim)]">
          등록된 기수가 없습니다. 위 버튼으로 추가하세요.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {cohorts.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">
                  {c.name}
                </p>
                <p className="truncate text-xs text-[color:var(--text-dim)]">
                  {c.program} · {c.graduationDate}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="rounded px-2 py-1 text-xs font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
                >
                  {TEXT.edit}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(c)}
                  className="rounded px-2 py-1 text-xs font-semibold text-[color:var(--error)] hover:bg-[color:var(--error-soft)]"
                >
                  {TEXT.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CohortFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => router.refresh()}
        initial={formInitial}
      />

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteCohort(deleteTarget.id);
            router.refresh();
          }
        }}
        title={TEXT.deleteTitle}
        message={deleteTarget ? TEXT.deleteMessage(deleteTarget.name) : ""}
      />
    </div>
  );
}
