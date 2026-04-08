"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProject } from "@/lib/api";
import type { ProjectRecord } from "@/lib/api";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ProjectFormDialog, { type ProjectFormInitial } from "./ProjectFormDialog";

interface ProjectAdminPanelProps {
  studentId: string;
  projects: ProjectRecord[];
}

const TEXT = {
  add: "프로젝트 추가",
  edit: "수정",
  delete: "삭제",
  deleteTitle: "프로젝트 삭제",
  deleteMessage: (title: string) => `'${title}' 프로젝트가 삭제됩니다. 되돌릴 수 없습니다.`,
} as const;

export default function ProjectAdminPanel({ studentId, projects }: ProjectAdminPanelProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<ProjectFormInitial | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<ProjectRecord | null>(null);

  function openCreate() {
    setFormInitial(undefined);
    setFormOpen(true);
  }

  function openEdit(p: ProjectRecord) {
    setFormInitial({
      id: p.id,
      title: p.title,
      summary: p.summary,
      contribution: p.contribution,
      links: p.links,
    });
    setFormOpen(true);
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[color:var(--foreground)]">
          프로젝트 관리
        </h2>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          + {TEXT.add}
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="mt-4 text-sm text-[color:var(--text-dim)]">
          등록된 프로젝트가 없습니다.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">
                  {p.title}
                </p>
                <p className="truncate text-xs text-[color:var(--text-dim)]">
                  {p.summary}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="rounded px-2 py-1 text-xs font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
                >
                  {TEXT.edit}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  className="rounded px-2 py-1 text-xs font-semibold text-[color:var(--error)] hover:bg-[color:var(--error-soft)]"
                >
                  {TEXT.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ProjectFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => router.refresh()}
        studentId={studentId}
        initial={formInitial}
      />

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteProject(deleteTarget.id);
            router.refresh();
          }
        }}
        title={TEXT.deleteTitle}
        message={deleteTarget ? TEXT.deleteMessage(deleteTarget.title) : ""}
      />
    </div>
  );
}
