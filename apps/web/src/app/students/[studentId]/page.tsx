import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/BackLink";
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <BackLink href="/dashboard">대시보드로 돌아가기</BackLink>

      <section className="mt-5 animate-fade-up overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">{student.roleTrack}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] md:text-5xl">{student.name}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">{student.bio}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] p-5">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">수료 기념 페이지</p>
            <p className="mt-3 text-base font-semibold text-[color:var(--foreground)]">수료를 기념하는 첫 장</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{student.certificateMessage}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <article className="animate-fade-up delay-1 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-7 shadow-[0_2px_16px_var(--shadow-tint)]">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">선정 프로젝트</p>
          <div className="mt-6 space-y-6">
            {student.projects.map((project, index) => (
              <section key={project.title} className={index > 0 ? "border-t border-[color:var(--border-soft)] pt-6" : ""}>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--foreground)]">{project.title}</h2>
                <p className="mt-3 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">{project.summary}</p>
                <p className="mt-4 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-4 text-sm leading-7 text-[color:var(--text-default)]">
                  {project.contribution}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white hover:scale-[1.02]"
                    >
                      프로젝트 링크 <span className="text-xs">&nearr;</span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <div className="grid gap-5">
          <article className="animate-fade-up delay-2 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">기술 스택</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {student.techStack.map((item) => (
                <span key={item} className="rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-default)]">
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="animate-fade-up delay-3 rounded-2xl rounded-l-none border-l-2 border-[color:var(--accent)] bg-[color:var(--surface)] px-6 py-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">회고</p>
            <p className="font-display mt-4 text-lg font-medium leading-8 text-[color:var(--text-default)]">
              &ldquo;{student.retrospective}&rdquo;
            </p>
          </article>

          <article className="animate-fade-up delay-4 rounded-2xl rounded-l-none border-l-2 border-[color:var(--text-dim)] bg-[color:var(--surface)] px-6 py-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">멘토 코멘트</p>
            <p className="mt-4 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">{student.mentorComment}</p>
          </article>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="animate-fade-up delay-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-7 shadow-[0_2px_16px_var(--shadow-tint)]">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">활동 사진</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {student.photos.map((photo) => (
              <figure key={photo}>
                <div
                  className="h-56 rounded-xl border border-[color:var(--border-soft)] bg-cover bg-center"
                  style={{ backgroundImage: `url(${photo})` }}
                />
              </figure>
            ))}
          </div>
        </article>

        <aside className="animate-fade-up delay-5 rounded-2xl border border-[color:var(--accent)]/15 bg-gradient-to-br from-[color:var(--accent-soft)] to-transparent p-7 shadow-[0_2px_16px_var(--shadow-tint)]">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">다음 단계</p>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance]">이 기록을 어떤 책으로 남길지 선택합니다.</h2>
          <p className="mt-4 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">
            개인 수료 포트폴리오 북과 기수 쇼케이스 북 중에서 목적에 맞는 결과물을 고를 수 있습니다.
          </p>
          <Link
            href={`/book-types?studentId=${student.id}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:scale-[1.02]"
          >
            책 종류 선택하기 <span>&rarr;</span>
          </Link>
        </aside>
      </section>
    </main>
  );
}
