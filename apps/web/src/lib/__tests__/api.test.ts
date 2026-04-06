import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCohorts } from "@/lib/api";
import { mockCohorts } from "@/lib/mock-data";

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
