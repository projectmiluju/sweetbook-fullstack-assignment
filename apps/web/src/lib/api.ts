import { findMockCohort, findMockStudent, mockCohorts } from "@/lib/mock-data";
import type { EditSession } from "@/lib/edit-session";

export interface CohortSummary {
  id: string;
  name: string;
  program: string;
  graduationDate: string;
  summary: string;
  tagline: string;
  studentCount: number;
}

export interface CohortStudentSummary {
  id: string;
  name: string;
  roleTrack: string;
  bio: string;
  projectCount: number;
  primaryProjectTitle: string;
}

export interface CohortDetail extends CohortSummary {
  students: CohortStudentSummary[];
}

export interface ProjectSummary {
  title: string;
  summary: string;
  contribution: string;
  links: string[];
}

export interface StudentPortfolio {
  id: string;
  name: string;
  roleTrack: string;
  bio: string;
  techStack: string[];
  projects: ProjectSummary[];
  retrospective: string;
  mentorComment: string;
  photos: string[];
  certificateMessage: string;
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_API_BASE_URL ?? "http://localhost:4000";
}

async function readJson<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      cache: "no-store"
    });
  } catch {
    throw new Error("API_UNAVAILABLE");
  }

  if (!response.ok) {
    throw new Error("데이터를 불러오지 못했습니다.");
  }

  return (await response.json()) as T;
}

export async function getCohorts() {
  try {
    const data = await readJson<{ cohorts: CohortSummary[] }>("/api/cohorts");
    return data.cohorts;
  } catch {
    return mockCohorts;
  }
}

export async function getCohort(cohortId: string) {
  try {
    const data = await readJson<{ cohort: CohortDetail }>(`/api/cohorts/${cohortId}`);
    return data.cohort;
  } catch {
    const cohort = findMockCohort(cohortId);

    if (!cohort) {
      throw new Error("기수를 찾을 수 없습니다.");
    }

    return cohort;
  }
}

export interface BookCreateResult {
  bookUid: string;
  status: "completed";
}

export interface CreditsData {
  balance: number;
  currency: string;
}

export interface OrderShipping {
  recipientName: string;
  recipientPhone: string;
  address1: string;
  postalCode: string;
}

export interface OrderResult {
  orderUid: string;
  status: string;
}

export async function createBook(params: {
  session: EditSession;
  cohortId: string;
  studentId?: string;
  idempotencyKey: string;
}): Promise<BookCreateResult> {
  const { session, cohortId, studentId, idempotencyKey } = params;

  const response = await fetch(`${getApiBaseUrl()}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ session, cohortId, studentId }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string; step?: string };
    throw new Error(body.message ?? "책 생성에 실패했습니다.");
  }

  return (await response.json()) as BookCreateResult;
}

export async function getCredits(): Promise<CreditsData> {
  const response = await fetch(`${getApiBaseUrl()}/api/credits`);
  if (!response.ok) {
    throw new Error("잔액 조회에 실패했습니다.");
  }
  return (await response.json()) as CreditsData;
}

export async function createOrder(params: {
  bookUid: string;
  shipping: OrderShipping;
  idempotencyKey: string;
}): Promise<OrderResult> {
  const { bookUid, shipping, idempotencyKey } = params;

  const response = await fetch(`${getApiBaseUrl()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ bookUid, shipping }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "주문 생성에 실패했습니다.");
  }

  return (await response.json()) as OrderResult;
}

export async function getStudent(studentId: string) {
  try {
    const data = await readJson<{ student: StudentPortfolio }>(`/api/students/${studentId}`);
    return data.student;
  } catch {
    const student = findMockStudent(studentId);

    if (!student) {
      throw new Error("수료생을 찾을 수 없습니다.");
    }

    return student;
  }
}
