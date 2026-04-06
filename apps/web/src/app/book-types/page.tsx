import Link from "next/link";

import {
  BOOK_TYPE_IDS,
  BOOK_TYPE_LABELS,
  buildBookCreateHref,
  buildBookTypesBackHref,
  buildCohortBookCreateHref,
  buildCohortBookTypesBackHref
} from "@/lib/book-types";

const BOOK_TYPE_META = {
  individual: {
    eyebrow: "Main Option",
    purpose: "수료 기념과 개인 성과 아카이브",
    contents: "기념 수료 페이지, 기술 스택, 대표 프로젝트, 회고, 멘토 코멘트, 활동 사진",
    audience: "수료생 본인, 가족, 멘토, 채용 파트너",
    usage: "수료 기념품, 포트폴리오 보조 자료, 데모데이 소개용",
    summary: "수료생의 프로젝트와 회고를 한 사람의 서사로 정리하는 결과물입니다.",
    ctaLabel: "개인 북으로 이어가기"
  },
  "cohort-showcase": {
    eyebrow: "Secondary Option",
    purpose: "부트캠프 브랜딩과 기수 기록",
    contents: "기수 소개, 수료생 요약, 대표 프로젝트 하이라이트, 운영진 메시지, 활동 사진",
    audience: "부트캠프 운영팀, 협력사, 채용 파트너, 데모데이 참석자",
    usage: "브랜딩 자료, 기수 쇼케이스, 대외 공유용 인쇄물",
    summary: "한 기수 전체의 결과물을 한 권의 아카이브로 정리하는 결과물입니다.",
    ctaLabel: "기수 쇼케이스 북으로 이어가기"
  }
} as const;

interface BookTypesPageProps {
  searchParams: Promise<{ studentId?: string; cohortId?: string }>;
}

export default async function BookTypesPage({ searchParams }: BookTypesPageProps) {
  const { studentId, cohortId } = await searchParams;

  function getBackHref() {
    if (cohortId) return buildCohortBookTypesBackHref(cohortId);
    return buildBookTypesBackHref(studentId);
  }

  function getBackLabel() {
    if (cohortId) return "기수 상세로 돌아가기";
    if (studentId) return "수료생 상세로 돌아가기";
    return "대시보드로 돌아가기";
  }

  function getCreateHref(bookTypeId: string) {
    if (cohortId) return buildCohortBookCreateHref(cohortId, bookTypeId);
    return buildBookCreateHref(studentId, bookTypeId);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href={getBackHref()} className="text-sm font-medium text-[color:var(--accent)]">
        {getBackLabel()}
      </Link>

      <section className="mt-4 rounded-[2rem] bg-[color:var(--surface)] px-6 py-7 shadow-[0_18px_42px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">Book Selection</p>
        <h1 className="font-display mt-4 text-3xl leading-tight tracking-tight text-neutral-950 sm:text-5xl">
          어떤 기록을 남기시겠습니까?
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[color:var(--text-default)]">
          수료생 개인의 성장 기록을 남길 수도 있고, 기수 전체의 결과물을 한 권으로 정리할 수도 있습니다. 이 화면은 가격표가
          아니라 결과물의 목적과 활용 장면을 비교하는 단계입니다.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {BOOK_TYPE_IDS.map((id, index) => {
          const meta = BOOK_TYPE_META[id];
          const label = BOOK_TYPE_LABELS[id];
          return (
            <article
              key={id}
              className={[
                "rounded-[1.85rem] px-6 py-6 shadow-[0_18px_42px_var(--shadow-tint)]",
                index === 0 ? "bg-[linear-gradient(145deg,#fff9ee,#f2e4c7)]" : "bg-[color:var(--surface)]"
              ].join(" ")}
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">{meta.eyebrow}</p>
              <h2 className="font-display mt-3 text-3xl leading-tight tracking-tight text-neutral-950">{label.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-default)]">{meta.summary}</p>

              <dl className="mt-6 grid gap-4">
                <div>
                  <dt className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">목적</dt>
                  <dd className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">{meta.purpose}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">포함 콘텐츠</dt>
                  <dd className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">{meta.contents}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">대상</dt>
                  <dd className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">{meta.audience}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.16em] text-[color:var(--accent)] uppercase">활용 장면</dt>
                  <dd className="mt-2 text-sm leading-7 text-[color:var(--text-default)]">{meta.usage}</dd>
                </div>
              </dl>

              <Link
                href={getCreateHref(id)}
                className={[
                  "mt-8 inline-flex rounded-full px-5 py-3 text-sm font-medium",
                  index === 0 ? "bg-[color:var(--accent)] text-white" : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                ].join(" ")}
              >
                {meta.ctaLabel}
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
