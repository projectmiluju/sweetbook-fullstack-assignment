"use client";

import { useEffect, useState, type FormEvent } from "react";

import { createCohort, updateCohort, type CohortInput } from "@/lib/api";

import Modal from "./Modal";
import { TextAreaField, TextField } from "./form-fields";

export interface CohortFormInitial extends CohortInput {
  id?: string;
}

interface CohortFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initial?: CohortFormInitial;
}

const EMPTY: CohortFormInitial = {
  name: "",
  program: "",
  graduationDate: "",
  summary: "",
  tagline: "",
};

export default function CohortFormDialog({
  isOpen,
  onClose,
  onSuccess,
  initial,
}: CohortFormDialogProps) {
  const [form, setForm] = useState<CohortFormInitial>(initial ?? EMPTY);
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
        await updateCohort(initial.id, form);
      } else {
        await createCohort(form);
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "기수 수정" : "기수 추가"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="cohort-name"
          label="기수 이름"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
          placeholder="예: 웹 풀스택 6기"
        />
        <TextField
          id="cohort-program"
          label="과정명"
          value={form.program}
          onChange={(v) => setForm((f) => ({ ...f, program: v }))}
          required
          placeholder="예: SweetBootcamp Web Fullstack"
        />
        <TextField
          id="cohort-graduationDate"
          label="수료일"
          type="date"
          value={form.graduationDate}
          onChange={(v) => setForm((f) => ({ ...f, graduationDate: v }))}
          required
        />
        <TextAreaField
          id="cohort-summary"
          label="요약"
          value={form.summary}
          onChange={(v) => setForm((f) => ({ ...f, summary: v }))}
          required
          rows={3}
        />
        <TextField
          id="cohort-tagline"
          label="태그라인"
          value={form.tagline}
          onChange={(v) => setForm((f) => ({ ...f, tagline: v }))}
          required
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
