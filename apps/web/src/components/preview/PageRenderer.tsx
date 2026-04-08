import { PAGE_HEIGHT, PAGE_WIDTH } from "./constants";
import CollageElement from "./elements/CollageElement";
import GraphicElement from "./elements/GraphicElement";
import PhotoElement from "./elements/PhotoElement";
import RectangleElement from "./elements/RectangleElement";
import TextElement from "./elements/TextElement";
import type {
  ParamValues,
  TemplateData,
  TemplateElement,
} from "./types";
import { argbToRgba } from "./utils/color";
import { computeScale } from "./utils/scale";

interface PageRendererProps {
  template: TemplateData;
  params: ParamValues;
  /** 컨테이너 폭 (px). 이 값에 맞춰 페이지가 스케일링됨. */
  containerWidth: number;
  /**
   * 템플릿 좌표 기준 폭. 단면 페이지는 PAGE_WIDTH(864),
   * 표지 스프레드는 COVER_SPREAD_WIDTH(1716). 기본값 PAGE_WIDTH.
   */
  templateWidth?: number;
}

/**
 * SweetBook 템플릿 레이아웃을 HTML/CSS로 렌더링하는 단일 페이지 컴포넌트.
 *
 * 모든 element는 absolute로 배치되며, 컨테이너 폭에 맞게 비례 스케일링된다.
 * #85 검증 결과에 따라 graphic 요소는 단색 div fallback으로 렌더링되고,
 * collageGallery는 사진 수별 정적 그리드 규칙을 사용한다 (PRD §2.3, §3.4).
 */
export default function PageRenderer({
  template,
  params,
  containerWidth,
  templateWidth = PAGE_WIDTH,
}: PageRendererProps) {
  const scale = computeScale(containerWidth, templateWidth);
  const scaledHeight = PAGE_HEIGHT * scale;
  const scaledWidth = templateWidth * scale;

  return (
    <div
      style={{
        position: "relative",
        width: scaledWidth,
        height: scaledHeight,
        backgroundColor: argbToRgba(template.layout.backgroundColor),
        overflow: "hidden",
      }}
      data-testid="page-renderer"
      data-template-uid={template.templateUid}
    >
      {template.layout.elements.map((element) => renderElement(element, scale, params))}
    </div>
  );
}

function renderElement(
  element: TemplateElement,
  scale: number,
  params: ParamValues
) {
  const key = element.element_id;
  switch (element.type) {
    case "text":
      return <TextElement key={key} element={element} scale={scale} params={params} />;
    case "photo":
      return <PhotoElement key={key} element={element} scale={scale} params={params} />;
    case "graphic":
      return <GraphicElement key={key} element={element} scale={scale} />;
    case "rectangle":
      return <RectangleElement key={key} element={element} scale={scale} />;
    case "collageGallery":
      return <CollageElement key={key} element={element} scale={scale} params={params} />;
  }
}
