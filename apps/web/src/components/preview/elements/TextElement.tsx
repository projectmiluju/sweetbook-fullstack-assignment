import { substituteParams } from "../param-substitute";
import type { ParamValues, TextElement as TextElementType } from "../types";
import { argbToRgba } from "../utils/color";
import { getFontFamilyStack } from "../utils/font";
import { buildPositionStyle } from "../utils/scale";

interface TextElementProps {
  element: TextElementType;
  scale: number;
  params: ParamValues;
}

const TEXT_ALIGN_MAP = {
  Left: "left",
  Center: "center",
  Right: "right",
  Justify: "justify",
} as const;

const VERTICAL_ALIGN_MAP = {
  Top: "flex-start",
  Center: "center",
  Bottom: "flex-end",
} as const;

export default function TextElement({ element, scale, params }: TextElementProps) {
  const text = substituteParams(element.text, params);

  return (
    <div
      style={{
        ...buildPositionStyle(element, scale),
        display: "flex",
        flexDirection: "column",
        justifyContent: VERTICAL_ALIGN_MAP[element.verticalAlignment],
        textAlign: TEXT_ALIGN_MAP[element.textAlignment],
        fontFamily: getFontFamilyStack(element.fontFamily),
        fontSize: element.fontSize * scale,
        fontWeight: element.textBold ? "bold" : "normal",
        color: argbToRgba(element.textBrush),
        backgroundColor: argbToRgba(element.backgroundColor),
        lineHeight: element.textLineHeight ?? 1.4,
        whiteSpace: "pre-wrap",
        wordBreak: "keep-all",
        overflow: "hidden",
      }}
    >
      {text}
    </div>
  );
}
