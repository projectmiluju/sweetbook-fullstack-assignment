export const BOOK_TYPE_IDS = ["individual", "cohort-showcase"] as const;

export type BookTypeId = (typeof BOOK_TYPE_IDS)[number];

export const BOOK_TYPE_LABELS: Record<BookTypeId, { title: string; description: string }> = {
  individual: {
    title: "개인 수료 포트폴리오 북",
    description: "수료생의 프로젝트, 기술 스택, 회고, 멘토 코멘트를 한 권으로 정리합니다."
  },
  "cohort-showcase": {
    title: "기수 쇼케이스 북",
    description: "기수 전체의 결과물을 하나의 쇼케이스 아카이브로 묶습니다."
  }
};

export function isValidBookType(id: string): id is BookTypeId {
  return (BOOK_TYPE_IDS as readonly string[]).includes(id);
}

export function buildBookCreateHref(studentId: string | undefined, bookTypeId: string): string {
  if (!studentId) return "/dashboard";
  return `/students/${studentId}/create?bookType=${bookTypeId}`;
}

export function buildBookTypesBackHref(studentId: string | undefined): string {
  if (!studentId) return "/dashboard";
  return `/students/${studentId}`;
}

export function buildCohortBookCreateHref(cohortId: string | undefined, bookTypeId: string): string {
  if (!cohortId) return "/dashboard";
  return `/cohorts/${cohortId}/create?bookType=${bookTypeId}`;
}

export function buildCohortBookTypesBackHref(cohortId: string | undefined): string {
  if (!cohortId) return "/dashboard";
  return `/cohorts/${cohortId}`;
}
