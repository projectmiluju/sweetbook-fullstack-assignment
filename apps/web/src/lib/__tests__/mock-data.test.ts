import { describe, expect, it } from "vitest";

import { findMockCohort, findMockStudent, mockCohorts } from "@/lib/mock-data";

describe("mockCohorts", () => {
  it("mock 기수 목록이 비어 있지 않아야 한다", () => {
    expect(mockCohorts.length).toBeGreaterThan(0);
  });

  it("각 기수가 필수 필드를 모두 포함해야 한다", () => {
    for (const cohort of mockCohorts) {
      expect(cohort.id).toBeTruthy();
      expect(cohort.name).toBeTruthy();
      expect(cohort.program).toBeTruthy();
      expect(cohort.graduationDate).toBeTruthy();
      expect(cohort.studentCount).toBeGreaterThan(0);
    }
  });

  it("기수의 studentCount가 실제 수료생 수와 일치해야 한다", () => {
    for (const cohort of mockCohorts) {
      expect(typeof cohort.studentCount).toBe("number");
      expect(cohort.studentCount).toBeGreaterThanOrEqual(0);
    }
  });

  it("graduationDate가 유효한 날짜 형식(YYYY-MM-DD)이어야 한다", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const cohort of mockCohorts) {
      expect(cohort.graduationDate).toMatch(dateRegex);
      expect(new Date(cohort.graduationDate).toString()).not.toBe("Invalid Date");
    }
  });
});

describe("findMockCohort", () => {
  it("존재하는 ID로 조회 시 기수를 반환해야 한다", () => {
    const firstCohort = mockCohorts[0];
    const result = findMockCohort(firstCohort.id);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(firstCohort.id);
  });

  it("존재하지 않는 ID로 조회 시 null을 반환해야 한다", () => {
    const result = findMockCohort("존재하지-않는-기수-id");

    expect(result).toBeNull();
  });

  it("반환된 기수 상세에 수료생 목록이 포함되어야 한다", () => {
    const result = findMockCohort(mockCohorts[0].id);

    expect(result?.students).toBeDefined();
    expect(result?.students.length).toBeGreaterThan(0);
  });
});

describe("findMockStudent", () => {
  it("존재하는 ID로 조회 시 수료생을 반환해야 한다", () => {
    const result = findMockStudent("student-001");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("student-001");
  });

  it("존재하지 않는 ID로 조회 시 null을 반환해야 한다", () => {
    const result = findMockStudent("존재하지-않는-수료생-id");

    expect(result).toBeNull();
  });
});
