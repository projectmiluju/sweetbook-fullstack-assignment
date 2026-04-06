export default function CohortDetailLoading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="h-4 w-28 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />

      <section className="mt-4 rounded-[2rem] bg-[color:var(--surface)] px-6 py-7 shadow-[0_20px_48px_var(--shadow-tint)] sm:px-8">
        <div className="h-3 w-40 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div>
            <div className="h-9 w-2/3 animate-pulse rounded-xl bg-neutral-200 sm:h-12" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-neutral-100" />
          </div>
          <aside className="grid gap-3 rounded-[1.5rem] bg-[color:var(--accent-soft)] p-5">
            <div>
              <div className="h-3 w-20 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
              <div className="mt-2 h-6 w-32 animate-pulse rounded-lg bg-neutral-200" />
            </div>
            <div>
              <div className="h-3 w-16 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
              <div className="mt-2 h-6 w-12 animate-pulse rounded-lg bg-neutral-200" />
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-10 flex items-end justify-between gap-6">
        <div>
          <div className="h-3 w-36 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
          <div className="mt-2 h-7 w-80 animate-pulse rounded-xl bg-neutral-200 sm:h-9" />
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={[
              "rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]",
              i % 2 === 1 ? "lg:translate-y-4" : ""
            ].join(" ")}
          >
            <div className="h-3 w-20 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
            <div className="mt-3 h-7 w-32 animate-pulse rounded-xl bg-neutral-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-6 rounded-[1.5rem] bg-[#f6f1e8] px-4 py-4">
              <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-2 h-6 w-48 animate-pulse rounded-lg bg-neutral-200" />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
