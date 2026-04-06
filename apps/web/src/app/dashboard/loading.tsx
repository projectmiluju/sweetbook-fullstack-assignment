export default function DashboardLoading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-7 shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8 sm:py-9">
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/20" />
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-end">
          <div>
            <div className="h-8 w-3/4 animate-pulse rounded-xl bg-white/20 sm:h-12" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/12" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-white/12" />
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5">
            <div className="h-3 w-28 animate-pulse rounded-full bg-white/20" />
            <div className="mt-3 h-10 w-16 animate-pulse rounded-lg bg-white/20" />
            <div className="mt-3 h-4 w-36 animate-pulse rounded-full bg-white/12" />
          </div>
        </div>
      </section>

      <section className="mt-10 flex items-end justify-between gap-6">
        <div>
          <div className="h-3 w-24 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
          <div className="mt-2 h-7 w-72 animate-pulse rounded-xl bg-neutral-200 sm:h-9" />
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={[
              "rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_20px_48px_var(--shadow-tint)]",
              i === 0 ? "lg:-translate-y-2" : ""
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-3 w-40 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
                <div className="mt-3 h-7 w-48 animate-pulse rounded-xl bg-neutral-200" />
                <div className="mt-3 h-4 w-56 animate-pulse rounded-full bg-neutral-100" />
              </div>
              <div className="rounded-[1.25rem] bg-neutral-100 px-4 py-3">
                <div className="h-3 w-14 animate-pulse rounded-full bg-neutral-200" />
                <div className="mt-2 h-9 w-10 animate-pulse rounded-lg bg-neutral-200" />
              </div>
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-[color:var(--accent-soft)] px-4 py-4">
              <div className="h-4 w-full animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
