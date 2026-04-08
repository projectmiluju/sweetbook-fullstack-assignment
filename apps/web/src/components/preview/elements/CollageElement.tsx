import { substituteParams } from "../param-substitute";
import type {
  CollageGalleryElement as CollageGalleryElementType,
  ParamValues,
} from "../types";
import { buildPositionStyle } from "../utils/scale";

interface CollageElementProps {
  element: CollageGalleryElementType;
  scale: number;
  params: ParamValues;
}

const COLLAGE_GAP_PX = 10;

/**
 * 사진 개수에 따라 grid-template-columns를 결정한다 (PRD §2.3, #85 검증).
 *
 * SweetBook의 layout:"auto"는 블랙박스이므로 자체 정적 규칙으로 fallback:
 * - 1장: 1열
 * - 2장: 2열
 * - 3-4장: 2열 (2x2)
 * - 5장 이상: 3열 (auto-row)
 */
function getGridColumns(photoCount: number): string {
  if (photoCount <= 1) return "1fr";
  if (photoCount <= 4) return "1fr 1fr";
  return "repeat(3, 1fr)";
}

/**
 * params에서 사진 배열을 추출한다.
 * SweetBook 템플릿의 photos 필드는 "$$collagePhotos$$" 같은 패턴이고,
 * 백엔드 payload-mapper는 JSON.stringify(string[]) 형태로 전달한다.
 */
function parsePhotoArray(jsonString: string): string[] {
  if (!jsonString) return [];
  try {
    const parsed: unknown = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
    return [];
  } catch {
    return [];
  }
}

export default function CollageElement({ element, scale, params }: CollageElementProps) {
  const photosJson = substituteParams(element.photos, params);
  const photos = parsePhotoArray(photosJson);

  return (
    <div
      style={{
        ...buildPositionStyle(element, scale),
        display: "grid",
        gridTemplateColumns: getGridColumns(photos.length),
        gap: COLLAGE_GAP_PX * scale,
      }}
    >
      {photos.map((url, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${url}-${index}`}
          src={url}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            minHeight: 0,
          }}
        />
      ))}
    </div>
  );
}

export { getGridColumns, parsePhotoArray };
