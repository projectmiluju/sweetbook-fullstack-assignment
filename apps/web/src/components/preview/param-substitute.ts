import type { ParamValues } from "./types";

const PARAM_PATTERN = /\$\$([a-zA-Z][a-zA-Z0-9_]*)\$\$/g;

/**
 * 템플릿 텍스트의 `$$paramName$$` 패턴을 실제 값으로 치환한다.
 *
 * 정의되지 않은 키는 빈 문자열로 대체한다 (PRD §6 예외 처리: "파라미터 값이 null → 빈 문자열").
 *
 * @example
 * substituteParams("$$monthNum$$/$$dayNum$$", { monthNum: "04", dayNum: "25" })
 * // → "04/25"
 *
 * @example
 * substituteParams("$$missing$$", {})
 * // → ""
 */
export function substituteParams(text: string, params: ParamValues): string {
  return text.replace(PARAM_PATTERN, (_match, key: string) => {
    return params[key] ?? "";
  });
}

/**
 * 텍스트에서 사용된 모든 파라미터 키를 추출한다.
 * 디버깅·검증용. 동일한 키가 여러 번 나오면 한 번만 반환.
 *
 * @example
 * extractParamKeys("$$name$$ - $$name$$ ($$age$$)")
 * // → ["name", "age"]
 */
export function extractParamKeys(text: string): string[] {
  const matches = text.matchAll(PARAM_PATTERN);
  const seen = new Set<string>();
  for (const match of matches) {
    seen.add(match[1]);
  }
  return Array.from(seen);
}
