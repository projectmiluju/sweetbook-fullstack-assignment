import Link from "next/link";

import { BackLink } from "@/components/BackLink";
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
    eyebrow: "메인 옵션",
    purpose: "수료 기념과 개인 성과 아카이브",
    contents: "기념 수료 페이지, 기술 스택, 대표 프로젝트, 회고, 멘토 코멘트, 활동 사진",
    audience: "수료생 본인, 가족, 멘토, 채용 파트너",
    usage: "수료 기념품, 포트폴리오 보조 자료, 데모데이 소개용",
    summary: "수료생의 프로젝트와 회고를 한 사람의 서사로 정리하는 결과물입니다.",
    ctaLabel: "개인 북 만들기"
  },
  "cohort-showcase": {
    eyebrow: "보조 옵션",
    purpose: "부트캠프 브랜딩과 기수 기록",
    contents: "기수 소개, 수료생 요약, 대표 프로젝트 하이라이트, 운영진 메시지, 활동 사진",
    audience: "부트캠프 운영팀, 협력사, 채용 파트너, 데모데이 참석자",
    usage: "브랜딩 자료, 기수 쇼케이스, 대외 공유용 인쇄물",
    summary: "한 기수 전체의 결과물을 한 권의 아카이브로 정리하는 결과물입니다.",
    ctaLabel: "기수 북 만들기"
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-10">
      <BackLink href={getBackHref()}>{getBackLabel()}</BackLink>

      <section className="mt-5 animate-fade-up rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-10 shadow-[0_2px_16px_var(--shadow-tint)] sm:px-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">포트폴리오 북 선택</p>
        <h1 className="font-display mt-4 text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] [text-wrap:balance] md:text-5xl">
          어떤 포트폴리오 북을 만들까요?
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-8 text-[color:var(--text-muted)]">
          수료생 개인의 성장 기록을 남길 수도 있고, 기수 전체의 결과물을 한 권으로 정리할 수도 있습니다. 결과물의 목적과 활용 장면을 비교하는 단계입니다.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        {BOOK_TYPE_IDS.map((id, index) => {
          const meta = BOOK_TYPE_META[id];
          const label = BOOK_TYPE_LABELS[id];
          const isPrimary = index === 0;
          return (
            <article
              key={id}
              className={[
                "animate-fade-up rounded-2xl p-7 shadow-[0_2px_16px_var(--shadow-tint)]",
                isPrimary
                  ? "delay-1 border border-[color:var(--accent)]/20 bg-gradient-to-br from-[color:var(--accent-soft)] to-[color:var(--surface)]"
                  : "delay-2 border border-[color:var(--border-soft)] bg-[color:var(--surface)]"
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[color:var(--accent)] uppercase">{meta.eyebrow}</p>
                {isPrimary && (
                  <span className="rounded-md bg-[color:var(--accent)] px-2.5 py-0.5 text-[10px] font-semibold text-white">메인</span>
                )}
              </div>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)]">{label.title}</h2>
              <p className="mt-4 max-w-prose text-sm leading-7 text-[color:var(--text-muted)]">{meta.summary}</p>

              <dl className="mt-6 grid gap-4">
                {[
                  { label: "목적", value: meta.purpose },
                  { label: "포함 콘텐츠", value: meta.contents },
                  { label: "대상", value: meta.audience },
                  { label: "활용 장면", value: meta.usage },
                ].map(({ label: dtLabel, value }) => (
                  <div key={dtLabel} className="border-t border-[color:var(--border-soft)] pt-3">
                    <dt className="text-[10px] font-semibold tracking-[0.15em] text-[color:var(--text-dim)] uppercase">{dtLabel}</dt>
                    <dd className="mt-1 text-sm leading-7 text-[color:var(--text-default)]">{value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href={getCreateHref(id)}
                className={[
                  "mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold hover:scale-[1.02]",
                  isPrimary
                    ? "bg-[color:var(--accent)] text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)]"
                    : "border border-[color:var(--border-mid)] text-[color:var(--text-default)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                ].join(" ")}
              >
                {meta.ctaLabel} <span>&rarr;</span>
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
