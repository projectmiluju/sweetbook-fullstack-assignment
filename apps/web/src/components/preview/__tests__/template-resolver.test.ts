import { describe, expect, it } from "vitest";

import { resolveTemplate } from "../template-resolver";
import { TEMPLATES } from "../templates";

describe("resolveTemplate", () => {
  it("cover templateUid를 isCover=true로 매핑해야 한다", () => {
    const result = resolveTemplate(TEMPLATES.cover.templateUid);
    expect(result).not.toBeNull();
    expect(result?.template.templateUid).toBe(TEMPLATES.cover.templateUid);
    expect(result?.isCover).toBe(true);
  });

  it("contentB templateUid를 isCover=false로 매핑해야 한다", () => {
    const result = resolveTemplate(TEMPLATES.contentB.templateUid);
    expect(result).not.toBeNull();
    expect(result?.template.templateUid).toBe(TEMPLATES.contentB.templateUid);
    expect(result?.isCover).toBe(false);
  });

  it("contentA templateUid를 isCover=false로 매핑해야 한다", () => {
    const result = resolveTemplate(TEMPLATES.contentA.templateUid);
    expect(result?.template.templateUid).toBe(TEMPLATES.contentA.templateUid);
    expect(result?.isCover).toBe(false);
  });

  it("gallery templateUid를 isCover=false로 매핑해야 한다", () => {
    const result = resolveTemplate(TEMPLATES.gallery.templateUid);
    expect(result?.template.templateUid).toBe(TEMPLATES.gallery.templateUid);
    expect(result?.isCover).toBe(false);
  });

  it("알 수 없는 templateUid는 null을 반환해야 한다", () => {
    expect(resolveTemplate("UNKNOWN_UID")).toBeNull();
  });

  it("빈 문자열은 null을 반환해야 한다", () => {
    expect(resolveTemplate("")).toBeNull();
  });
});
