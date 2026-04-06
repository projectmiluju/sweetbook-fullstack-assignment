import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCohort, getCohorts } from "@/lib/api";
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
