import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createBook, getCohort, getCohorts } from "@/lib/api";
import type { EditSession } from "@/lib/edit-session";
import { findMockCohort, mockCohorts } from "@/lib/mock-data";

const MOCK_COHORT_RESPONSE = {
  cohorts: [
    {
      id: "cohort-test-01",
      name: "테스트 기수 1기",
      program: "SweetBookcamp Test",
      graduationDate: "2026-06-30",
      summary: "테스트용 기수 요약입니다.",
      tagline: "테스트 태그라인",
      studentCount: 3
    }
  ]
};

const MOCK_COHORT_DETAIL_RESPONSE = {
  cohort: {
    id: "cohort-test-01",
    name: "테스트 기수 1기",
    program: "SweetBookcamp Test",
    graduationDate: "2026-06-30",
    summary: "테스트용 기수 요약입니다.",
    tagline: "테스트 태그라인",
    studentCount: 1,
    students: [
      {
        id: "student-test-01",
        name: "테스트 수료생",
        roleTrack: "풀스택",
        bio: "테스트용 수료생입니다.",
        projectCount: 2,
        primaryProjectTitle: "테스트 프로젝트"
      }
    ]
  }
};

describe("getCohort", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("API 호출 성공 시 수료생 목록이 포함된 기수 상세를 반환해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_COHORT_DETAIL_RESPONSE)
    } as Response);

    // Act
    const result = await getCohort("cohort-test-01");

    // Assert
    expect(result.id).toBe("cohort-test-01");
    expect(result.students).toHaveLength(1);
  });

  it("API 실패 시 mock 데이터로 fallback해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockRejectedValue(new Error("Network Error"));
    const firstCohortId = mockCohorts[0].id;

    // Act
    const result = await getCohort(firstCohortId);

    // Assert
    expect(result.id).toBe(firstCohortId);
    expect(result.students).toBeDefined();
  });

  it("mock에도 없는 ID 조회 시 에러를 throw해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockRejectedValue(new Error("Network Error"));

    // Act & Assert
    await expect(getCohort("존재하지-않는-기수-id")).rejects.toThrow("기수를 찾을 수 없습니다.");
  });

  it("반환된 수료생 목록의 각 항목이 필수 필드를 포함해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockRejectedValue(new Error("Network Error"));
    const firstCohortId = mockCohorts[0].id;

    // Act
    const result = await getCohort(firstCohortId);

    // Assert
    for (const student of result.students) {
      expect(student).toHaveProperty("id");
      expect(student).toHaveProperty("name");
      expect(student).toHaveProperty("roleTrack");
      expect(student).toHaveProperty("projectCount");
      expect(student).toHaveProperty("primaryProjectTitle");
    }
  });

  it("기수의 studentCount와 실제 students 배열 길이가 일치해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockRejectedValue(new Error("Network Error"));

    // Act & Assert
    for (const cohortSummary of mockCohorts) {
      const detail = findMockCohort(cohortSummary.id);
      expect(detail?.students.length).toBe(cohortSummary.studentCount);
    }
  });
});

describe("getCohorts", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("API 호출 성공 시 기수 목록을 반환해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_COHORT_RESPONSE)
    } as Response);

    // Act
    const result = await getCohorts();

    // Assert
    expect(result).toEqual(MOCK_COHORT_RESPONSE.cohorts);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("cohort-test-01");
  });

  it("API 호출 실패(네트워크 오류) 시 mock 데이터로 fallback해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockRejectedValue(new Error("Network Error"));

    // Act
    const result = await getCohorts();

    // Assert
    expect(result).toEqual(mockCohorts);
    expect(result.length).toBeGreaterThan(0);
  });

  it("API 응답이 ok가 아닐 때 mock 데이터로 fallback해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    // Act
    const result = await getCohorts();

    // Assert
    expect(result).toEqual(mockCohorts);
  });

  it("반환된 기수 목록의 각 항목이 필수 필드를 포함해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_COHORT_RESPONSE)
    } as Response);

    // Act
    const result = await getCohorts();

    // Assert
    for (const cohort of result) {
      expect(cohort).toHaveProperty("id");
      expect(cohort).toHaveProperty("name");
      expect(cohort).toHaveProperty("program");
      expect(cohort).toHaveProperty("graduationDate");
      expect(cohort).toHaveProperty("studentCount");
    }
  });
});

// ────────────────────────────────────────────────
// createBook
// ────────────────────────────────────────────────

const MOCK_SESSION: EditSession = {
  bookType: "individual",
  customText: {
    coverTitle: "테스트 표지",
    graduationMessage: "축하합니다.",
  },
  hiddenBlocks: [],
  pages: ["project:0"],
};

describe("createBook", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("성공 응답 시 bookUid와 status를 반환해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-xyz-789", status: "completed" }),
    } as Response);

    // Act
    const result = await createBook({
      session: MOCK_SESSION,
      cohortId: "cohort-2026-01",
      studentId: "student-001",
      idempotencyKey: "test-key-001",
    });

    // Assert
    expect(result.bookUid).toBe("book-xyz-789");
    expect(result.status).toBe("completed");
  });

  it("POST /api/books URL로 요청해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-xyz-789", status: "completed" }),
    } as Response);

    // Act
    await createBook({
      session: MOCK_SESSION,
      cohortId: "cohort-2026-01",
      idempotencyKey: "test-key-001",
    });

    // Assert
    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain("/api/books");
  });

  it("Idempotency-Key 헤더가 포함되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-xyz-789", status: "completed" }),
    } as Response);

    // Act
    await createBook({
      session: MOCK_SESSION,
      cohortId: "cohort-2026-01",
      idempotencyKey: "my-unique-key",
    });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("my-unique-key");
  });

  it("Content-Type 헤더가 application/json이어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-xyz-789", status: "completed" }),
    } as Response);

    // Act
    await createBook({
      session: MOCK_SESSION,
      cohortId: "cohort-2026-01",
      idempotencyKey: "test-key-001",
    });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("요청 바디에 session과 cohortId가 포함되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-xyz-789", status: "completed" }),
    } as Response);

    // Act
    await createBook({
      session: MOCK_SESSION,
      cohortId: "cohort-2026-01",
      idempotencyKey: "test-key-001",
    });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(options?.body as string) as Record<string, unknown>;
    expect(body.cohortId).toBe("cohort-2026-01");
    expect(body.session).toBeDefined();
  });

  it("studentId 없이도 정상 호출되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bookUid: "book-cohort-001", status: "completed" }),
    } as Response);

    // Act
    const result = await createBook({
      session: { ...MOCK_SESSION, bookType: "cohort-showcase" },
      cohortId: "cohort-2026-01",
      idempotencyKey: "test-key-002",
    });

    // Assert
    expect(result.bookUid).toBe("book-cohort-001");
  });

  it("non-ok 응답 시 에러를 throw해야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.resolve({ message: "초안 생성 실패", step: "draft" }),
    } as Response);

    // Act & Assert
    await expect(
      createBook({
        session: MOCK_SESSION,
        cohortId: "cohort-2026-01",
        idempotencyKey: "test-key-003",
      })
    ).rejects.toThrow();
  });

  it("에러 응답 body의 message가 에러 메시지로 사용되어야 한다", async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.resolve({ message: "초안 생성 실패", step: "draft" }),
    } as Response);

    // Act & Assert
    await expect(
      createBook({
        session: MOCK_SESSION,
        cohortId: "cohort-2026-01",
        idempotencyKey: "test-key-003",
      })
    ).rejects.toThrow("초안 생성 실패");
  });
});
