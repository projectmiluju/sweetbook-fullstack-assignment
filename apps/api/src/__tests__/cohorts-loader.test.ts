import { describe, it, expect } from "vitest";
import { cohorts } from "../data/cohorts.js";
import type { Cohort, StudentPortfolio } from "../data/cohorts.js";

describe("cohorts JSON 로더", () => {
  it("cohorts 배열이 1개 이상의 기수를 포함해야 한다", () => {
    expect(cohorts.length).toBeGreaterThanOrEqual(1);
  });

  it("각 cohort가 필수 필드를 가져야 한다", () => {
    for (const cohort of cohorts) {
      expect(cohort.id).toEqual(expect.any(String));
      expect(cohort.name).toEqual(expect.any(String));
      expect(cohort.program).toEqual(expect.any(String));
      expect(cohort.graduationDate).toEqual(expect.any(String));
      expect(cohort.summary).toEqual(expect.any(String));
      expect(cohort.tagline).toEqual(expect.any(String));
      expect(Array.isArray(cohort.students)).toBe(true);
    }
  });

  it("각 student가 필수 필드를 가져야 한다", () => {
    const students = cohorts.flatMap((c) => c.students);
    expect(students.length).toBeGreaterThanOrEqual(1);

    for (const student of students) {
      expect(student.id).toEqual(expect.any(String));
      expect(student.name).toEqual(expect.any(String));
      expect(student.roleTrack).toEqual(expect.any(String));
      expect(student.bio).toEqual(expect.any(String));
      expect(Array.isArray(student.techStack)).toBe(true);
      expect(Array.isArray(student.projects)).toBe(true);
      expect(Array.isArray(student.photos)).toBe(true);
      expect(student.retrospective).toEqual(expect.any(String));
      expect(student.mentorComment).toEqual(expect.any(String));
      expect(student.certificateMessage).toEqual(expect.any(String));
    }
  });

  it("기존 데이터와 동일한 cohort-2026-01이 존재해야 한다", () => {
    const cohort = cohorts.find((c) => c.id === "cohort-2026-01");
    expect(cohort).toBeDefined();
    expect(cohort!.name).toBe("웹 풀스택 5기");
    expect(cohort!.students.length).toBe(2);
  });

  it("기존 데이터와 동일한 student-001이 존재해야 한다", () => {
    const student = cohorts
      .flatMap((c) => c.students)
      .find((s) => s.id === "student-001");
    expect(student).toBeDefined();
    expect(student!.name).toBe("김코드");
    expect(student!.projects.length).toBe(2);
    expect(student!.projects[0].title).toBe("StudyFlow");
  });

  it("각 project가 필수 필드를 가져야 한다", () => {
    const projects = cohorts
      .flatMap((c) => c.students)
      .flatMap((s) => s.projects);
    expect(projects.length).toBeGreaterThanOrEqual(1);

    for (const project of projects) {
      expect(project.title).toEqual(expect.any(String));
      expect(project.summary).toEqual(expect.any(String));
      expect(project.contribution).toEqual(expect.any(String));
      expect(Array.isArray(project.links)).toBe(true);
    }
  });
});
