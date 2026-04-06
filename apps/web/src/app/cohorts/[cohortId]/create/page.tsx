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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href={buildCohortBookTypesBackHref(cohortId)} className="text-sm font-medium text-[color:var(--accent)]">
        책 종류 선택으로 돌아가기
      </Link>

      <section className="mt-4 overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-7 shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#d9c295] uppercase">Book Creation</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-tight text-white sm:text-5xl">
              {bookTypeInfo.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{bookTypeInfo.description}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/58 uppercase">Subject</p>
            <p className="mt-3 text-lg font-semibold text-white">{cohort.name}</p>
            <p className="mt-2 text-sm text-white/70">{cohort.program}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">포함될 수료생</p>
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">총 {cohort.studentCount}명</p>
          <div className="mt-5 space-y-3">
            {cohort.students.slice(0, 4).map((student) => (
              <div key={student.id} className="rounded-[1.25rem] border border-black/5 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase">
                  {student.roleTrack}
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-950">{student.name}</p>
                <p className="mt-1 text-xs text-[color:var(--text-muted)]">{student.primaryProjectTitle}</p>
              </div>
            ))}
            {cohort.students.length > 4 && (
              <p className="px-1 text-xs text-[color:var(--text-muted)]">
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
