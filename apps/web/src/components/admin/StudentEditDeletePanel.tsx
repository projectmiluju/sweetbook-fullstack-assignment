"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteStudent } from "@/lib/api";
import type { StudentPortfolio } from "@/lib/api";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import StudentFormDialog, { type StudentFormInitial } from "./StudentFormDialog";

interface StudentEditDeletePanelProps {
  student: StudentPortfolio;
  cohortId: string;
}

/**
 * 수료생 상세 페이지에 표시되는 수정/삭제 액션 패널.
 * 삭제 후 cohort 페이지로 이동.
 */
export default function StudentEditDeletePanel({
  student,
  cohortId,
}: StudentEditDeletePanelProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const initial: StudentFormInitial = {
    id: student.id,
    name: student.name,
    roleTrack: student.roleTrack,
    bio: student.bio,
    techStack: student.techStack,
    mentorComment: student.mentorComment,
    photos: student.photos,
    certificateMessage: student.certificateMessage,
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="rounded-lg border border-[color:var(--accent)]/30 bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
      >
        수정
      </button>
      <button
        type="button"
        onClick={() => setDeleteOpen(true)}
        className="rounded-lg border border-[color:var(--error)]/30 bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold text-[color:var(--error)] hover:bg-[color:var(--error-soft)]"
      >
        삭제
      </button>

      <StudentFormDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => router.refresh()}
        cohortId={cohortId}
        initial={initial}
      />

      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await deleteStudent(student.id);
          router.push(`/cohorts/${cohortId}`);
        }}
        title="수료생 삭제"
        message={`'${student.name}' 수료생과 소속 프로젝트가 모두 삭제됩니다. 되돌릴 수 없습니다.`}
      />
    </div>
  );
}
