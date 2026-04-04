import Link from "next/link";
import { notFound } from "next/navigation";

import { getStudent } from "@/lib/api";

export const dynamic = "force-dynamic";

interface StudentDetailPageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { studentId } = await params;
  const student = await getStudent(studentId).catch(() => null);

  if (!student) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href="/dashboard" className="text-sm font-medium text-[color:var(--accent)]">
        대시보드로 돌아가기
      </Link>

      <section className="mt-4 overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-7 text-white shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#d9c295] uppercase">{student.roleTrack}</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">{student.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{student.bio}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/58 uppercase">Commemorative Page</p>
            <p className="mt-3 text-lg font-semibold text-white">수료를 기념하는 첫 장</p>
            <p className="mt-3 text-sm leading-6 text-white/70">{student.certificateMessage}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Selected Projects</p>
          <div className="mt-5 space-y-6">
            {student.projects.map((project, index) => (
              <section key={project.title} className={index > 0 ? "border-t border-black/5 pt-6" : ""}>
                <h2 className="font-display text-2xl tracking-tight text-neutral-950">{project.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{project.summary}</p>
                <p className="mt-4 rounded-[1.25rem] bg-[#f6f1e8] px-4 py-4 text-sm leading-7 text-[color:var(--text-default)]">
                  {project.contribution}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      className="inline-flex rounded-full bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-medium text-[color:var(--accent)]"
                    >
                      프로젝트 링크
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Tech Stack</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {student.techStack.map((item) => (
                <span key={item} className="rounded-full border border-black/5 bg-[#f6f1e8] px-4 py-2 text-sm text-neutral-800">
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Retrospective</p>
            <p className="mt-4 text-base leading-8 text-[color:var(--text-default)]">“{student.retrospective}”</p>
          </article>

          <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Mentor Comment</p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-default)]">{student.mentorComment}</p>
          </article>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Activity Photos</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {student.photos.map((photo, index) => (
              <figure key={photo} className={index === 0 ? "sm:translate-y-3" : ""}>
                <div
                  className="h-60 rounded-[1.5rem] bg-cover bg-center"
                  style={{ backgroundImage: `url(${photo})` }}
                />
              </figure>
            ))}
          </div>
        </article>

        <aside className="rounded-[1.75rem] bg-[linear-gradient(145deg,#fffaf1,#f4e7cf)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Next Step</p>
          <h2 className="font-display mt-3 text-2xl tracking-tight text-neutral-950">이 기록을 어떤 책으로 남길지 선택합니다.</h2>
          <p className="mt-4 text-sm leading-7 text-[color:var(--text-muted)]">
            개인 수료 포트폴리오 북과 기수 쇼케이스 북 중에서 목적에 맞는 결과물을 고를 수 있습니다.
          </p>
          <Link
            href={`/book-types?studentId=${student.id}`}
            className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white"
          >
            책 종류 선택하기
          </Link>
        </aside>
      </section>
    </main>
  );
}
