import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import CohortAdminPanel from "@/components/admin/CohortAdminPanel";
import { getCohorts } from "@/lib/api";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const cohorts = await getCohorts();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <section className="animate-fade-up rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">운영자 대시보드</p>
            <h1 className="font-display mt-4 text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">
              어떤 기수의 기록을 먼저 책으로 정리할지 선택하세요.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
              기수별 수료생 수와 수료 시점을 비교한 뒤, 상세 화면에서 수료생 포트폴리오를 검토하고 책 종류를 선택하게 됩니다.
            </p>
          </div>
          <aside className="hidden rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] p-5 lg:block">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">등록된 기수</p>
            <p className="mt-3 text-4xl font-bold tabular-nums text-[color:var(--foreground)]">{cohorts.length}</p>
            <p className="mt-2 text-xs leading-5 text-[color:var(--text-dim)]">현재 데모에서 선택 가능한 기수</p>
          </aside>
        </div>
      </section>

      <section className="animate-fade-up delay-1 mt-14 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">기수 라이브러리</p>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-3xl">
            차트 대신 선택에 필요한 정보만 정리했습니다.
          </h2>
        </div>
        <p className="hidden max-w-lg text-sm leading-7 text-[color:var(--text-dim)] lg:block">
          기수별 소개 문구와 수료생 수를 먼저 확인한 뒤, 상세 화면에서 수료생별 포트폴리오 구성으로 넘어갑니다.
        </p>
      </section>

      {cohorts.length === 0 && (
        <section className="mt-8">
          <EmptyState
            title="등록된 기수가 없습니다"
            message="아직 등록된 기수 데이터가 없습니다. 데이터가 준비되면 여기에 기수 목록이 표시됩니다."
          />
        </section>
      )}

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        {cohorts.map((cohort) => (
          <Link
            key={cohort.id}
            href={`/cohorts/${cohort.id}`}
            className="group rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:border-[color:var(--accent)]/20 hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">{cohort.program}</p>
                <h3 className="font-display mt-3 text-2xl font-bold leading-tight tracking-tight text-[color:var(--foreground)]">{cohort.name}</h3>
                <p className="mt-3 max-w-[34ch] text-sm leading-7 text-[color:var(--text-muted)]">{cohort.tagline}</p>
              </div>
              <div className="rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] px-4 py-3 text-center">
                <p className="text-[10px] tracking-[0.18em] text-[color:var(--text-dim)] uppercase">수료생</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-[color:var(--foreground)]">{cohort.studentCount}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-4">
              <p className="text-sm leading-7 text-[color:var(--text-muted)]">{cohort.summary}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs tabular-nums text-[color:var(--text-dim)]">수료일 {formatDate(cohort.graduationDate)}</p>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border-mid)] px-4 py-2 text-sm font-medium text-[color:var(--text-muted)] transition-all group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent)]">
                기수 상세 보기
                <span className="text-xs transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-14">
        <CohortAdminPanel cohorts={cohorts} />
      </section>
    </main>
  );
}
