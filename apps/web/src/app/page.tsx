import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* ── Hero — Asymmetric Split ── */}
      <section className="relative overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_50%,rgba(180,83,9,0.06),transparent),radial-gradient(ellipse_50%_60%_at_80%_20%,rgba(120,113,108,0.04),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--border-soft)]" />

        <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-7xl gap-16 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:py-10">
          <div className="flex flex-col">
            <header className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 4C10 4 5 4.5 3 6v13c2-1 7-1.5 9-1.5S19 18 21 19V6c-2-1.5-7-2-9-2Z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 4v14.5" stroke="var(--accent)" strokeWidth="1.5" />
                </svg>
                <span className="font-display text-lg font-semibold tracking-tight text-[color:var(--foreground)]">Foliocraft</span>
              </span>
              <Link
                href="/dashboard"
                className="rounded-lg border border-[color:var(--border-mid)] px-4 py-2 text-sm font-medium text-[color:var(--text-default)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] hover:scale-[1.02]"
              >
                대시보드
              </Link>
            </header>

            <div className="flex flex-1 flex-col justify-center py-16 lg:py-12">
              <p className="animate-fade-up text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">Portfolio Book Studio</p>
              <h1 className="animate-fade-up delay-1 font-display mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-6xl">
                수료생의 성장을 한 권의 책으로
              </h1>
              <p className="animate-fade-up delay-2 mt-8 max-w-[38rem] text-base leading-8 text-[color:var(--text-muted)]" style={{ maxWidth: "65ch" }}>
                프로젝트, 회고, 활동 사진을 엮어 수료 기념 포트폴리오를 제작합니다.
                운영자는 기수와 수료생 데이터를 바탕으로 결과물을 만들고 주문할 수 있습니다.
              </p>
              <div className="animate-fade-up delay-3 mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:scale-[1.02]"
                >
                  데모 대시보드 보기
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
                <a
                  href="#book-types"
                  className="inline-flex items-center rounded-xl border border-[color:var(--border-mid)] px-8 py-4 text-lg font-medium text-[color:var(--text-default)] hover:border-[color:var(--text-muted)] hover:scale-[1.02]"
                >
                  책 종류 살펴보기
                </a>
              </div>
            </div>
          </div>

          {/* Hero right — Perspective book covers */}
          <div className="relative hidden items-center justify-center lg:flex" style={{ perspective: "1200px" }}>
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--accent)] opacity-[0.04] blur-[120px]" />

            {/* Back book */}
            <div
              className="animate-fade-up delay-4 absolute left-1/2 top-1/2 flex h-[440px] w-[310px] flex-col justify-between rounded-sm border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] p-8 shadow-[0_30px_60px_var(--shadow-tint)]"
              style={{ transform: "translate(-38%, -48%) rotateY(-6deg) rotateX(2deg)" }}
            >
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-[color:var(--text-dim)] uppercase">Cohort Showcase</p>
                <div className="mt-4 h-px w-12 bg-[color:var(--text-dim)]" />
                <p className="font-display mt-4 text-xl font-semibold leading-tight text-[color:var(--text-muted)]">웹 풀스택<br />5기 아카이브</p>
              </div>
              <p className="text-[10px] tracking-[0.15em] text-[color:var(--text-dim)] uppercase">Foliocraft</p>
            </div>

            {/* Front book */}
            <div
              className="animate-fade-up delay-3 relative flex h-[460px] w-[320px] flex-col overflow-hidden rounded-sm shadow-[0_40px_80px_var(--shadow-tint)]"
              style={{ transform: "translateX(8%) rotateY(-4deg) rotateX(1deg)" }}
            >
              <div className="absolute inset-y-0 left-0 w-2 bg-[color:var(--accent)]" />
              <div className="flex flex-1 flex-col justify-between border border-[color:var(--border-mid)] bg-[color:var(--surface)] p-8 pl-10">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">Graduation Portfolio</p>
                  <div className="mt-6 h-px w-16 bg-[color:var(--accent)] opacity-40" />
                  <h2 className="font-display mt-6 text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)]">김코드</h2>
                  <p className="mt-2 text-sm text-[color:var(--text-muted)]">웹 풀스택 5기</p>
                </div>
                <div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-[color:var(--border-soft)]" />
                      <p className="text-[10px] tracking-[0.15em] text-[color:var(--text-dim)] uppercase">Projects</p>
                    </div>
                    <p className="text-sm font-medium text-[color:var(--text-default)]">StudyFlow</p>
                    <p className="text-xs leading-5 text-[color:var(--text-dim)]">운영자 대시보드와 백엔드 API 설계</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--text-dim)] uppercase">Foliocraft</p>
                    <p className="text-[10px] tabular-nums tracking-[0.1em] text-[color:var(--text-dim)]">2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: 결과물 소개 — Bento Grid ── */}
      <section className="relative border-b border-[color:var(--border-soft)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-32">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">이런 결과물이 만들어집니다</p>
              <h2 className="font-display mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">
                프로젝트와 성장 기록이 한 권의 책이 됩니다
              </h2>
            </div>
            <div className="hidden h-px w-32 bg-[color:var(--border-mid)] lg:block" />
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <article className="group rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-7 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:border-[color:var(--accent)]/20 hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">프로젝트 소개 페이지</p>
              <p className="mt-4 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">수료생의 대표 프로젝트, 기여 내용, 기술 스택을 구조화된 레이아웃으로 정리합니다.</p>
              <div className="mt-6 grid gap-3 rounded-xl bg-[color:var(--surface-elevated)] p-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4">
                  <p className="text-xs font-semibold text-[color:var(--accent)]">StudyFlow</p>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--text-muted)]">학습 관리 플랫폼의 운영자 대시보드와 백엔드 API를 설계하고 구현</p>
                </div>
                <div className="rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4">
                  <p className="text-xs font-semibold text-[color:var(--accent)]">기술 스택</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Node.js", "PostgreSQL"].map(t => (
                      <span key={t} className="rounded border border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--accent)]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            <div className="grid gap-4">
              <article className="group rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-7 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:border-[color:var(--accent)]/20 hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">회고 페이지</p>
                <p className="mt-4 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">수료생 본인의 회고와 멘토 코멘트를 함께 담습니다.</p>
              </article>
              <article className="group rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-7 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:border-[color:var(--accent)]/20 hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">활동 사진</p>
                <p className="mt-4 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">교육 기간의 활동 사진을 에디토리얼 레이아웃으로 배치합니다.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: 왜 필요한가 — Zig-zag Alternating ── */}
      <section className="relative border-b border-[color:var(--border-soft)] bg-[color:var(--surface)]">
        <div className="mx-auto grid w-full max-w-7xl gap-24 px-5 py-20 sm:px-8 md:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">수료 기념의 가치</p>
              <h3 className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-4xl">
                교육 과정의 성장과 결과를 한 권에 담아 수료생에게 의미 있는 기념품을 전달합니다
              </h3>
              <p className="mt-6 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">
                수료증 한 장이 아니라 프로젝트와 회고가 담긴 결과물입니다. 수료생은 한 시기의 프로젝트와 회고, 멘토 피드백을 물리적인 결과물로 받게 됩니다.
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--accent)]/15 bg-gradient-to-br from-[color:var(--accent-soft)] to-transparent p-8 shadow-[0_2px_16px_var(--shadow-tint)]">
              <p className="font-display text-7xl font-bold tabular-nums text-[color:var(--accent)]">1</p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">수료생 한 명의 서사</p>
              <p className="mt-3 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">기념 수료 페이지, 기술 스택, 대표 프로젝트, 회고, 멘토 코멘트, 활동 사진이 한 권의 흐름으로 이어집니다.</p>
            </div>
          </div>
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div className="order-2 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)] p-8 shadow-[0_2px_16px_var(--shadow-tint)] lg:order-1">
              <p className="font-display text-7xl font-bold tabular-nums text-[color:var(--text-dim)]">N</p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">기수 전체의 아카이브</p>
              <p className="mt-3 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">기수 소개, 수료생 요약, 대표 프로젝트 하이라이트를 한 권의 쇼케이스로 정리합니다.</p>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">교육 브랜드의 완성</p>
              <h3 className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-4xl">
                수료생 포트폴리오 북은 교육 기관의 브랜드 가치를 높이는 실물 결과물입니다
              </h3>
              <p className="mt-6 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">
                운영팀은 수료 경험을 기관 고유의 결과물로 정리하고 대외적으로 설명할 수 있습니다. 데모데이, 협력사 미팅, 채용 파트너에게 전달하는 브랜딩 자료가 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: 두 가지 책 종류 — Asymmetric Cards ── */}
      <section id="book-types" className="relative border-b border-[color:var(--border-soft)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-32">
          <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">두 가지 포트폴리오 북</p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">
            목적에 맞는 결과물을 선택합니다
          </h2>
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="group rounded-2xl border border-[color:var(--accent)]/20 bg-gradient-to-br from-[color:var(--accent-soft)] to-[color:var(--surface)] p-8 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]">
              <span className="inline-flex rounded-md bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white">메인</span>
              <h3 className="font-display mt-5 text-3xl font-bold tracking-tight text-[color:var(--foreground)]">개인 포트폴리오 북</h3>
              <p className="mt-4 max-w-prose text-sm leading-8 text-[color:var(--text-muted)]">
                수료생 한 명의 프로젝트와 성장 기록을 한 권으로 묶습니다. 기념 수료 페이지, 기술 스택, 대표 프로젝트, 회고, 멘토 코멘트를 포함합니다.
              </p>
            </article>
            <article className="group rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-8 shadow-[0_2px_16px_var(--shadow-tint)] transition-all hover:shadow-[0_8px_32px_var(--shadow-tint)] hover:scale-[1.01]">
              <h3 className="font-display mt-4 text-3xl font-bold tracking-tight text-[color:var(--foreground)]">기수 쇼케이스 북</h3>
              <p className="mt-4 max-w-prose text-sm leading-8 text-[color:var(--text-muted)]">
                기수 전체의 수료생과 대표 프로젝트를 한 권의 아카이브로 정리합니다. 부트캠프의 브랜딩 자료로 활용됩니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Section 5: 운영 흐름 — Horizontal Steps ── */}
      <section className="relative border-b border-[color:var(--border-soft)] bg-[color:var(--surface)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-32">
          <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">간단한 운영 흐름</p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">
            6단계로 결과물을 완성합니다
          </h2>
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {["기수 선택", "수료생 확인", "책 종류 선택", "내용 편집", "북 생성", "주문 완료"].map((step, index) => (
              <div key={step} className="group flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--accent)]/20 bg-[color:var(--accent-soft)] text-base font-bold tabular-nums text-[color:var(--accent)] transition-all group-hover:bg-[color:var(--accent)] group-hover:text-white group-hover:scale-110">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-medium text-[color:var(--text-default)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: CTA — Full-bleed Dramatic ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,rgba(180,83,9,0.06),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 md:py-32">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">
            지금 바로 시작하세요
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-muted)]">
            데모 대시보드에서 기수와 수료생 데이터를 실제 흐름처럼 확인하고, 결과물을 직접 만들어 볼 수 있습니다.
          </p>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:scale-[1.02]"
          >
            대시보드 둘러보기 <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── Footer — Minimal ── */}
      <footer className="border-t border-[color:var(--border-soft)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <span className="inline-flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 4C10 4 5 4.5 3 6v13c2-1 7-1.5 9-1.5S19 18 21 19V6c-2-1.5-7-2-9-2Z" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 4v14.5" stroke="var(--text-dim)" strokeWidth="1.5" />
            </svg>
            <span className="text-sm font-semibold text-[color:var(--text-muted)]">Foliocraft</span>
          </span>
          <p className="text-xs text-[color:var(--text-dim)]">&copy; 2026 Foliocraft</p>
        </div>
      </footer>
    </main>
  );
}
