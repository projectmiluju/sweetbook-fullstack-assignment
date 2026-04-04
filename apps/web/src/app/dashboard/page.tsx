import Link from "next/link";

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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-7 text-white shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8 sm:py-9">
        <p className="text-xs font-semibold tracking-[0.22em] text-[#d9c295] uppercase">Operator Dashboard</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-end">
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-tight text-white sm:text-5xl">
              어떤 기수의 기록을 먼저 책으로 정리할지 선택하세요.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              운영자는 기수별 수료생 수와 수료 시점을 빠르게 비교한 뒤, 상세 화면에서 수료생 포트폴리오를 검토하고 책
              종류를 선택하게 됩니다.
            </p>
          </div>
          <aside className="rounded-[1.5rem] bg-white/8 p-5 backdrop-blur-xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/56 uppercase">Available Cohorts</p>
            <p className="mt-3 text-4xl font-semibold tabular-nums text-white">{cohorts.length}</p>
            <p className="mt-3 text-sm leading-6 text-white/68">현재 데모에서 선택 가능한 기수</p>
          </aside>
        </div>
      </section>

      <section className="mt-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">Cohort Library</p>
          <h2 className="font-display mt-2 text-2xl tracking-tight text-neutral-950 sm:text-3xl">
            차트 대신 선택에 필요한 정보만 정리했습니다.
          </h2>
        </div>
        <p className="hidden max-w-xl text-sm leading-7 text-[color:var(--text-muted)] lg:block">
          기수별 소개 문구와 수료생 수를 먼저 확인한 뒤, 상세 화면에서 수료생별 포트폴리오 구성으로 넘어갑니다.
        </p>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        {cohorts.map((cohort, index) => (
          <Link
            key={cohort.id}
            href={`/cohorts/${cohort.id}`}
            className={[
              "group rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_20px_48px_var(--shadow-tint)]",
              index === 0 ? "lg:-translate-y-2" : ""
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">{cohort.program}</p>
                <h3 className="font-display mt-3 text-2xl leading-tight tracking-tight text-neutral-950">{cohort.name}</h3>
                <p className="mt-3 max-w-[34ch] text-sm leading-7 text-[color:var(--text-muted)]">{cohort.tagline}</p>
              </div>
              <div className="rounded-[1.25rem] bg-neutral-950 px-4 py-3 text-center text-white">
                <p className="text-[11px] tracking-[0.16em] text-white/58 uppercase">Students</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{cohort.studentCount}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-[color:var(--accent-soft)] px-4 py-4">
              <p className="text-sm leading-7 text-[color:var(--text-default)]">{cohort.summary}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-[color:var(--text-muted)]">수료일 {formatDate(cohort.graduationDate)}</p>
              <span className="inline-flex items-center rounded-full border border-[color:var(--accent-soft)] px-4 py-2 text-sm font-medium text-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white">
                기수 상세 보기
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
