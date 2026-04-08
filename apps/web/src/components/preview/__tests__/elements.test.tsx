// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GraphicElement from "../elements/GraphicElement";
import PhotoElement from "../elements/PhotoElement";
import RectangleElement from "../elements/RectangleElement";
import TextElement from "../elements/TextElement";
import type {
  GraphicElement as GraphicType,
  PhotoElement as PhotoType,
  RectangleElement as RectType,
  TextElement as TextType,
} from "../types";

const BASE_POSITION = { x: 10, y: 20 };

// ────────────────────────────────────────────────
// TextElement
// ────────────────────────────────────────────────

describe("TextElement", () => {
  const baseText: TextType = {
    element_id: "test-text",
    type: "text",
    position: BASE_POSITION,
    width: 100,
    height: 50,
    text: "정적 텍스트",
    fontFamily: "DM Serif Display",
    fontSize: 20,
    textBold: false,
    textBrush: "#FF000000", // 불투명 검정
    backgroundColor: "#00FFFFFF", // 투명
    textAlignment: "Center",
    verticalAlignment: "Center",
    isDynamic: false,
    splittable: false,
  };

  it("textBrush ARGB가 style.color에 rgba로 들어가야 한다", () => {
    const { container } = render(
      <TextElement element={baseText} scale={1} params={{}} />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.color).toBe("rgba(0, 0, 0, 1)");
  });

  it("backgroundColor ARGB가 style.backgroundColor에 rgba로 들어가야 한다", () => {
    const { container } = render(
      <TextElement
        element={{ ...baseText, backgroundColor: "#FFFF0000" }}
        scale={1}
        params={{}}
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.backgroundColor).toBe("rgba(255, 0, 0, 1)");
  });

  it("textAlignment Center가 textAlign: center로 매핑되어야 한다", () => {
    const { container } = render(
      <TextElement element={baseText} scale={1} params={{}} />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.textAlign).toBe("center");
  });

  it("textAlignment Left가 textAlign: left로 매핑되어야 한다", () => {
    const { container } = render(
      <TextElement
        element={{ ...baseText, textAlignment: "Left" }}
        scale={1}
        params={{}}
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.textAlign).toBe("left");
  });

  it("verticalAlignment Bottom이 justifyContent: flex-end로 매핑되어야 한다", () => {
    const { container } = render(
      <TextElement
        element={{ ...baseText, verticalAlignment: "Bottom" }}
        scale={1}
        params={{}}
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.justifyContent).toBe("flex-end");
  });

  it("$$key$$ 패턴이 params 값으로 치환되어야 한다", () => {
    const { container } = render(
      <TextElement
        element={{ ...baseText, text: "$$name$$ 님" }}
        scale={1}
        params={{ name: "김코드" }}
      />
    );
    expect(container.textContent).toBe("김코드 님");
  });

  it("scale=0.5이면 fontSize가 절반이 되어야 한다", () => {
    const { container } = render(
      <TextElement element={baseText} scale={0.5} params={{}} />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.fontSize).toBe("10px"); // 20 * 0.5
  });

  it("textBold true이면 fontWeight: bold여야 한다", () => {
    const { container } = render(
      <TextElement
        element={{ ...baseText, textBold: true }}
        scale={1}
        params={{}}
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.fontWeight).toBe("bold");
  });

  it("whiteSpace: pre-wrap이 적용되어 줄바꿈이 보존되어야 한다", () => {
    const { container } = render(
      <TextElement
        element={{ ...baseText, text: "줄1\n줄2" }}
        scale={1}
        params={{}}
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.whiteSpace).toBe("pre-wrap");
    expect(div.textContent).toBe("줄1\n줄2");
  });
});

// ────────────────────────────────────────────────
// RectangleElement
// ────────────────────────────────────────────────

describe("RectangleElement", () => {
  const baseRect: RectType = {
    element_id: "test-rect",
    type: "rectangle",
    position: BASE_POSITION,
    width: 200,
    height: 300,
    color: "#FF8B7D6B",
  };

  it("color ARGB가 backgroundColor에 rgba로 들어가야 한다", () => {
    const { container } = render(<RectangleElement element={baseRect} scale={1} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.backgroundColor).toBe("rgba(139, 125, 107, 1)");
  });

  it("position과 width가 scale 적용되어 들어가야 한다", () => {
    const { container } = render(
      <RectangleElement element={baseRect} scale={0.5} />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.left).toBe("5px"); // 10 * 0.5
    expect(div.style.top).toBe("10px"); // 20 * 0.5
    expect(div.style.width).toBe("100px"); // 200 * 0.5
    expect(div.style.height).toBe("150px"); // 300 * 0.5
  });

  it("아무 텍스트도 렌더링하지 않아야 한다", () => {
    const { container } = render(<RectangleElement element={baseRect} scale={1} />);
    expect(container.textContent).toBe("");
  });
});

// ────────────────────────────────────────────────
// GraphicElement (회귀 방지)
// ────────────────────────────────────────────────

describe("GraphicElement", () => {
  const baseGraphic: GraphicType = {
    element_id: "test-graphic",
    type: "graphic",
    position: BASE_POSITION,
    width: 200,
    height: 1000,
    imageSource: "/api_platform_image/public/image123.PNG",
    opacity: 1,
    graphicType: "Sticker",
  };

  it("img 태그를 절대 생성하지 않아야 한다 (회귀 방지)", () => {
    // #85 검증: imageSource는 외부 접근 불가. 미래에 누군가 img 추가하면 깨짐.
    const { container } = render(<GraphicElement element={baseGraphic} scale={1} />);
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(0);
  });

  it("backgroundColor가 GRAPHIC_FALLBACK_COLOR(#8B7D6B)이어야 한다", () => {
    const { container } = render(<GraphicElement element={baseGraphic} scale={1} />);
    const div = container.firstChild as HTMLElement;
    // happy-dom은 hex 색상을 그대로 보존 (jsdom과 다름)
    expect(div.style.backgroundColor).toBe("#8B7D6B");
  });

  it("opacity가 element.opacity 값으로 들어가야 한다", () => {
    const { container } = render(
      <GraphicElement element={{ ...baseGraphic, opacity: 0.5 }} scale={1} />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.opacity).toBe("0.5");
  });

  it("imageSource 문자열이 DOM에 어디에도 나타나지 않아야 한다", () => {
    const { container } = render(<GraphicElement element={baseGraphic} scale={1} />);
    expect(container.innerHTML).not.toContain("api_platform_image");
  });

  it("aria-hidden=true여야 한다 (장식적 요소)", () => {
    const { container } = render(<GraphicElement element={baseGraphic} scale={1} />);
    const div = container.firstChild as HTMLElement;
    expect(div.getAttribute("aria-hidden")).toBe("true");
  });
});

// ────────────────────────────────────────────────
// PhotoElement
// ────────────────────────────────────────────────

describe("PhotoElement", () => {
  const basePhoto: PhotoType = {
    element_id: "test-photo",
    type: "photo",
    position: BASE_POSITION,
    width: 400,
    height: 600,
    fileName: "$$photo$$",
    fit: "cover",
  };

  it("fit=cover일 때 objectFit이 cover여야 한다", () => {
    const { container } = render(
      <PhotoElement
        element={basePhoto}
        scale={1}
        params={{ photo: "https://example.com/p.jpg" }}
      />
    );
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.style.objectFit).toBe("cover");
  });

  it("fit=contain일 때 objectFit이 contain여야 한다", () => {
    const { container } = render(
      <PhotoElement
        element={{ ...basePhoto, fit: "contain" }}
        scale={1}
        params={{ photo: "https://example.com/p.jpg" }}
      />
    );
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.style.objectFit).toBe("contain");
  });

  it("fileName 키가 params에 없으면 picsum fallback 사용해야 한다", () => {
    const { container } = render(
      <PhotoElement element={basePhoto} scale={1} params={{}} />
    );
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.src).toContain("picsum");
  });

  it("fileName 키가 빈 문자열이어도 picsum fallback이어야 한다", () => {
    const { container } = render(
      <PhotoElement
        element={basePhoto}
        scale={1}
        params={{ photo: "" }}
      />
    );
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.src).toContain("picsum");
  });
});
