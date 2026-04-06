export default function StudentDetailLoading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="h-4 w-28 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />

      <section className="mt-4 overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-7 shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8">
        <div className="h-3 w-20 animate-pulse rounded-full bg-white/20" />
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <div className="h-9 w-48 animate-pulse rounded-xl bg-white/20 sm:h-12" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/12" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-white/12" />
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5">
            <div className="h-3 w-32 animate-pulse rounded-full bg-white/20" />
            <div className="mt-3 h-5 w-40 animate-pulse rounded-lg bg-white/20" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-white/12" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-white/12" />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <div className="h-3 w-32 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
          <div className="mt-5 space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className={i > 0 ? "border-t border-black/5 pt-6" : ""}>
                <div className="h-7 w-40 animate-pulse rounded-xl bg-neutral-200" />
                <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-neutral-100" />
                <div className="mt-4 h-20 w-full animate-pulse rounded-[1.25rem] bg-neutral-100" />
                <div className="mt-4 flex gap-3">
                  <div className="h-8 w-24 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <div className="h-3 w-20 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
            <div className="mt-4 flex flex-wrap gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-neutral-100" />
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-neutral-100" />
          </div>
          <div className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <div className="h-3 w-28 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-neutral-100" />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className={i === 0 ? "sm:translate-y-3" : ""}>
                <div className="h-60 animate-pulse rounded-[1.5rem] bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-[linear-gradient(145deg,#fffaf1,#f4e7cf)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
          <div className="h-3 w-20 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
          <div className="mt-3 h-7 w-3/4 animate-pulse rounded-xl bg-neutral-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-neutral-200/60" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-neutral-200/60" />
          <div className="mt-6 h-10 w-32 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
        </div>
      </section>
    </main>
  );
}
