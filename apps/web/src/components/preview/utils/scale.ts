import type { CSSProperties } from "react";

import type { BaseElement } from "../types";

/**
 * SweetBook 템플릿 좌표(PAGE_WIDTH=864 기준)를 컨테이너 폭에 맞게 스케일링.
 *
 * 모든 element는 절대 위치(position: absolute)로 배치된다.
 * left/top/width/height는 scale 곱셈으로 변환.
 */

/**
 * element의 position/width/height를 scale 적용한 CSS 스타일로 변환.
 */
export function buildPositionStyle(
  element: Pick<BaseElement, "position" | "width" | "height">,
  scale: number
): CSSProperties {
  return {
    position: "absolute",
    left: element.position.x * scale,
    top: element.position.y * scale,
    width: element.width * scale,
    height: element.height * scale,
  };
}

/**
 * 컨테이너 폭으로부터 scale 비율을 계산한다.
 * @param containerWidth 렌더링 영역 폭(px)
 * @param templateWidth 템플릿 좌표 기준 폭 (보통 PAGE_WIDTH=864 또는 COVER_SPREAD_WIDTH=1716)
 */
export function computeScale(containerWidth: number, templateWidth: number): number {
  if (templateWidth <= 0) return 1;
  return containerWidth / templateWidth;
}
