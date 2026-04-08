import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const VALID_ENV = {
  PORT: "4000",
  SWEETBOOK_API_KEY: "test-key-123",
  SWEETBOOK_API_BASE_URL: "https://api-sandbox.sweetbook.com/v1",
  BOOK_SPEC_UID: "PHOTOBOOK_A4_SC",
  COVER_TEMPLATE_UID: "cover-uid",
  CONTENTS_TEMPLATE_UID: "contents-uid",
  BLANK_TEMPLATE_UID: "blank-uid",
  CONTENT_TEMPLATE_UID: "content-uid",
  CONTENT_A_TEMPLATE_UID: "content-a-uid",
  GALLERY_TEMPLATE_UID: "gallery-uid",
};

describe("env 검증", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalEnv = { ...process.env };
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    exitSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it("유효한 환경변수가 모두 있으면 파싱된 env 객체를 반환해야 한다", async () => {
    Object.assign(process.env, VALID_ENV);
    const { loadEnv } = await import("../config/env.js");

    const env = loadEnv();

    expect(env.SWEETBOOK_API_KEY).toBe("test-key-123");
    expect(env.PORT).toBe(4000);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("PORT가 없으면 기본값 4000을 사용해야 한다", async () => {
    const { PORT: _, ...envWithoutPort } = VALID_ENV;
    Object.assign(process.env, envWithoutPort);
    delete process.env.PORT;
    const { loadEnv } = await import("../config/env.js");

    const env = loadEnv();

    expect(env.PORT).toBe(4000);
  });

  it("필수 변수 SWEETBOOK_API_KEY가 없으면 process.exit(1)을 호출해야 한다", async () => {
    const { SWEETBOOK_API_KEY: _, ...envWithout } = VALID_ENV;
    Object.assign(process.env, envWithout);
    delete process.env.SWEETBOOK_API_KEY;
    const { loadEnv } = await import("../config/env.js");

    loadEnv();

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("SWEETBOOK_API_BASE_URL이 유효한 URL이 아니면 process.exit(1)을 호출해야 한다", async () => {
    Object.assign(process.env, { ...VALID_ENV, SWEETBOOK_API_BASE_URL: "not-a-url" });
    const { loadEnv } = await import("../config/env.js");

    loadEnv();

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("검증 실패 시 stderr에 에러 메시지를 출력해야 한다", async () => {
    const { BOOK_SPEC_UID: _, ...envWithout } = VALID_ENV;
    Object.assign(process.env, envWithout);
    delete process.env.BOOK_SPEC_UID;
    const { loadEnv } = await import("../config/env.js");

    loadEnv();

    expect(stderrSpy).toHaveBeenCalled();
    const output = stderrSpy.mock.calls[0][0] as string;
    expect(output).toContain("BOOK_SPEC_UID");
  });

  it("loadEnv() 호출 전에 getEnv()를 호출하면 에러를 throw해야 한다", async () => {
    const { getEnv } = await import("../config/env.js");

    expect(() => getEnv()).toThrow("loadEnv()가 호출되지 않았습니다");
  });
});
