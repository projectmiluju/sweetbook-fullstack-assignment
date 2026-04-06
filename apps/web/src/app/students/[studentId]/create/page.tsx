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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href={buildBookTypesBackHref(studentId)} className="text-sm font-medium text-[color:var(--accent)]">
        책 종류 선택으로 돌아가기
      </Link>

      <section className="mt-4 overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-7 shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#d9c295] uppercase">Book Creation</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-tight text-white sm:text-5xl">
              {student.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{student.bio}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/58 uppercase">Subject</p>
            <p className="mt-3 text-lg font-semibold text-white">{student.name}</p>
            <p className="mt-2 text-sm text-white/70">{student.roleTrack}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">포함될 콘텐츠</p>
          <div className="mt-5 space-y-4">
            {student.projects.slice(0, 2).map((project) => (
              <div key={project.title} className="rounded-[1.25rem] border border-black/5 px-4 py-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase">Project</p>
                <p className="mt-2 text-base font-semibold text-neutral-950">{project.title}</p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">{project.summary}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              {student.techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-black/5 bg-[#f6f1e8] px-3 py-1 text-xs text-neutral-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>

        <EditForm bookType={bookType} studentName={student.name} projects={student.projects} photos={student.photos} />
      </section>
    </main>
  );
}
