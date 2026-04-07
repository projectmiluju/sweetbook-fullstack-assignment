import Link from "next/link";
import { notFound } from "next/navigation";

import { getCohort } from "@/lib/api";
import { BOOK_TYPE_LABELS, buildCohortBookTypesBackHref, isValidBookType } from "@/lib/book-types";
import CohortEditForm from "./CohortEditForm";

export const dynamic = "force-dynamic";

const COHORT_SHOWCASE_BOOK_TYPE = "cohort-showcase" as const;

interface CohortCreateBookPageProps {
  params: Promise<{ cohortId: string }>;
  searchParams: Promise<{ bookType?: string }>;
}

export default async function CohortCreateBookPage({ params, searchParams }: CohortCreateBookPageProps) {
  const { cohortId } = await params;
  const { bookType } = await searchParams;

  if (!bookType || !isValidBookType(bookType) || bookType !== COHORT_SHOWCASE_BOOK_TYPE) {
    notFound();
  }

  const cohort = await getCohort(cohortId).catch(() => null);

  if (!cohort) {
    notFound();
  }

  const bookTypeInfo = BOOK_TYPE_LABELS[bookType];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <Link
        href={buildCohortBookTypesBackHref(cohortId)}
        className="group inline-flex items-center gap-2 text-sm font-medium text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:scale-[1.02]"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--border-mid)] text-xs transition-all group-hover:border-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white">&larr;</span>
        책 종류 선택으로 돌아가기
      </Link>

      <section className="mt-5 animate-fade-up overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">Book Creation</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] md:text-5xl">
              {bookTypeInfo.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">{bookTypeInfo.description}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] p-5">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">Subject</p>
            <p className="mt-3 text-base font-semibold text-[color:var(--foreground)]">{cohort.name}</p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">{cohort.program}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <article className="animate-fade-up delay-1 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-7 shadow-[0_2px_16px_var(--shadow-tint)]">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">포함될 수료생</p>
          <p className="mt-3 text-sm tabular-nums text-[color:var(--text-muted)]">총 {cohort.studentCount}명</p>
          <div className="mt-5 space-y-3">
            {cohort.students.slice(0, 4).map((student) => (
              <div key={student.id} className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-3">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">
                  {student.roleTrack}
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">{student.name}</p>
                <p className="mt-1 text-xs text-[color:var(--text-dim)]">{student.primaryProjectTitle}</p>
              </div>
            ))}
            {cohort.students.length > 4 && (
              <p className="px-1 text-xs tabular-nums text-[color:var(--text-dim)]">
                외 {cohort.students.length - 4}명 포함
              </p>
            )}
          </div>
        </article>

        <CohortEditForm
          bookType={bookType}
          cohortId={cohortId}
          cohortName={cohort.name}
          cohortSummary={cohort.summary}
        />
      </section>
    </main>
  );
}
