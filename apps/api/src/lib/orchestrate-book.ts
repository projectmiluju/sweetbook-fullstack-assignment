import type { Cohort, StudentPortfolio } from "../data/cohorts.js";
import { buildCoverPayload, buildContentsPayload } from "./payload-mapper.js";
import type { EditSessionInput } from "./payload-mapper.js";
import type { SweetBookClient } from "./sweetbook-api.js";

export interface OrchestrationInput {
  session: EditSessionInput;
  cohortId: string;
  studentId?: string;
  idempotencyKey: string;
}

export interface OrchestrationResult {
  bookUid: string;
  status: "completed";
}

export class OrchestrationError extends Error {
  constructor(
    message: string,
    public readonly step: "draft" | "cover" | "contents" | "finalize",
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "OrchestrationError";
  }
}

export async function orchestrateBook(
  input: OrchestrationInput,
  client: SweetBookClient,
  cohortsData: Cohort[]
): Promise<OrchestrationResult> {
  const { session, cohortId, studentId, idempotencyKey: key } = input;

  const cohort = cohortsData.find((c) => c.id === cohortId);
  if (!cohort) {
    throw new OrchestrationError(
      `기수를 찾을 수 없습니다: ${cohortId}`,
      "draft"
    );
  }

  const student: StudentPortfolio | undefined = studentId
    ? cohort.students.find((s) => s.id === studentId)
    : undefined;

  // 1단계: 초안 생성
  let bookUid: string;
  try {
    const draft = await client.createDraft(`${key}-draft`);
    bookUid = draft.bookUid;
  } catch (error) {
    throw new OrchestrationError("초안 생성 실패", "draft", error);
  }

  // 2단계: 표지 생성
  try {
    const coverPayload = buildCoverPayload(session, cohort, student);
    await client.createCover(bookUid, `${key}-cover`, coverPayload);
  } catch (error) {
    if (error instanceof OrchestrationError) throw error;
    throw new OrchestrationError("표지 생성 실패", "cover", error);
  }

  // 3단계: 내지 추가 (N회)
  try {
    const contentsPayloads = buildContentsPayload(session, cohort, student);
    for (let i = 0; i < contentsPayloads.length; i++) {
      await client.addContentsPage(
        bookUid,
        `${key}-contents-${i}`,
        contentsPayloads[i]
      );
    }
  } catch (error) {
    if (error instanceof OrchestrationError) throw error;
    throw new OrchestrationError("내지 추가 실패", "contents", error);
  }

  // 4단계: 최종화
  try {
    await client.finalize(bookUid, `${key}-finalize`);
  } catch (error) {
    if (error instanceof OrchestrationError) throw error;
    throw new OrchestrationError("최종화 실패", "finalize", error);
  }

  return { bookUid, status: "completed" };
}
