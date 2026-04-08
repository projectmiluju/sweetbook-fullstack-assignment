"use client";

import { useEffect, useState, type FormEvent } from "react";

import { createStudent, updateStudent, type StudentInput } from "@/lib/api";

import Modal from "./Modal";
import { CommaListField, TextAreaField, TextField } from "./form-fields";

export interface StudentFormInitial extends StudentInput {
  id?: string;
}

interface StudentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cohortId: string;
  initial?: StudentFormInitial;
}

const EMPTY: StudentFormInitial = {
  name: "",
  roleTrack: "",
  bio: "",
  techStack: [],
  mentorComment: "",
  photos: [],
  certificateMessage: "",
};

export default function StudentFormDialog({
  isOpen,
  onClose,
  onSuccess,
  cohortId,
  initial,
}: StudentFormDialogProps) {
  const [form, setForm] = useState<StudentFormInitial>(initial ?? EMPTY);
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
        await updateStudent(initial.id, form);
      } else {
        await createStudent(cohortId, form);
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "수료생 수정" : "수료생 추가"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="student-name"
          label="이름"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <TextField
          id="student-roleTrack"
          label="역할/트랙"
          value={form.roleTrack}
          onChange={(v) => setForm((f) => ({ ...f, roleTrack: v }))}
          required
          placeholder="예: 풀스택"
        />
        <TextAreaField
          id="student-bio"
          label="자기소개"
          value={form.bio}
          onChange={(v) => setForm((f) => ({ ...f, bio: v }))}
          required
          rows={3}
        />
        <CommaListField
          id="student-techStack"
          label="기술 스택"
          value={form.techStack}
          onChange={(v) => setForm((f) => ({ ...f, techStack: v }))}
          placeholder="예: TypeScript, Next.js, Prisma"
        />
        <TextAreaField
          id="student-mentorComment"
          label="멘토 코멘트"
          value={form.mentorComment}
          onChange={(v) => setForm((f) => ({ ...f, mentorComment: v }))}
          required
          rows={3}
        />
        <CommaListField
          id="student-photos"
          label="사진 URL"
          value={form.photos}
          onChange={(v) => setForm((f) => ({ ...f, photos: v }))}
          placeholder="https://..., https://..."
        />
        <TextAreaField
          id="student-certificateMessage"
          label="수료 메시지"
          value={form.certificateMessage}
          onChange={(v) => setForm((f) => ({ ...f, certificateMessage: v }))}
          required
          rows={2}
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
