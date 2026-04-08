import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .default("4000")
    .transform(Number)
    .pipe(z.number().int().positive()),

  DATABASE_URL: z
    .string()
    .url("DATABASE_URL이 유효한 URL이 아닙니다")
    .optional(),

  SWEETBOOK_API_KEY: z.string().min(1, "SWEETBOOK_API_KEY가 비어 있습니다"),
  SWEETBOOK_API_BASE_URL: z
    .string()
    .url("SWEETBOOK_API_BASE_URL이 유효한 URL이 아닙니다"),

  BOOK_SPEC_UID: z.string().min(1, "BOOK_SPEC_UID가 비어 있습니다"),
  COVER_TEMPLATE_UID: z.string().min(1, "COVER_TEMPLATE_UID가 비어 있습니다"),
  CONTENTS_TEMPLATE_UID: z
    .string()
    .min(1, "CONTENTS_TEMPLATE_UID가 비어 있습니다"),
  BLANK_TEMPLATE_UID: z.string().min(1, "BLANK_TEMPLATE_UID가 비어 있습니다"),
  CONTENT_TEMPLATE_UID: z
    .string()
    .min(1, "CONTENT_TEMPLATE_UID가 비어 있습니다"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    process.stderr.write(
      `\n[ENV] 필수 환경변수 검증 실패:\n${errors}\n\n.env.example을 참고하여 .env 파일을 확인하세요.\n\n`
    );
    process.exit(1);
  }

  _env = result.data;
  return _env;
}

export function getEnv(): Env {
  if (!_env) {
    throw new Error("loadEnv()가 호출되지 않았습니다. server.ts에서 먼저 호출하세요.");
  }
  return _env;
}
