import { describe, expect, it } from "vitest";

import { getGridColumns, parsePhotoArray } from "../elements/CollageElement";

describe("getGridColumns", () => {
  it("0장이면 1fr (사진 없음)", () => {
    expect(getGridColumns(0)).toBe("1fr");
  });

  it("1장이면 1fr", () => {
    expect(getGridColumns(1)).toBe("1fr");
  });

  it("2장이면 1fr 1fr", () => {
    expect(getGridColumns(2)).toBe("1fr 1fr");
  });

  it("3장이면 1fr 1fr (2x2)", () => {
    expect(getGridColumns(3)).toBe("1fr 1fr");
  });

  it("4장이면 1fr 1fr (2x2)", () => {
    expect(getGridColumns(4)).toBe("1fr 1fr");
  });

  it("5장 이상이면 repeat(3, 1fr)", () => {
    expect(getGridColumns(5)).toBe("repeat(3, 1fr)");
    expect(getGridColumns(9)).toBe("repeat(3, 1fr)");
  });
});

describe("parsePhotoArray", () => {
  it("정상 JSON 배열을 파싱해야 한다", () => {
    expect(parsePhotoArray('["url1","url2"]')).toEqual(["url1", "url2"]);
  });

  it("빈 배열을 파싱해야 한다", () => {
    expect(parsePhotoArray("[]")).toEqual([]);
  });

  it("빈 문자열은 빈 배열을 반환해야 한다", () => {
    expect(parsePhotoArray("")).toEqual([]);
  });

  it("잘못된 JSON은 빈 배열을 반환해야 한다", () => {
    expect(parsePhotoArray("not json")).toEqual([]);
  });

  it("배열이 아닌 객체는 빈 배열을 반환해야 한다", () => {
    expect(parsePhotoArray('{"foo":"bar"}')).toEqual([]);
  });

  it("배열 안에 문자열 아닌 항목은 필터링해야 한다", () => {
    expect(parsePhotoArray('["url1", 123, null, "url2"]')).toEqual([
      "url1",
      "url2",
    ]);
  });
});
