import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createCohort,
  createProject,
  createStudent,
  deleteCohort,
  deleteProject,
  deleteStudent,
  updateCohort,
  updateProject,
  updateStudent,
} from "@/lib/api";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockSuccess<T>(body: T) {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
}

function mockError(status: number, message: string) {
  vi.mocked(fetch).mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  } as Response);
}

// ────────────────────────────────────────────────
// Cohort CRUD
// ────────────────────────────────────────────────

describe("createCohort", () => {
  it("백엔드 응답의 cohort를 unwrap해서 반환해야 한다", async () => {
    mockSuccess({
      cohort: {
        id: "c1",
        name: "기수1",
        program: "프로그램",
        graduationDate: "2026-04-30",
        summary: "요약",
        tagline: "태그",
        studentCount: 0,
        students: [],
      },
    });

    const result = await createCohort({
      name: "기수1",
      program: "프로그램",
      graduationDate: "2026-04-30",
      summary: "요약",
      tagline: "태그",
    });

    expect(result.id).toBe("c1");
    expect(result.name).toBe("기수1");
  });

  it("POST /api/cohorts 경로로 호출해야 한다", async () => {
    mockSuccess({ cohort: { id: "c1" } });
    await createCohort({
      name: "x",
      program: "x",
      graduationDate: "2026-01-01",
      summary: "x",
      tagline: "x",
    });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/cohorts");
    expect(call[1]?.method).toBe("POST");
  });

  it("실패 시 응답 message를 throw해야 한다", async () => {
    mockError(400, "name이 필요합니다.");
    await expect(
      createCohort({
        name: "",
        program: "x",
        graduationDate: "2026-01-01",
        summary: "x",
        tagline: "x",
      })
    ).rejects.toThrow("name이 필요합니다.");
  });

  it("응답 본문에 message가 없으면 기본 메시지를 throw해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as Response);
    await expect(
      createCohort({
        name: "x",
        program: "x",
        graduationDate: "2026-01-01",
        summary: "x",
        tagline: "x",
      })
    ).rejects.toThrow("요청에 실패했습니다.");
  });
});

describe("updateCohort", () => {
  it("PATCH /api/cohorts/:id 경로로 호출해야 한다", async () => {
    mockSuccess({ cohort: { id: "c1", name: "수정됨" } });
    await updateCohort("c1", { name: "수정됨" });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/cohorts/c1");
    expect(call[1]?.method).toBe("PATCH");
  });

  it("부분 업데이트 body를 그대로 전송해야 한다", async () => {
    mockSuccess({ cohort: { id: "c1" } });
    await updateCohort("c1", { name: "신규" });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[1]?.body).toBe(JSON.stringify({ name: "신규" }));
  });
});

describe("deleteCohort", () => {
  it("DELETE /api/cohorts/:id 경로로 호출해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve({}),
    } as Response);
    await deleteCohort("c1");
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/cohorts/c1");
    expect(call[1]?.method).toBe("DELETE");
  });

  it("204 No Content 응답에서도 throw하지 않아야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 204,
      json: () => Promise.resolve({}),
    } as Response);
    await expect(deleteCohort("c1")).resolves.toBeUndefined();
  });

  it("404 응답이면 message를 throw해야 한다", async () => {
    mockError(404, "기수를 찾을 수 없습니다.");
    await expect(deleteCohort("invalid")).rejects.toThrow("기수를 찾을 수 없습니다.");
  });
});

// ────────────────────────────────────────────────
// Student CRUD
// ────────────────────────────────────────────────

describe("createStudent", () => {
  it("응답의 student를 unwrap해야 한다", async () => {
    mockSuccess({
      student: {
        id: "s1",
        name: "김코드",
        roleTrack: "풀스택",
        bio: "x",
        techStack: [],
        projects: [],
        retrospective: "",
        mentorComment: "x",
        photos: [],
        certificateMessage: "x",
      },
    });
    const result = await createStudent("c1", {
      name: "김코드",
      roleTrack: "풀스택",
      bio: "x",
      techStack: [],
      mentorComment: "x",
      photos: [],
      certificateMessage: "x",
    });
    expect(result.id).toBe("s1");
  });

  it("POST /api/cohorts/:cohortId/students 경로로 호출해야 한다", async () => {
    mockSuccess({ student: { id: "s1" } });
    await createStudent("c1", {
      name: "x",
      roleTrack: "x",
      bio: "x",
      techStack: [],
      mentorComment: "x",
      photos: [],
      certificateMessage: "x",
    });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/cohorts/c1/students");
  });
});

describe("updateStudent", () => {
  it("PATCH /api/students/:id 경로로 호출해야 한다", async () => {
    mockSuccess({ student: { id: "s1", name: "수정됨" } });
    await updateStudent("s1", { name: "수정됨" });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/students/s1");
    expect(call[1]?.method).toBe("PATCH");
  });
});

describe("deleteStudent", () => {
  it("DELETE /api/students/:id 경로로 호출해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve({}),
    } as Response);
    await deleteStudent("s1");
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/students/s1");
    expect(call[1]?.method).toBe("DELETE");
  });
});

// ────────────────────────────────────────────────
// Project CRUD
// ────────────────────────────────────────────────

describe("createProject", () => {
  it("응답의 project를 unwrap해야 한다", async () => {
    mockSuccess({
      project: {
        id: "p1",
        title: "StudyFlow",
        summary: "x",
        contribution: "x",
        links: [],
      },
    });
    const result = await createProject("s1", {
      title: "StudyFlow",
      summary: "x",
      contribution: "x",
      links: [],
    });
    expect(result.id).toBe("p1");
    expect(result.title).toBe("StudyFlow");
  });

  it("POST /api/students/:studentId/projects 경로로 호출해야 한다", async () => {
    mockSuccess({ project: { id: "p1" } });
    await createProject("s1", {
      title: "x",
      summary: "x",
      contribution: "x",
      links: [],
    });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/students/s1/projects");
  });
});

describe("updateProject", () => {
  it("PATCH /api/projects/:id 경로로 호출해야 한다", async () => {
    mockSuccess({ project: { id: "p1" } });
    await updateProject("p1", { title: "수정됨" });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/projects/p1");
    expect(call[1]?.method).toBe("PATCH");
  });
});

describe("deleteProject", () => {
  it("DELETE /api/projects/:id 경로로 호출해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve({}),
    } as Response);
    await deleteProject("p1");
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toContain("/api/projects/p1");
    expect(call[1]?.method).toBe("DELETE");
  });
});

// ────────────────────────────────────────────────
// 공통 — Content-Type 헤더
// ────────────────────────────────────────────────

describe("CRUD 공통", () => {
  it("POST 요청은 Content-Type: application/json 헤더를 가져야 한다", async () => {
    mockSuccess({ cohort: { id: "c1" } });
    await createCohort({
      name: "x",
      program: "x",
      graduationDate: "2026-01-01",
      summary: "x",
      tagline: "x",
    });
    const call = vi.mocked(fetch).mock.calls[0];
    const headers = call[1]?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("PATCH 요청도 Content-Type 헤더를 가져야 한다", async () => {
    mockSuccess({ cohort: { id: "c1" } });
    await updateCohort("c1", { name: "x" });
    const call = vi.mocked(fetch).mock.calls[0];
    const headers = call[1]?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });
});
