/**
 * SweetBook 템플릿 레이아웃 데이터의 타입 정의.
 *
 * SweetBook /v1/templates/{uid} 응답의 layout.elements를 그대로 반영한 구조.
 * #85 검증에서 graphic 요소의 imageSource는 외부 접근 불가로 확인되어,
 * 렌더링 시 fallback 색상으로 대체된다 (PRD §3.4).
 */

export interface ElementPosition {
  x: number;
  y: number;
}

export interface BaseElement {
  element_id: string;
  position: ElementPosition;
  width: number;
  height: number;
}

// ────────────────────────────────────────────────
// Text element
// ────────────────────────────────────────────────

export type TextAlignment = "Left" | "Center" | "Right" | "Justify";
export type VerticalAlignment = "Top" | "Center" | "Bottom";

export interface TextElement extends BaseElement {
  type: "text";
  /** "$$paramName$$" 패턴 또는 정적 텍스트 */
  text: string;
  fontFamily: string;
  fontSize: number;
  textBold: boolean;
  /** ARGB 형식 (#AARRGGBB) */
  textBrush: string;
  /** ARGB 형식 (#AARRGGBB) */
  backgroundColor: string;
  textAlignment: TextAlignment;
  verticalAlignment: VerticalAlignment;
  textLineHeight?: number;
  isDynamic: boolean;
  splittable: boolean;
}

// ────────────────────────────────────────────────
// Photo element
// ────────────────────────────────────────────────

export type PhotoFit = "cover" | "contain" | "fill";

export interface PhotoElement extends BaseElement {
  type: "photo";
  /** "$$paramName$$" 패턴 (예: "$$coverPhoto$$") */
  fileName: string;
  fit: PhotoFit;
  borderBrush?: string;
  verticalAlignment?: VerticalAlignment;
}

// ────────────────────────────────────────────────
// Graphic element
//
// #85 검증 결과 imageSource는 외부 접근 불가.
// 렌더링 시 GraphicElement 컴포넌트가 imageSource를 무시하고
// GRAPHIC_FALLBACK_COLOR 단색 div로 대체한다.
// ────────────────────────────────────────────────

export interface GraphicElement extends BaseElement {
  type: "graphic";
  imageSource: string;
  opacity: number;
  graphicType: string;
}

// ────────────────────────────────────────────────
// Rectangle element
// ────────────────────────────────────────────────

export interface RectangleElement extends BaseElement {
  type: "rectangle";
  /** ARGB 형식 (#AARRGGBB) */
  color: string;
  logoImage?: string;
  logoHeight?: number;
}

// ────────────────────────────────────────────────
// CollageGallery element
//
// #85 검증 결과 SweetBook의 layout:"auto"는 블랙박스이므로,
// 렌더링 시 사진 수별 정적 grid-template-columns 규칙을 적용한다 (PRD §2.3).
// ────────────────────────────────────────────────

export interface CollageContainer {
  maxWidth: number;
  maxHeight: number;
  itemGap: number;
}

export interface CollageGalleryElement extends BaseElement {
  type: "collageGallery";
  tag: string;
  /** "$$paramName$$" 패턴 (예: "$$collagePhotos$$") */
  photos: string;
  fit: PhotoFit;
  verticalAlignment: VerticalAlignment;
  container: CollageContainer;
  isDynamic: boolean;
  /** SweetBook 내부 알고리즘 식별자 — 렌더러는 이를 무시하고 자체 그리드 규칙 사용 */
  layout: string;
  gap: number;
}

// ────────────────────────────────────────────────
// Discriminated union
// ────────────────────────────────────────────────

export type TemplateElement =
  | TextElement
  | PhotoElement
  | GraphicElement
  | RectangleElement
  | CollageGalleryElement;

// ────────────────────────────────────────────────
// Template
// ────────────────────────────────────────────────

export interface TemplateLayout {
  /** ARGB 형식 (#AARRGGBB) */
  backgroundColor: string;
  elements: TemplateElement[];
}

export interface TemplateData {
  templateUid: string;
  templateName: string;
  /** 일기장A, 구글포토북A 등 */
  theme: string;
  layout: TemplateLayout;
}

// ────────────────────────────────────────────────
// Parameter substitution
// ────────────────────────────────────────────────

/**
 * 템플릿 텍스트 내 `$$paramName$$` 패턴을 치환할 값들.
 *
 * 페이지 타입에 따라 키가 달라진다:
 * - 모든 페이지: monthNum, dayNum, diaryText
 * - 표지: coverPhoto, subtitle, dateRange
 * - 내지a: + photo
 * - 내지_gallery: + collagePhotos (JSON 배열 문자열)
 */
export type ParamValues = Record<string, string>;
