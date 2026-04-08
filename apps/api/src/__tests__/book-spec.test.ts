import { describe, expect, it } from "vitest";
import { parsePageId } from "../config/book-spec.js";
import type { ParsedPageId } from "../config/book-spec.js";

describe("parsePageId", () => {
  // ── 정상 파싱 ──

  it("'certificate:0'을 { type: 'certificate', index: 0 }으로 파싱해야 한다", () => {
    expect(parsePageId("certificate:0")).toEqual<ParsedPageId>({
      type: "certificate",
      index: 0,
    });
  });

  it("'project-summary:2'를 { type: 'project-summary', index: 2 }로 파싱해야 한다", () => {
    expect(parsePageId("project-summary:2")).toEqual<ParsedPageId>({
      type: "project-summary",
      index: 2,
    });
  });

  it("12종 PageType 모두 정상 파싱되어야 한다", () => {
    const types = [
      "certificate", "bio", "tech-stack", "project-summary", "project-detail",
      "retrospective", "mentor-comment", "photo-gallery", "cohort-intro",
      "thanks", "portfolio-links", "blank",
    ];
    for (const type of types) {
      const result = parsePageId(`${type}:0`);
      expect(result.type).toBe(type);
      expect(result.index).toBe(0);
    }
  });

  // ── 엣지 케이스 ──

  it("콜론이 없는 ID는 { type: 'blank', index: 0 }으로 폴백해야 한다", () => {
    expect(parsePageId("invalidpage")).toEqual<ParsedPageId>({
      type: "blank",
      index: 0,
    });
  });

  it("알 수 없는 타입은 { type: 'blank', index: 0 }으로 폴백해야 한다", () => {
    expect(parsePageId("unknown-type:3")).toEqual<ParsedPageId>({
      type: "blank",
      index: 0,
    });
  });

  it("인덱스가 숫자가 아니면 { type: 'blank', index: 0 }으로 폴백해야 한다", () => {
    expect(parsePageId("certificate:abc")).toEqual<ParsedPageId>({
      type: "blank",
      index: 0,
    });
  });

  it("빈 문자열은 { type: 'blank', index: 0 }으로 폴백해야 한다", () => {
    expect(parsePageId("")).toEqual<ParsedPageId>({
      type: "blank",
      index: 0,
    });
  });

  it("콜론만 있는 문자열은 폴백해야 한다", () => {
    expect(parsePageId(":")).toEqual<ParsedPageId>({
      type: "blank",
      index: 0,
    });
  });

  it("콜론이 여러 개면 마지막 콜론 기준으로 파싱해야 한다", () => {
    // "tech-stack:0"은 정상이지만, "a:b:0"은 "a:b" 타입이 유효하지 않으므로 blank
    expect(parsePageId("a:b:0")).toEqual<ParsedPageId>({
      type: "blank",
      index: 0,
    });
  });

  it("음수 인덱스도 파싱 가능해야 한다", () => {
    // lastIndexOf(':') 이후 Number("-1") = -1, NaN이 아님
    const result = parsePageId("certificate:-1");
    expect(result.type).toBe("certificate");
    expect(result.index).toBe(-1);
  });
});
