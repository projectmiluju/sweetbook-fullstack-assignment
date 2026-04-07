import Link from "next/link";

export default function StudentNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 py-24 sm:px-8">
      <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">404 Not Found</p>
      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-4xl">
        수료생을 찾을 수 없습니다
      </h1>
      <p className="mt-4 max-w-sm text-center text-sm leading-7 text-[color:var(--text-muted)]">
        요청한 수료생 정보가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] hover:scale-[1.02]"
      >
        대시보드로 돌아가기 <span>&rarr;</span>
      </Link>
    </main>
  );
}
