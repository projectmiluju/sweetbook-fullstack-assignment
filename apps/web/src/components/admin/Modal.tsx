"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-[color:var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--border-soft)] px-6 py-4">
          <h2 className="font-display text-xl font-bold text-[color:var(--foreground)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--text-muted)] hover:bg-[color:var(--surface-elevated)]"
          >
            닫기
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
