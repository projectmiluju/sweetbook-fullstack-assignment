import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/BackLink";
import { EmptyState } from "@/components/EmptyState";
import StudentAdminPanel from "@/components/admin/StudentAdminPanel";
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <BackLink href="/dashboard">대시보드로 돌아가기</BackLink>

      <section className="mt-5 animate-fade-up rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">{cohort.program}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">{cohort.name}</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-[color:var(--text-muted)]">{cohort.summary}</p>
            <p className="mt-3 text-sm text-[color:var(--text-dim)]">{cohort.tagline}</p>
          </div>
          <aside className="grid gap-4 rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] p-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">수료일</p>
              <p className="mt-2 text-base font-semibold tabular-nums text-[color:var(--foreground)]">{formatDate(cohort.graduationDate)}</p>
            </div>
            <div className="border-t border-[color:var(--border-soft)] pt-4">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">수료생</p>
              <p className="mt-2 text-base font-semibold tabular-nums text-[color:var(--foreground)]">{cohort.studentCount}명</p>
            </div>
          </aside>
        </div>
      </section>

      <aside className="mt-6 animate-fade-up delay-1 rounded-2xl border border-[color:var(--accent)]/15 bg-gradient-to-r from-[color:var(--accent-soft)] to-transparent p-7 shadow-[0_2px_16px_var(--shadow-tint)]">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">다음 단계</p>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance]">이 기수의 성과를 한 권으로 정리합니다.</h2>
        <p className="mt-3 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">
          기수 전체 수료생의 프로젝트, 회고, 활동 사진을 묶어 기수 쇼케이스 북을 만들 수 있습니다.
        </p>
        <Link
          href={`/book-types?cohortId=${cohort.id}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:scale-[1.02]"
        >
          기수 쇼케이스 북 만들기 <span>&rarr;</span>
        </Link>
      </aside>

      <section className="mt-12 animate-fade-up delay-2 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">수료생 컬렉션</p>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-3xl">
            수료생별 원본 포트폴리오를 먼저 검토합니다.
          </h2>
        </div>
        <p className="hidden max-w-lg text-sm leading-7 text-[color:var(--text-dim)] lg:block">
          수료생 상세에서 프로젝트, 회고, 멘토 코멘트를 확인한 뒤 개인 북 또는 기수 쇼케이스 북 흐름으로 이어집니다.
        </p>
      </section>

      {cohort.students.length === 0 && (
        <section className="mt-8">
          <EmptyState
            title="등록된 수료생이 없습니다"
            message="이 기수에 아직 등록된 수료생 데이터가 없습니다."
          />
        </section>
      )}

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        {cohort.students.map((student) => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            className="group rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:border-[color:var(--accent)]/20 hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]"
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">{student.roleTrack}</p>
            <h3 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)]">{student.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{student.bio}</p>

            <div className="mt-5 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-4">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">대표 프로젝트</p>
              <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">{student.primaryProjectTitle}</p>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="tabular-nums text-[color:var(--text-dim)]">프로젝트 {student.projectCount}건</span>
              <span className="flex items-center gap-1 font-medium text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--accent)]">
                수료생 상세 보기
                <span className="text-xs transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10">
        <StudentAdminPanel cohortId={cohort.id} students={cohort.students} />
      </section>
    </main>
  );
}
