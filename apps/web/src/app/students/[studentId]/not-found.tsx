import Link from "next/link";

export default function StudentNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.22em] text-[color:var(--accent)] uppercase">404 Not Found</p>
      <h1 className="font-display mt-4 text-3xl tracking-tight text-neutral-950 sm:text-4xl">
        수료생을 찾을 수 없습니다
      </h1>
      <p className="mt-4 max-w-sm text-center text-sm leading-7 text-[color:var(--text-muted)]">
        요청한 수료생 정보가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-medium text-white"
      >
        대시보드로 돌아가기
      </Link>
    </main>
  );
}
