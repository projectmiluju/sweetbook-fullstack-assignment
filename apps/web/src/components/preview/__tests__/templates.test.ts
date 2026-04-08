import { describe, expect, it } from "vitest";

import { extractParamKeys } from "../param-substitute";
import { TEMPLATES, type TemplateKey } from "../templates";
import type { TemplateData, TemplateElement } from "../types";

// 5종 element 타입 (types.ts의 TemplateElement union과 일치해야 함)
const VALID_ELEMENT_TYPES = new Set<string>([
  "text",
  "photo",
  "graphic",
  "rectangle",
  "collageGallery",
]);

// 백엔드 payload-mapper(apps/api/src/lib/payload-mapper.ts)가 생성하는 파라미터 키 전체.
// 이 집합과 templates.ts의 $$key$$가 일치해야 책이 정상 렌더링된다.
const KNOWN_PARAM_KEYS = new Set<string>([
  "monthNum",
  "dayNum",
  "diaryText",
  "photo",
  "collagePhotos",
  "coverPhoto",
  "subtitle",
  "dateRange",
]);

const TEMPLATE_KEYS: TemplateKey[] = ["cover", "contentB", "contentA", "gallery"];

// ────────────────────────────────────────────────
// 기본 구조 검증
// ────────────────────────────────────────────────

describe("TEMPLATES 객체", () => {
  it("4개 템플릿이 모두 존재해야 한다", () => {
    expect(Object.keys(TEMPLATES)).toEqual([
      "cover",
      "contentB",
      "contentA",
      "gallery",
    ]);
  });

  it.each(TEMPLATE_KEYS)("%s 템플릿이 templateUid를 가져야 한다", (key) => {
    const template = TEMPLATES[key];
    expect(template.templateUid).toBeTruthy();
    expect(typeof template.templateUid).toBe("string");
  });

  it.each(TEMPLATE_KEYS)("%s 템플릿이 비어 있지 않아야 한다", (key) => {
    const template = TEMPLATES[key];
    expect(template.layout.elements.length).toBeGreaterThan(0);
  });
});

// ────────────────────────────────────────────────
// element 타입 정합성 (P0)
// ────────────────────────────────────────────────

describe("element 타입 정합성", () => {
  it.each(TEMPLATE_KEYS)("%s 템플릿의 모든 element가 5종 union 중 하나여야 한다", (key) => {
    const template: TemplateData = TEMPLATES[key];
    for (const element of template.layout.elements) {
      expect(VALID_ELEMENT_TYPES.has(element.type)).toBe(true);
    }
  });

  it("5종 element 타입이 적어도 하나의 템플릿에서 사용되어야 한다 (커버리지 sanity)", () => {
    const seenTypes = new Set<string>();
    for (const key of TEMPLATE_KEYS) {
      for (const element of TEMPLATES[key].layout.elements) {
        seenTypes.add(element.type);
      }
    }
    expect(seenTypes).toEqual(VALID_ELEMENT_TYPES);
  });
});

// ────────────────────────────────────────────────
// 파라미터 키 정합성 (P0 — 가장 중요)
// ────────────────────────────────────────────────

/**
 * 템플릿 element에서 모든 $$key$$ 패턴을 추출한다.
 * text 요소의 text 필드, photo 요소의 fileName 필드,
 * collageGallery 요소의 photos 필드를 모두 검사한다.
 */
function extractAllParamKeys(template: TemplateData): string[] {
  const keys = new Set<string>();
  for (const element of template.layout.elements) {
    const sources: string[] = [];
    if (element.type === "text") sources.push(element.text);
    if (element.type === "photo") sources.push(element.fileName);
    if (element.type === "collageGallery") sources.push(element.photos);
    for (const source of sources) {
      for (const key of extractParamKeys(source)) {
        keys.add(key);
      }
    }
  }
  return Array.from(keys);
}

describe("파라미터 키 정합성 (templates ↔ payload-mapper)", () => {
  it.each(TEMPLATE_KEYS)("%s 템플릿의 모든 $$key$$가 알려진 파라미터 집합에 속해야 한다", (key) => {
    const template = TEMPLATES[key];
    const usedKeys = extractAllParamKeys(template);

    for (const paramKey of usedKeys) {
      expect(
        KNOWN_PARAM_KEYS.has(paramKey),
        `템플릿 ${key}에 알려지지 않은 파라미터 $$${paramKey}$$가 있음. payload-mapper(apps/api)의 파라미터 키 집합과 동기화 필요.`
      ).toBe(true);
    }
  });

  it("cover 템플릿은 coverPhoto, subtitle, dateRange를 사용해야 한다", () => {
    const usedKeys = new Set(extractAllParamKeys(TEMPLATES.cover));
    expect(usedKeys.has("coverPhoto")).toBe(true);
    expect(usedKeys.has("subtitle")).toBe(true);
    expect(usedKeys.has("dateRange")).toBe(true);
  });

  it("contentB 템플릿은 monthNum, dayNum, diaryText를 사용해야 한다", () => {
    const usedKeys = new Set(extractAllParamKeys(TEMPLATES.contentB));
    expect(usedKeys.has("monthNum")).toBe(true);
    expect(usedKeys.has("dayNum")).toBe(true);
    expect(usedKeys.has("diaryText")).toBe(true);
  });

  it("contentA 템플릿은 monthNum, dayNum, diaryText, photo를 사용해야 한다", () => {
    const usedKeys = new Set(extractAllParamKeys(TEMPLATES.contentA));
    expect(usedKeys.has("monthNum")).toBe(true);
    expect(usedKeys.has("dayNum")).toBe(true);
    expect(usedKeys.has("diaryText")).toBe(true);
    expect(usedKeys.has("photo")).toBe(true);
  });

  it("gallery 템플릿은 monthNum, dayNum, collagePhotos를 사용해야 한다", () => {
    const usedKeys = new Set(extractAllParamKeys(TEMPLATES.gallery));
    expect(usedKeys.has("monthNum")).toBe(true);
    expect(usedKeys.has("dayNum")).toBe(true);
    expect(usedKeys.has("collagePhotos")).toBe(true);
  });
});

// ────────────────────────────────────────────────
// 데이터 sanity 검증 (P2)
// ────────────────────────────────────────────────

describe("데이터 sanity", () => {
  it.each(TEMPLATE_KEYS)("%s 템플릿의 모든 element가 양수 width/height를 가져야 한다", (key) => {
    const template = TEMPLATES[key];
    for (const element of template.layout.elements) {
      expect(element.width).toBeGreaterThan(0);
      expect(element.height).toBeGreaterThan(0);
    }
  });

  it.each(TEMPLATE_KEYS)("%s 템플릿의 모든 element가 음수가 아닌 position을 가져야 한다", (key) => {
    const template = TEMPLATES[key];
    for (const element of template.layout.elements) {
      expect(element.position.x).toBeGreaterThanOrEqual(0);
      expect(element.position.y).toBeGreaterThanOrEqual(0);
    }
  });

  it.each(TEMPLATE_KEYS)("%s 템플릿의 element_id가 모두 unique해야 한다", (key) => {
    const template = TEMPLATES[key];
    const ids = template.layout.elements.map((e: TemplateElement) => e.element_id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
