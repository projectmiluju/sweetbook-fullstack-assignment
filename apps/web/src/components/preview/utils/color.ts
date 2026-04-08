/**
 * SweetBook ARGB 색상 → CSS rgba() 변환.
 *
 * SweetBook은 `#AARRGGBB` 형식 (8자리, 알파가 맨 앞).
 * CSS는 `rgba(r, g, b, a)` 또는 `#RRGGBBAA`(8자리, 알파가 맨 뒤).
 *
 * @example
 * argbToRgba("#FFFFFFFF") // → "rgba(255, 255, 255, 1)"  (불투명 흰색)
 * argbToRgba("#00FFFFFF") // → "rgba(255, 255, 255, 0)"  (투명)
 * argbToRgba("#80FF0000") // → "rgba(255, 0, 0, 0.502)"  (반투명 빨강)
 */
export function argbToRgba(argb: string): string {
  // 입력 검증
  if (typeof argb !== "string" || !argb.startsWith("#") || argb.length !== 9) {
    return "transparent";
  }

  const hex = argb.slice(1);
  const a = parseInt(hex.slice(0, 2), 16);
  const r = parseInt(hex.slice(2, 4), 16);
  const g = parseInt(hex.slice(4, 6), 16);
  const b = parseInt(hex.slice(6, 8), 16);

  if ([a, r, g, b].some((v) => Number.isNaN(v))) {
    return "transparent";
  }

  // 알파를 0~1 범위로 (소수점 3자리)
  const alpha = Math.round((a / 255) * 1000) / 1000;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
