import { describe, expect, it } from "vitest";

import { buildPositionStyle, computeScale } from "../utils/scale";

describe("computeScale", () => {
  it("컨테이너 폭이 템플릿 폭과 같으면 1을 반환해야 한다", () => {
    expect(computeScale(864, 864)).toBe(1);
  });

  it("컨테이너 폭이 절반이면 0.5를 반환해야 한다", () => {
    expect(computeScale(432, 864)).toBe(0.5);
  });

  it("templateWidth가 0이면 1을 반환해야 한다 (안전 폴백)", () => {
    expect(computeScale(400, 0)).toBe(1);
  });

  it("templateWidth가 음수면 1을 반환해야 한다", () => {
    expect(computeScale(400, -100)).toBe(1);
  });
});

describe("buildPositionStyle", () => {
  const element = {
    position: { x: 100, y: 200 },
    width: 400,
    height: 600,
  };

  it("scale=1이면 좌표를 그대로 반환해야 한다", () => {
    const style = buildPositionStyle(element, 1);
    expect(style).toEqual({
      position: "absolute",
      left: 100,
      top: 200,
      width: 400,
      height: 600,
    });
  });

  it("scale=0.5이면 모든 값에 0.5를 곱해야 한다", () => {
    const style = buildPositionStyle(element, 0.5);
    expect(style).toEqual({
      position: "absolute",
      left: 50,
      top: 100,
      width: 200,
      height: 300,
    });
  });

  it("position이 0이면 left/top도 0이어야 한다", () => {
    const style = buildPositionStyle(
      { position: { x: 0, y: 0 }, width: 100, height: 100 },
      0.5
    );
    expect(style.left).toBe(0);
    expect(style.top).toBe(0);
  });
});
