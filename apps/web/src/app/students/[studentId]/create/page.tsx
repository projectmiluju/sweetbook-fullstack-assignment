import Link from "next/link";
import { notFound } from "next/navigation";

import { getStudent } from "@/lib/api";
import { buildBookTypesBackHref, isValidBookType } from "@/lib/book-types";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

interface CreateBookPageProps {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ bookType?: string }>;
}

export default async function CreateBookPage({ params, searchParams }: CreateBookPageProps) {
  const { studentId } = await params;
  const { bookType } = await searchParams;

  if (!bookType || !isValidBookType(bookType)) {
    notFound();
  }

  const student = await getStudent(studentId).catch(() => null);

  if (!student) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <Link
        href={buildBookTypesBackHref(studentId)}
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
              {student.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">{student.bio}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] p-5">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">Subject</p>
            <p className="mt-3 text-base font-semibold text-[color:var(--foreground)]">{student.name}</p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">{student.roleTrack}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <article className="animate-fade-up delay-1 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-7 shadow-[0_2px_16px_var(--shadow-tint)]">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">포함될 콘텐츠</p>
          <div className="mt-5 space-y-4">
            {student.projects.slice(0, 2).map((project) => (
              <div key={project.title} className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-4">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">Project</p>
                <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">{project.title}</p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">{project.summary}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              {student.techStack.map((tech) => (
                <span key={tech} className="rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[color:var(--text-default)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>

        <EditForm
          bookType={bookType}
          studentName={student.name}
          cohortId="cohort-2026-01"
          studentId={studentId}
          projects={student.projects}
          photos={student.photos}
        />
      </section>
    </main>
  );
}
