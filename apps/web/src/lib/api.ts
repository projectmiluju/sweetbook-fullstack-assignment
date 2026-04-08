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
  id?: string;
  title: string;
  summary: string;
  contribution: string;
  links: string[];
}

export interface RetrospectiveData {
  before?: string;
  process?: string;
  turning?: string;
  difficulty?: string;
  overcome?: string;
  learned?: string;
}

export interface StudentPortfolio {
  id: string;
  cohortId?: string;
  name: string;
  roleTrack: string;
  bio: string;
  techStack: string[];
  projects: ProjectSummary[];
  retrospective: string | RetrospectiveData;
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

export interface PreviewPagePayload {
  templateUid: string;
  parameters: Record<string, string>;
}

export interface PreviewPayloadResult {
  cover: PreviewPagePayload;
  contents: PreviewPagePayload[];
}

export async function getPreviewPayload(params: {
  session: EditSession;
  cohortId: string;
  studentId?: string;
}): Promise<PreviewPayloadResult> {
  const { session, cohortId, studentId } = params;

  const response = await fetch(`${getApiBaseUrl()}/api/preview-payload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session, cohortId, studentId }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "프리뷰 페이로드를 불러오지 못했습니다.");
  }

  return (await response.json()) as PreviewPayloadResult;
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

// ────────────────────────────────────────────────
// Cohort CRUD (#77)
// ────────────────────────────────────────────────

export interface CohortInput {
  name: string;
  program: string;
  graduationDate: string; // YYYY-MM-DD
  summary: string;
  tagline: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? "요청에 실패했습니다.");
  }
  return (await response.json()) as T;
}

async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? "요청에 실패했습니다.");
  }
  return (await response.json()) as T;
}

async function deleteRequest(path: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? "삭제에 실패했습니다.");
  }
}

export async function createCohort(input: CohortInput): Promise<CohortDetail> {
  const data = await postJson<{ cohort: CohortDetail }>("/api/cohorts", input);
  return data.cohort;
}

export async function updateCohort(
  cohortId: string,
  input: Partial<CohortInput>
): Promise<CohortDetail> {
  const data = await patchJson<{ cohort: CohortDetail }>(
    `/api/cohorts/${cohortId}`,
    input
  );
  return data.cohort;
}

export async function deleteCohort(cohortId: string): Promise<void> {
  await deleteRequest(`/api/cohorts/${cohortId}`);
}

// ────────────────────────────────────────────────
// Student CRUD (#78)
// ────────────────────────────────────────────────

export interface StudentInput {
  name: string;
  roleTrack: string;
  bio: string;
  techStack: string[];
  mentorComment: string;
  photos: string[];
  certificateMessage: string;
}

export async function createStudent(
  cohortId: string,
  input: StudentInput
): Promise<StudentPortfolio> {
  const data = await postJson<{ student: StudentPortfolio }>(
    `/api/cohorts/${cohortId}/students`,
    input
  );
  return data.student;
}

export async function updateStudent(
  studentId: string,
  input: Partial<StudentInput>
): Promise<StudentPortfolio> {
  const data = await patchJson<{ student: StudentPortfolio }>(
    `/api/students/${studentId}`,
    input
  );
  return data.student;
}

export async function deleteStudent(studentId: string): Promise<void> {
  await deleteRequest(`/api/students/${studentId}`);
}

// ────────────────────────────────────────────────
// Project CRUD (#79)
// ────────────────────────────────────────────────

export interface ProjectInput {
  title: string;
  summary: string;
  contribution: string;
  links: string[];
}

export interface ProjectRecord extends ProjectSummary {
  id: string;
}

export async function createProject(
  studentId: string,
  input: ProjectInput
): Promise<ProjectRecord> {
  const data = await postJson<{ project: ProjectRecord }>(
    `/api/students/${studentId}/projects`,
    input
  );
  return data.project;
}

export async function updateProject(
  projectId: string,
  input: Partial<ProjectInput>
): Promise<ProjectRecord> {
  const data = await patchJson<{ project: ProjectRecord }>(
    `/api/projects/${projectId}`,
    input
  );
  return data.project;
}

export async function deleteProject(projectId: string): Promise<void> {
  await deleteRequest(`/api/projects/${projectId}`);
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
