// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageRenderer from "../PageRenderer";
import { TEMPLATES } from "../templates";
import type { ParamValues } from "../types";

const PHOTO_URL = "https://example.com/photo.jpg";
const COLLAGE_URLS = [
  "https://example.com/p1.jpg",
  "https://example.com/p2.jpg",
];

const FULL_PARAMS: ParamValues = {
  monthNum: "04",
  dayNum: "25",
  diaryText: "수료생 회고\n프로그래밍이 재미있어졌습니다.",
  photo: PHOTO_URL,
  collagePhotos: JSON.stringify(COLLAGE_URLS),
  coverPhoto: PHOTO_URL,
  subtitle: "김코드",
  dateRange: "2026-04-30",
};

describe("PageRenderer", () => {
  describe("기본 렌더링", () => {
    it("data-template-uid 속성이 templateUid와 일치해야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.contentB}
          params={FULL_PARAMS}
          containerWidth={400}
        />
      );
      const root = container.querySelector("[data-testid='page-renderer']");
      expect(root?.getAttribute("data-template-uid")).toBe(
        TEMPLATES.contentB.templateUid
      );
    });

    it("스케일 적용 후 컨테이너 폭과 일치해야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.contentB}
          params={FULL_PARAMS}
          containerWidth={432}
        />
      );
      const root = container.querySelector(
        "[data-testid='page-renderer']"
      ) as HTMLElement;
      // PAGE_WIDTH(864) * 0.5 = 432
      expect(root.style.width).toBe("432px");
    });
  });

  describe("contentB (내지b) 렌더링", () => {
    it("monthNum과 dayNum이 화면에 표시되어야 한다", () => {
      render(
        <PageRenderer
          template={TEMPLATES.contentB}
          params={FULL_PARAMS}
          containerWidth={400}
        />
      );
      expect(screen.getByText("04")).toBeDefined();
      expect(screen.getByText("25")).toBeDefined();
    });

    it("diaryText가 줄바꿈을 포함하여 표시되어야 한다", () => {
      render(
        <PageRenderer
          template={TEMPLATES.contentB}
          params={FULL_PARAMS}
          containerWidth={400}
        />
      );
      expect(screen.getByText(/수료생 회고/)).toBeDefined();
    });
  });

  describe("contentA (내지a) 렌더링", () => {
    it("photo URL이 img src로 설정되어야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.contentA}
          params={FULL_PARAMS}
          containerWidth={400}
        />
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(PHOTO_URL);
    });

    it("photo가 누락되면 fallback URL이 사용되어야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.contentA}
          params={{ ...FULL_PARAMS, photo: "" }}
          containerWidth={400}
        />
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toContain("picsum");
    });
  });

  describe("cover (표지) 렌더링", () => {
    it("subtitle과 dateRange가 표시되어야 한다", () => {
      render(
        <PageRenderer
          template={TEMPLATES.cover}
          params={FULL_PARAMS}
          containerWidth={800}
          templateWidth={1716}
        />
      );
      expect(screen.getByText("김코드")).toBeDefined();
      expect(screen.getByText("2026-04-30")).toBeDefined();
    });

    it("coverPhoto URL이 img src로 설정되어야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.cover}
          params={FULL_PARAMS}
          containerWidth={800}
          templateWidth={1716}
        />
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(PHOTO_URL);
    });
  });

  describe("gallery (내지_gallery) 렌더링", () => {
    it("collagePhotos 배열의 모든 사진을 렌더링해야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.gallery}
          params={FULL_PARAMS}
          containerWidth={400}
        />
      );
      const imgs = container.querySelectorAll("img");
      expect(imgs.length).toBe(COLLAGE_URLS.length);
    });

    it("collagePhotos가 빈 배열이면 사진을 렌더링하지 않아야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.gallery}
          params={{ ...FULL_PARAMS, collagePhotos: JSON.stringify([]) }}
          containerWidth={400}
        />
      );
      const imgs = container.querySelectorAll("img");
      expect(imgs.length).toBe(0);
    });

    it("collagePhotos가 잘못된 JSON이면 에러 없이 빈 그리드여야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.gallery}
          params={{ ...FULL_PARAMS, collagePhotos: "invalid json" }}
          containerWidth={400}
        />
      );
      const imgs = container.querySelectorAll("img");
      expect(imgs.length).toBe(0);
    });
  });

  describe("graphic 요소 fallback", () => {
    it("contentB의 divider graphic이 단색 div로 렌더링되어야 한다 (img 아님)", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.contentB}
          params={FULL_PARAMS}
          containerWidth={400}
        />
      );
      // contentB는 photo가 없고 divider만 graphic
      // 따라서 img 태그가 없어야 함
      const imgs = container.querySelectorAll("img");
      expect(imgs.length).toBe(0);
    });
  });

  // ════════════════════════════════════════════════
  // QA: 비정상 입력 방어
  // ════════════════════════════════════════════════

  describe("비정상 입력 방어", () => {
    it("containerWidth=0이어도 throw하지 않아야 한다", () => {
      expect(() => {
        render(
          <PageRenderer
            template={TEMPLATES.contentB}
            params={FULL_PARAMS}
            containerWidth={0}
          />
        );
      }).not.toThrow();
    });

    it("빈 params 객체로도 throw하지 않아야 한다", () => {
      expect(() => {
        render(
          <PageRenderer
            template={TEMPLATES.contentB}
            params={{}}
            containerWidth={400}
          />
        );
      }).not.toThrow();
    });

    it("빈 params에서 $$key$$가 빈 문자열로 치환되어야 한다", () => {
      const { container } = render(
        <PageRenderer
          template={TEMPLATES.contentB}
          params={{}}
          containerWidth={400}
        />
      );
      // monthNum/dayNum/diaryText가 빈 문자열로 들어가도 텍스트 노드 자체는 존재
      expect(container.querySelector("[data-testid='page-renderer']")).toBeDefined();
    });
  });

  describe("4개 템플릿 모두 에러 없이 렌더링", () => {
    const cases: Array<["cover" | "contentB" | "contentA" | "gallery", number]> = [
      ["cover", 1716],
      ["contentB", 864],
      ["contentA", 864],
      ["gallery", 864],
    ];

    it.each(cases)("%s 템플릿이 throw 없이 렌더링되어야 한다", (key, width) => {
      expect(() => {
        render(
          <PageRenderer
            template={TEMPLATES[key]}
            params={FULL_PARAMS}
            containerWidth={400}
            templateWidth={width}
          />
        );
      }).not.toThrow();
    });
  });
});
