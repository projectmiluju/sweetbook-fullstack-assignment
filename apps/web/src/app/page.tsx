import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-[linear-gradient(145deg,#f7f2e9,#f2e8d5)]">
        <div className="mx-auto grid min-h-[100dvh] w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:px-8 lg:py-10">
          <div className="flex flex-col">
            <header className="flex items-center justify-between rounded-full bg-white/78 px-5 py-3 shadow-[0_12px_28px_var(--shadow-tint)] backdrop-blur-xl">
              <div>
                <p className="text-sm font-semibold text-neutral-950">SweetBook Portfolio Books</p>
                <p className="text-xs text-[color:var(--text-muted)]">Bootcamp Graduation Archive</p>
              </div>
              <Link href="/dashboard" className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white">
                데모 보기
              </Link>
            </header>

            <div className="flex flex-1 flex-col justify-center py-14 lg:py-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">Individual Graduation Portfolio Book</p>
              <h1 className="font-display mt-5 max-w-3xl text-4xl leading-tight tracking-tight text-neutral-950 sm:text-6xl">
                수료생의 프로젝트와 성장 기록을 한 권의 포트폴리오 북으로 남깁니다.
              </h1>
              <p className="mt-6 max-w-[34rem] text-base leading-8 text-[color:var(--text-default)]">
                운영자는 기수와 수료생 데이터를 바탕으로 개인 수료 포트폴리오 북 또는 기수 쇼케이스 북을 만들 수 있습니다.
                첫 결과물은 수료 기념품이면서 동시에 부트캠프의 브랜딩 자산이 됩니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard" className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-medium text-white">
                  데모 대시보드 보기
                </Link>
                <a href="#book-types" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 shadow-[0_12px_24px_var(--shadow-tint)]">
                  책 종류 살펴보기
                </a>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-4 lg:py-0">
            <div className="absolute inset-x-6 top-10 h-40 rounded-full bg-[radial-gradient(circle,rgba(138,106,47,0.24),transparent_68%)] blur-3xl" />
            <div className="relative w-full max-w-xl rounded-[2.5rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] p-5 shadow-[0_40px_90px_var(--shadow-tint)]">
              <div className="rounded-[2rem] bg-[#f8f2e7] p-5">
                <div className="rounded-[1.65rem] bg-[#ede4d5] p-4">
                  <div className="grid gap-4 md:grid-cols-[0.74fr_1fr]">
                    <section className="rounded-[1.5rem] bg-[linear-gradient(165deg,#b58b4c,#7b581e)] p-5 text-white">
                      <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">Graduation Portfolio</p>
                      <h2 className="font-display mt-5 text-3xl leading-tight">웹 풀스택 5기</h2>
                      <p className="mt-10 text-sm leading-6 text-white/78">김코드의 수료 포트폴리오 북</p>
                    </section>
                    <div className="grid gap-4">
                      <section className="rounded-[1.5rem] bg-white p-5">
                        <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Commemorative Page</p>
                        <h3 className="font-display mt-4 text-2xl leading-tight text-neutral-950">수료를 기념하는 첫 장</h3>
                        <p className="mt-4 text-sm leading-7 text-[color:var(--text-default)]">
                          끝까지 완주한 성장과 몰입을 축하합니다. SweetBootcamp Web Fullstack 5기 수료를 기념합니다.
                        </p>
                      </section>
                      <section className="rounded-[1.5rem] bg-white px-5 py-4">
                        <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Project Preview</p>
                        <h3 className="mt-3 text-lg font-semibold text-neutral-950">StudyFlow</h3>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                          운영자 대시보드와 백엔드 API 설계를 함께 맡아 실제 제품 흐름을 완성한 프로젝트
                        </p>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[1.8rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)] md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Result First</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">수료증 한 장이 아니라 프로젝트와 회고가 담긴 결과물을 만듭니다.</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Brand Value</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">부트캠프의 수료 경험을 한 권의 브랜딩된 인쇄물로 정리합니다.</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Operator Flow</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">기수 선택부터 책 생성과 주문까지 운영자 중심 흐름으로 이어집니다.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">Why It Matters</p>
          <h2 className="font-display mt-4 text-3xl leading-tight tracking-tight text-neutral-950 sm:text-4xl">
            수료 기념품과 부트캠프 브랜딩 가치를 함께 남깁니다.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-[1.6rem] bg-[color:var(--surface)] px-5 py-5 shadow-[0_18px_36px_var(--shadow-tint)]">
            <h3 className="font-display text-2xl tracking-tight text-neutral-950">수료 기념품 가치</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
              수료생은 한 시기의 프로젝트와 회고, 멘토 피드백을 물리적인 결과물로 받게 됩니다.
            </p>
          </article>
          <article className="rounded-[1.6rem] bg-[color:var(--surface)] px-5 py-5 shadow-[0_18px_36px_var(--shadow-tint)]">
            <h3 className="font-display text-2xl tracking-tight text-neutral-950">부트캠프 브랜딩 가치</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
              운영팀은 수료 경험을 기관 고유의 결과물로 정리하고 대외적으로 설명할 수 있습니다.
            </p>
          </article>
        </div>
      </section>

      <section id="book-types" className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[2rem] bg-[linear-gradient(145deg,#fff9ee,#f2e4c7)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Main Book Type</p>
            <h3 className="font-display mt-3 text-3xl tracking-tight text-neutral-950">개인 수료 포트폴리오 북</h3>
            <p className="mt-4 text-base leading-8 text-[color:var(--text-default)]">
              한 명의 수료생을 중심으로 기념 수료 페이지, 기술 스택, 대표 프로젝트, 회고, 멘토 코멘트를 한 권으로 묶습니다.
            </p>
          </article>
          <article className="rounded-[2rem] bg-[color:var(--surface)] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Secondary Book Type</p>
            <h3 className="font-display mt-3 text-3xl tracking-tight text-neutral-950">기수 쇼케이스 북</h3>
            <p className="mt-4 text-base leading-8 text-[color:var(--text-default)]">
              기수 전체의 수료생과 대표 프로젝트를 편집 방식으로 정리해 부트캠프의 결과물로 남깁니다.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">Operator Workflow</p>
          <h2 className="font-display mt-4 text-3xl leading-tight tracking-tight text-neutral-950 sm:text-4xl">
            운영 흐름은 단순하고 결과물은 깊게 남습니다.
          </h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {["기수 선택", "수료생 검토", "책 종류 선택", "편집", "책 생성", "주문"].map((step, index) => (
            <li key={step} className="rounded-[1.4rem] bg-[color:var(--surface)] px-5 py-5 shadow-[0_16px_34px_var(--shadow-tint)]">
              <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">Step {index + 1}</p>
              <p className="font-display mt-3 text-2xl tracking-tight text-neutral-950">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[linear-gradient(145deg,var(--hero-dark),var(--hero-deep))] px-6 py-10 text-white shadow-[0_32px_72px_var(--shadow-tint)] sm:px-8">
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            결과물이 먼저 보이는 데모 흐름부터 확인해보세요.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
            랜딩에서 결과물을 이해한 뒤, 운영자 대시보드로 이동해 기수와 수료생 데이터를 실제 흐름처럼 확인할 수 있습니다.
          </p>
          <Link href="/dashboard" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950">
            데모 대시보드 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
