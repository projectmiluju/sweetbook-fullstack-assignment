import { describe, expect, it } from "vitest";

import { getFontFamilyStack } from "../utils/font";

describe("getFontFamilyStack", () => {
  it("DM Serif Display는 그대로 매핑되어야 한다", () => {
    expect(getFontFamilyStack("DM Serif Display")).toBe(
      "'DM Serif Display', serif"
    );
  });

  it("NanumMyeongjo(공백 없음)는 'Nanum Myeongjo'로 매핑되어야 한다", () => {
    expect(getFontFamilyStack("NanumMyeongjo")).toBe(
      "'Nanum Myeongjo', serif"
    );
  });

  it("'배달의민족 도현'은 'Do Hyeon'으로 매핑되어야 한다", () => {
    expect(getFontFamilyStack("배달의민족 도현")).toBe(
      "'Do Hyeon', sans-serif"
    );
  });

  it("Roboto는 sans-serif fallback을 가져야 한다", () => {
    expect(getFontFamilyStack("Roboto")).toBe("'Roboto', sans-serif");
  });

  it("Impact 시스템 폰트도 매핑되어야 한다", () => {
    expect(getFontFamilyStack("Impact")).toBe("'Impact', sans-serif");
  });

  it("알 수 없는 폰트는 sans-serif를 반환해야 한다", () => {
    expect(getFontFamilyStack("UnknownFont")).toBe("sans-serif");
  });

  it("빈 문자열은 sans-serif를 반환해야 한다", () => {
    expect(getFontFamilyStack("")).toBe("sans-serif");
  });

  it("나눔명조 한글명도 매핑되어야 한다", () => {
    expect(getFontFamilyStack("나눔명조")).toBe("'Nanum Myeongjo', serif");
  });

  it("나눔고딕 한글명도 매핑되어야 한다", () => {
    expect(getFontFamilyStack("나눔고딕")).toBe("'Nanum Gothic', sans-serif");
  });
});
