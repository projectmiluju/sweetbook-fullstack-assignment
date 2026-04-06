import Link from "next/link";
import { notFound } from "next/navigation";

import { getCohort } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CohortDetailPageProps {
  params: Promise<{ cohortId: string }>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export default async function CohortDetailPage({ params }: CohortDetailPageProps) {
  const { cohortId } = await params;
  const cohort = await getCohort(cohortId).catch(() => null);

  if (!cohort) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href="/dashboard" className="text-sm font-medium text-[color:var(--accent)]">
        대시보드로 돌아가기
      </Link>

      <section className="mt-4 rounded-[2rem] bg-[color:var(--surface)] px-6 py-7 shadow-[0_20px_48px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">{cohort.program}</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-tight text-neutral-950 sm:text-5xl">{cohort.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[color:var(--text-default)]">{cohort.summary}</p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-muted)]">{cohort.tagline}</p>
          </div>
          <aside className="grid gap-3 rounded-[1.5rem] bg-[color:var(--accent-soft)] p-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Graduation</p>
              <p className="mt-2 text-lg font-semibold text-neutral-950">{formatDate(cohort.graduationDate)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Students</p>
              <p className="mt-2 text-lg font-semibold text-neutral-950">{cohort.studentCount}명</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">Graduate Collection</p>
          <h2 className="font-display mt-2 text-2xl tracking-tight text-neutral-950 sm:text-3xl">
            수료생별 원본 포트폴리오를 먼저 검토합니다.
          </h2>
        </div>
        <p className="hidden max-w-lg text-sm leading-7 text-[color:var(--text-muted)] lg:block">
          수료생 상세에서 프로젝트, 회고, 멘토 코멘트를 확인한 뒤 개인 북 또는 기수 쇼케이스 북 흐름으로 이어집니다.
        </p>
      </section>

      <section className="mt-6">
        {cohort.students.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-20 text-center shadow-[0_18px_42px_var(--shadow-tint)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">No Students</p>
            <p className="font-display mt-4 text-2xl tracking-tight text-neutral-950">등록된 수료생이 없습니다</p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-[color:var(--text-muted)]">
              이 기수에 아직 등록된 수료생 데이터가 없습니다.
            </p>
          </div>
        )}
      </section>

      <aside className="mt-8 rounded-[1.75rem] bg-[linear-gradient(145deg,#fffaf1,#f4e7cf)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
        <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Next Step</p>
        <h2 className="font-display mt-3 text-2xl tracking-tight text-neutral-950">이 기수의 성과를 한 권으로 정리합니다.</h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
          기수 전체 수료생의 프로젝트, 회고, 활동 사진을 묶어 기수 쇼케이스 북을 만들 수 있습니다.
        </p>
        <Link
          href={`/book-types?cohortId=${cohort.id}`}
          className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white"
        >
          기수 쇼케이스 북 만들기
        </Link>
      </aside>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        {cohort.students.map((student, index) => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            className={[
              "rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]",
              index % 2 === 1 ? "lg:translate-y-4" : ""
            ].join(" ")}
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">{student.roleTrack}</p>
            <h3 className="font-display mt-3 text-2xl tracking-tight text-neutral-950">{student.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{student.bio}</p>

            <div className="mt-6 rounded-[1.5rem] bg-[#f6f1e8] px-4 py-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--accent)] uppercase">Primary Project</p>
              <p className="mt-2 text-lg font-semibold text-neutral-950">{student.primaryProjectTitle}</p>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-[color:var(--text-muted)]">
              <span>프로젝트 {student.projectCount}건</span>
              <span className="font-medium text-[color:var(--accent)]">수료생 상세 보기</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
