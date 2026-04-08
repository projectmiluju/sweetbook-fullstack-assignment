"use client";

import { useState } from "react";

import Modal from "./Modal";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
}

export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDeleteDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm leading-7 text-[color:var(--text-default)]">{message}</p>
      {error && <p className="mt-3 text-sm text-[color:var(--error)]">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="rounded-lg px-4 py-2 text-sm text-[color:var(--text-muted)] hover:bg-[color:var(--surface-elevated)] disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="rounded-lg bg-[color:var(--error)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </Modal>
  );
}
