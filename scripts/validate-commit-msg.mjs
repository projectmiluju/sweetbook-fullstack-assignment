import { readFileSync } from "node:fs";

const COMMIT_MSG_PATH = process.argv[2];

if (!COMMIT_MSG_PATH) {
  console.error("commit message file path is required");
  process.exit(1);
}

const rawMessage = readFileSync(COMMIT_MSG_PATH, "utf8").trim();
const [header = ""] = rawMessage.split("\n");

const ALLOWED_PREFIXES = new Set(["Merge ", "Revert "]);
const ALLOWED_TYPES = [
  "feat",
  "fix",
  "build",
  "chore",
  "ci",
  "docs",
  "style",
  "refactor",
  "test",
  "release",
];

if ([...ALLOWED_PREFIXES].some((prefix) => header.startsWith(prefix))) {
  process.exit(0);
}

const conventionalPattern = new RegExp(`^(${ALLOWED_TYPES.join("|")}): (.+)$`);
const match = header.match(conventionalPattern);

if (!match) {
  console.error("커밋 헤더는 '{type}: {한글 헤더}' 형식을 따라야 합니다.");
  process.exit(1);
}

const subject = match[2];
const headerLength = [...header].length;

if (headerLength > 50) {
  console.error(`커밋 헤더는 50자 이하여야 합니다. 현재 ${headerLength}자입니다.`);
  process.exit(1);
}

if (!/[가-힣]/.test(subject)) {
  console.error("커밋 헤더에는 한글 설명이 포함되어야 합니다.");
  process.exit(1);
}

process.exit(0);
