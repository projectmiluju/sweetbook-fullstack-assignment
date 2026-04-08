import { substituteParams } from "../param-substitute";
import type { ParamValues, PhotoElement as PhotoElementType } from "../types";
import { buildPositionStyle } from "../utils/scale";

interface PhotoElementProps {
  element: PhotoElementType;
  scale: number;
  params: ParamValues;
}

const PHOTO_FALLBACK_URL =
  "https://picsum.photos/seed/sweetbook-preview/600/800";

const OBJECT_FIT_MAP = {
  cover: "cover",
  contain: "contain",
  fill: "fill",
} as const;

export default function PhotoElement({ element, scale, params }: PhotoElementProps) {
  const url = substituteParams(element.fileName, params) || PHOTO_FALLBACK_URL;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      style={{
        ...buildPositionStyle(element, scale),
        objectFit: OBJECT_FIT_MAP[element.fit],
      }}
    />
  );
}
