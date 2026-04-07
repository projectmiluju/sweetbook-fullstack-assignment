export default function DashboardLoading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <section className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <div className="h-3 w-32 animate-pulse rounded bg-[color:var(--accent-soft)]" />
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_240px] lg:items-start">
          <div>
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-[color:var(--surface-elevated)] md:h-12" />
            <div className="mt-5 h-4 w-full animate-pulse rounded bg-[color:var(--surface-elevated)]" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
          </div>
          <div className="hidden rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] p-5 lg:block">
            <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--border-soft)]" />
            <div className="mt-3 h-10 w-14 animate-pulse rounded-lg bg-[color:var(--border-soft)]" />
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--accent-soft)]" />
        <div className="mt-3 h-8 w-72 animate-pulse rounded-lg bg-[color:var(--surface-elevated)]" />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-3 w-28 animate-pulse rounded bg-[color:var(--accent-soft)]" />
                <div className="mt-3 h-7 w-40 animate-pulse rounded-lg bg-[color:var(--surface-elevated)]" />
                <div className="mt-3 h-4 w-52 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
              </div>
              <div className="rounded-xl border border-[color:var(--border-mid)] bg-[color:var(--surface-elevated)] px-4 py-3">
                <div className="h-3 w-10 animate-pulse rounded bg-[color:var(--border-soft)]" />
                <div className="mt-1 h-7 w-8 animate-pulse rounded bg-[color:var(--border-soft)]" />
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] px-4 py-4">
              <div className="h-4 w-full animate-pulse rounded bg-[color:var(--border-soft)]" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[color:var(--border-soft)]" />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
              <div className="h-9 w-28 animate-pulse rounded-lg bg-[color:var(--surface-elevated)]" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
