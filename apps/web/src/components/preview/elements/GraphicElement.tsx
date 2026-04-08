import { GRAPHIC_FALLBACK_COLOR } from "../constants";
import type { GraphicElement as GraphicElementType } from "../types";
import { buildPositionStyle } from "../utils/scale";

interface GraphicElementProps {
  element: GraphicElementType;
  scale: number;
}

/**
 * Graphic 요소 — #85 검증에서 imageSource 외부 접근 불가 확인.
 * imageSource를 의도적으로 무시하고 GRAPHIC_FALLBACK_COLOR 단색 div로 대체.
 *
 * 적용 요소: 내지b/내지_gallery의 좌측 세로 띠(divider), 표지의 별 모양(back-star).
 */
export default function GraphicElement({ element, scale }: GraphicElementProps) {
  return (
    <div
      style={{
        ...buildPositionStyle(element, scale),
        backgroundColor: GRAPHIC_FALLBACK_COLOR,
        opacity: element.opacity,
      }}
      aria-hidden="true"
    />
  );
}
