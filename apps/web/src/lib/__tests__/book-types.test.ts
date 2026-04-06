import { describe, expect, it } from "vitest";

import {
  BOOK_TYPE_IDS,
  BOOK_TYPE_LABELS,
  buildBookCreateHref,
  buildBookTypesBackHref,
  isValidBookType
} from "@/lib/book-types";

describe("BOOK_TYPE_IDS", () => {
  it("individual 타입이 포함되어 있어야 한다", () => {
    expect(BOOK_TYPE_IDS).toContain("individual");
  });

  it("cohort-showcase 타입이 포함되어 있어야 한다", () => {
    expect(BOOK_TYPE_IDS).toContain("cohort-showcase");
  });

  it("정확히 2개의 타입만 존재해야 한다", () => {
    expect(BOOK_TYPE_IDS).toHaveLength(2);
  });
});

describe("BOOK_TYPE_LABELS", () => {
  it("individual 타입의 title이 존재해야 한다", () => {
    expect(BOOK_TYPE_LABELS.individual.title).toBeTruthy();
  });

  it("cohort-showcase 타입의 title이 존재해야 한다", () => {
    expect(BOOK_TYPE_LABELS["cohort-showcase"].title).toBeTruthy();
  });

  it("각 타입에 description이 존재해야 한다", () => {
    expect(BOOK_TYPE_LABELS.individual.description).toBeTruthy();
    expect(BOOK_TYPE_LABELS["cohort-showcase"].description).toBeTruthy();
  });
});

describe("isValidBookType", () => {
  it("'individual'은 유효한 타입이어야 한다", () => {
    expect(isValidBookType("individual")).toBe(true);
  });

  it("'cohort-showcase'는 유효한 타입이어야 한다", () => {
    expect(isValidBookType("cohort-showcase")).toBe(true);
  });

  it("빈 문자열은 유효하지 않아야 한다", () => {
    expect(isValidBookType("")).toBe(false);
  });

  it("대소문자가 다른 값('INDIVIDUAL')은 유효하지 않아야 한다", () => {
    expect(isValidBookType("INDIVIDUAL")).toBe(false);
  });

  it("알 수 없는 타입('unknown')은 유효하지 않아야 한다", () => {
    expect(isValidBookType("unknown")).toBe(false);
  });

  it("공백이 포함된 값(' individual')은 유효하지 않아야 한다", () => {
    expect(isValidBookType(" individual")).toBe(false);
  });
});

describe("buildBookCreateHref", () => {
  it("studentId가 있으면 개인 북 create URL을 반환해야 한다", () => {
    expect(buildBookCreateHref("student-1", "individual")).toBe(
      "/students/student-1/create?bookType=individual"
    );
  });

  it("studentId가 있으면 기수 쇼케이스 북 create URL을 반환해야 한다", () => {
    expect(buildBookCreateHref("student-1", "cohort-showcase")).toBe(
      "/students/student-1/create?bookType=cohort-showcase"
    );
  });

  it("studentId가 undefined면 /dashboard를 반환해야 한다", () => {
    expect(buildBookCreateHref(undefined, "individual")).toBe("/dashboard");
  });

  it("studentId가 빈 문자열이면 /dashboard를 반환해야 한다", () => {
    expect(buildBookCreateHref("", "individual")).toBe("/dashboard");
  });

  it("studentId에 특수문자가 포함된 경우에도 URL을 올바르게 구성해야 한다", () => {
    expect(buildBookCreateHref("cohort-1-student-2", "individual")).toBe(
      "/students/cohort-1-student-2/create?bookType=individual"
    );
  });
});

describe("buildBookTypesBackHref", () => {
  it("studentId가 있으면 수료생 상세 URL을 반환해야 한다", () => {
    expect(buildBookTypesBackHref("student-1")).toBe("/students/student-1");
  });

  it("studentId가 undefined면 /dashboard를 반환해야 한다", () => {
    expect(buildBookTypesBackHref(undefined)).toBe("/dashboard");
  });

  it("studentId가 빈 문자열이면 /dashboard를 반환해야 한다", () => {
    expect(buildBookTypesBackHref("")).toBe("/dashboard");
  });
});
