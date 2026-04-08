"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteStudent } from "@/lib/api";
import type { CohortStudentSummary } from "@/lib/api";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import StudentFormDialog, { type StudentFormInitial } from "./StudentFormDialog";

interface StudentAdminPanelProps {
  cohortId: string;
  students: CohortStudentSummary[];
}

const TEXT = {
  add: "수료생 추가",
  delete: "삭제",
  deleteTitle: "수료생 삭제",
  deleteMessage: (name: string) =>
    `'${name}' 수료생과 소속된 모든 프로젝트가 삭제됩니다. 되돌릴 수 없습니다.`,
} as const;

export default function StudentAdminPanel({ cohortId, students }: StudentAdminPanelProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CohortStudentSummary | null>(null);

  // 수료생 수정은 상세 페이지(/students/[id])에서 처리하므로
  // 여기서는 추가/삭제만 제공.
  const formInitial: StudentFormInitial | undefined = undefined;

  return (
    <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[color:var(--foreground)]">
          수료생 관리
        </h2>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          + {TEXT.add}
        </button>
      </div>

      {students.length === 0 ? (
        <p className="mt-4 text-sm text-[color:var(--text-dim)]">
          등록된 수료생이 없습니다.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {students.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">
                  {s.name}
                </p>
                <p className="truncate text-xs text-[color:var(--text-dim)]">
                  {s.roleTrack} · 프로젝트 {s.projectCount}개
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(s)}
                className="ml-2 shrink-0 rounded px-2 py-1 text-xs font-semibold text-[color:var(--error)] hover:bg-[color:var(--error-soft)]"
              >
                {TEXT.delete}
              </button>
            </li>
          ))}
        </ul>
      )}

      <StudentFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => router.refresh()}
        cohortId={cohortId}
        initial={formInitial}
      />

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteStudent(deleteTarget.id);
            router.refresh();
          }
        }}
        title={TEXT.deleteTitle}
        message={deleteTarget ? TEXT.deleteMessage(deleteTarget.name) : ""}
      />
    </div>
  );
}
