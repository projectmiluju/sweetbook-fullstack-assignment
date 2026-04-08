"use client";

import { useEffect, useState, type FormEvent } from "react";

import { createProject, updateProject, type ProjectInput } from "@/lib/api";

import Modal from "./Modal";
import { CommaListField, TextAreaField, TextField } from "./form-fields";

export interface ProjectFormInitial extends ProjectInput {
  id?: string;
}

interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentId: string;
  initial?: ProjectFormInitial;
}

const EMPTY: ProjectFormInitial = {
  title: "",
  summary: "",
  contribution: "",
  links: [],
};

export default function ProjectFormDialog({
  isOpen,
  onClose,
  onSuccess,
  studentId,
  initial,
}: ProjectFormDialogProps) {
  const [form, setForm] = useState<ProjectFormInitial>(initial ?? EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (isOpen) {
      setForm(initial ?? EMPTY);
      setError(null);
    }
  }, [isOpen, initial]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit && initial?.id) {
        await updateProject(initial.id, form);
      } else {
        await createProject(studentId, form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "프로젝트 수정" : "프로젝트 추가"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="project-title"
          label="제목"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          required
        />
        <TextAreaField
          id="project-summary"
          label="요약"
          value={form.summary}
          onChange={(v) => setForm((f) => ({ ...f, summary: v }))}
          required
          rows={2}
        />
        <TextAreaField
          id="project-contribution"
          label="기여"
          value={form.contribution}
          onChange={(v) => setForm((f) => ({ ...f, contribution: v }))}
          required
          rows={3}
        />
        <CommaListField
          id="project-links"
          label="링크"
          value={form.links}
          onChange={(v) => setForm((f) => ({ ...f, links: v }))}
          placeholder="https://github.com/..., https://demo.com/..."
        />

        {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg px-4 py-2 text-sm text-[color:var(--text-muted)] hover:bg-[color:var(--surface-elevated)] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "저장 중..." : isEdit ? "수정" : "추가"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
