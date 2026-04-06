import { describe, expect, it } from "vitest";

import { adjustPageCount } from "../lib/page-adjuster.js";

describe("adjustPageCount", () => {
  describe("최솟값 보정", () => {
    it("1페이지는 최소 24페이지로 보정되어야 한다", () => {
      expect(adjustPageCount(1)).toBe(24);
    });

    it("18페이지는 최소 24페이지로 보정되어야 한다", () => {
      expect(adjustPageCount(18)).toBe(24);
    });

    it("0페이지는 최소 24페이지로 보정되어야 한다", () => {
      expect(adjustPageCount(0)).toBe(24);
    });

    it("음수 페이지는 최솟값 24로 보정되어야 한다", () => {
      expect(adjustPageCount(-1)).toBe(24);
    });
  });

  describe("경계값: 정확히 최솟값", () => {
    it("24페이지는 그대로 24페이지여야 한다", () => {
      expect(adjustPageCount(24)).toBe(24);
    });
  });

  describe("홀수 올림 보정", () => {
    it("25페이지는 26페이지로 올림 보정되어야 한다", () => {
      expect(adjustPageCount(25)).toBe(26);
    });

    it("23페이지는 최솟값 24로 보정 후 짝수이므로 24여야 한다", () => {
      expect(adjustPageCount(23)).toBe(24);
    });

    it("홀수 29페이지는 30페이지로 올림 보정되어야 한다", () => {
      expect(adjustPageCount(29)).toBe(30);
    });
  });

  describe("정상 범위 내 짝수", () => {
    it("26페이지는 그대로 26페이지여야 한다", () => {
      expect(adjustPageCount(26)).toBe(26);
    });

    it("100페이지는 그대로 100페이지여야 한다", () => {
      expect(adjustPageCount(100)).toBe(100);
    });
  });

  describe("경계값: 최댓값", () => {
    it("130페이지는 그대로 130페이지여야 한다", () => {
      expect(adjustPageCount(130)).toBe(130);
    });

    it("홀수 129페이지는 최댓값 130페이지로 올림 보정되어야 한다", () => {
      expect(adjustPageCount(129)).toBe(130);
    });
  });

  describe("최댓값 초과 에러", () => {
    it("131페이지는 에러를 발생시켜야 한다", () => {
      expect(() => adjustPageCount(131)).toThrow();
    });

    it("200페이지는 에러를 발생시켜야 한다", () => {
      expect(() => adjustPageCount(200)).toThrow();
    });

    it("에러 메시지에 페이지 수가 포함되어야 한다", () => {
      expect(() => adjustPageCount(131)).toThrow("131");
    });
  });
});
