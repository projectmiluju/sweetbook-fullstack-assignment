export default function StudentDetailLoading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <div className="h-5 w-32 animate-pulse rounded bg-[color:var(--surface-elevated)]" />

      <section className="mt-5 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <div className="h-3 w-20 animate-pulse rounded bg-[color:var(--accent-soft)]" />
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div className="h-10 w-40 animate-pulse rounded-lg bg-[color:var(--surface-elevated)] md:h-12" />
            <div className="mt-5 h-4 w-full animate-pulse rounded bg-[color:var(--surface-elevated)]" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
          </div>
          <div className="rounded-xl border border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--accent-soft)]" />
            <div className="mt-3 h-5 w-32 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-[color:var(--surface-elevated)]" />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-7 shadow-[0_2px_16px_var(--shadow-tint)]">
          <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--accent-soft)]" />
          <div className="mt-6 space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className={i > 0 ? "border-t border-[color:var(--border-soft)] pt-6" : ""}>
                <div className="h-7 w-36 animate-pulse rounded-lg bg-[color:var(--surface-elevated)]" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-[color:var(--surface-elevated)]" />
                <div className="mt-4 h-16 w-full animate-pulse rounded-xl bg-[color:var(--surface-elevated)]" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5">
          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <div className="h-3 w-16 animate-pulse rounded bg-[color:var(--accent-soft)]" />
            <div className="mt-4 flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-8 w-20 animate-pulse rounded-lg bg-[color:var(--surface-elevated)]" />)}
            </div>
          </div>
          <div className="rounded-2xl rounded-l-none border-l-2 border-[color:var(--accent)] bg-[color:var(--surface)] px-6 py-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <div className="h-3 w-12 animate-pulse rounded bg-[color:var(--accent-soft)]" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-[color:var(--surface-elevated)]" />
            <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
          </div>
          <div className="rounded-2xl rounded-l-none border-l-2 border-[color:var(--text-dim)] bg-[color:var(--surface)] px-6 py-6 shadow-[0_2px_16px_var(--shadow-tint)]">
            <div className="h-3 w-20 animate-pulse rounded bg-[color:var(--surface-elevated)]" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-[color:var(--surface-elevated)]" />
          </div>
        </div>
      </section>
    </main>
  );
}
