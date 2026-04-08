import type { RectangleElement as RectangleElementType } from "../types";
import { argbToRgba } from "../utils/color";
import { buildPositionStyle } from "../utils/scale";

interface RectangleElementProps {
  element: RectangleElementType;
  scale: number;
}

export default function RectangleElement({ element, scale }: RectangleElementProps) {
  return (
    <div
      style={{
        ...buildPositionStyle(element, scale),
        backgroundColor: argbToRgba(element.color),
      }}
      aria-hidden="true"
    />
  );
}
