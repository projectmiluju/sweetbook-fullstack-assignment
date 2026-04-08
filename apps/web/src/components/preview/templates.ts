// AUTO-IMPORTED from SweetBook /v1/templates/{uid} responses (#85 검증 시 캐시).
// 이 데이터는 build-time에 정적으로 저장된다 (PRD §4.2):
//   1. 템플릿 레이아웃은 자주 변경되지 않음
//   2. 런타임 API 호출 지연 회피
//   3. SweetBook API key를 프론트엔드에 노출하지 않음
//
// graphic 요소의 imageSource는 #85 검증에서 외부 접근 불가로 확인되었으므로,
// 렌더러는 이를 무시하고 GRAPHIC_FALLBACK_COLOR로 대체한다.

import type { TemplateData } from "./types";

export const cover: TemplateData = {
  "templateUid": "3S1ceGaglj5i",
  "templateName": "표지 (A4 소프트커버 포토북)",
  "theme": "구글포토북A",
  "layout": {
    "backgroundColor": "#FFFFFFFF",
    "elements": [
      {
        "element_id": "book-back",
        "type": "rectangle",
        "position": {
          "x": 851.1747617761661,
          "y": 0
        },
        "width": 39.65047644766792,
        "height": 1212,
        "color": "#FFFFFFFF",
        "logoImage": "Transparent",
        "logoHeight": 28
      },
      {
        "element_id": "back-star",
        "type": "graphic",
        "position": {
          "x": 414.98591875313457,
          "y": 591.3785154449055
        },
        "width": 21.00131167779021,
        "height": 21.00131167779021,
        "imageSource": "/api_platform_image/public/image260312122533797.PNG",
        "opacity": 1,
        "graphicType": "Sticker"
      },
      {
        "element_id": "front-photo",
        "type": "photo",
        "position": {
          "x": 1171.3439585664132,
          "y": 86.94208588428482
        },
        "width": 505.4091663130281,
        "height": 1034.4234670355004,
        "fileName": "$$coverPhoto$$",
        "fit": "cover"
      },
      {
        "element_id": "front-title",
        "type": "text",
        "position": {
          "x": 940.967969985726,
          "y": 81.88497003227295
        },
        "width": 263.9024825431118,
        "height": 295.86387736284007,
        "text": "ONE FINE\nDAY",
        "fontFamily": "Impact",
        "fontSize": 54,
        "textBold": false,
        "textBrush": "#FF000000",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "textLineHeight": 76,
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "front-subtitle",
        "type": "text",
        "position": {
          "x": 942.4632633771847,
          "y": 1060.2788151221762
        },
        "width": 224.97445121715984,
        "height": 46.146150299677274,
        "text": "$$subtitle$$",
        "fontFamily": "배달의민족 도현",
        "fontSize": 15,
        "textBold": false,
        "textBrush": "#FF000000",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "front-daterange",
        "type": "text",
        "position": {
          "x": 942.4632633771847,
          "y": 1082.262988186487
        },
        "width": 224.97445121715984,
        "height": 46.146150299677274,
        "text": "$$dateRange$$",
        "fontFamily": "Roboto",
        "fontSize": 12,
        "textBold": false,
        "textBrush": "#FF666666",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "isDynamic": false,
        "splittable": false
      }
    ]
  }
} as const;

export const contentB: TemplateData = {
  "templateUid": "3mjKd8kcaVzT",
  "templateName": "내지b (A4 소프트커버 포토북)",
  "theme": "일기장A",
  "layout": {
    "backgroundColor": "#FFFFFFFF",
    "elements": [
      {
        "element_id": "divider",
        "type": "graphic",
        "position": {
          "x": 0,
          "y": 0
        },
        "width": 202.86331288343558,
        "height": 1212,
        "imageSource": "/api_platform_image/public/image260312122639465.PNG",
        "opacity": 1,
        "graphicType": "Sticker"
      },
      {
        "element_id": "month-num",
        "type": "text",
        "position": {
          "x": 50.0201226993865,
          "y": 81.23874896477804
        },
        "width": 103.51214723926381,
        "height": 89.61630695443645,
        "text": "$$monthNum$$",
        "fontFamily": "DM Serif Display",
        "fontSize": 65,
        "textBold": false,
        "textBrush": "#FFFFFFFF",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "day-num",
        "type": "text",
        "position": {
          "x": 50.0201226993865,
          "y": 176.31937448238898
        },
        "width": 103.51214723926381,
        "height": 89.61630695443645,
        "text": "$$dayNum$$",
        "fontFamily": "DM Serif Display",
        "fontSize": 65,
        "textBold": false,
        "textBrush": "#FFFFFFFF",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "diary-text",
        "type": "text",
        "position": {
          "x": 235.4885889570552,
          "y": 93.57637889688249
        },
        "width": 584.4633128834356,
        "height": 1025.634412470024,
        "text": "$$diaryText$$",
        "fontFamily": "NanumMyeongjo",
        "fontSize": 12,
        "textBold": false,
        "textBrush": "#FF3F3F3F",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "textLineHeight": 26,
        "isDynamic": false,
        "splittable": false
      }
    ]
  }
} as const;

export const contentA: TemplateData = {
  "templateUid": "3nWJ4wtPSQOb",
  "templateName": "내지a (A4 소프트커버 포토북)",
  "theme": "일기장A",
  "layout": {
    "backgroundColor": "#FFFFFFFF",
    "elements": [
      {
        "element_id": "bg-taupe",
        "type": "rectangle",
        "position": {
          "x": 0,
          "y": 0
        },
        "width": 864,
        "height": 508.58465227817743,
        "color": "#FF9A9088"
      },
      {
        "element_id": "month-num",
        "type": "text",
        "position": {
          "x": 40.56736196319019,
          "y": 69.35575539568346
        },
        "width": 103.51214723926381,
        "height": 89.61630695443645,
        "text": "$$monthNum$$",
        "fontFamily": "DM Serif Display",
        "fontSize": 65,
        "textBold": false,
        "textBrush": "#FFFFFFFF",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "day-num",
        "type": "text",
        "position": {
          "x": 40.56736196319019,
          "y": 158.97206235011993
        },
        "width": 103.51214723926381,
        "height": 89.61630695443645,
        "text": "$$dayNum$$",
        "fontFamily": "DM Serif Display",
        "fontSize": 65,
        "textBold": false,
        "textBrush": "#FFFFFFFF",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "photo",
        "type": "photo",
        "position": {
          "x": 191.24613496932514,
          "y": 93.57637889688249
        },
        "width": 598.7838036809816,
        "height": 385.6196319018405,
        "fileName": "$$photo$$",
        "fit": "cover",
        "borderBrush": "#FFFFFFFF",
        "verticalAlignment": "Bottom"
      },
      {
        "element_id": "diary-text",
        "type": "text",
        "position": {
          "x": 191.24613496932514,
          "y": 532.692418384311
        },
        "width": 598.801472392638,
        "height": 502.26306954436455,
        "text": "$$diaryText$$",
        "fontFamily": "NanumMyeongjo",
        "fontSize": 12,
        "textBold": false,
        "textBrush": "#FF3F3F3F",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Left",
        "verticalAlignment": "Top",
        "textLineHeight": 26,
        "isDynamic": false,
        "splittable": false
      }
    ]
  }
} as const;

export const gallery: TemplateData = {
  "templateUid": "msFsr6Ult7qw",
  "templateName": "내지_gallery (A4 소프트커버 포토북)",
  "theme": "일기장A",
  "layout": {
    "backgroundColor": "#FFFFFFFF",
    "elements": [
      {
        "element_id": "left-divider",
        "type": "graphic",
        "position": {
          "x": 0,
          "y": 0
        },
        "width": 202.86331288343558,
        "height": 1212,
        "imageSource": "/api_platform_image/public/image260312122639465.PNG",
        "opacity": 1,
        "graphicType": "Sticker"
      },
      {
        "element_id": "month-num",
        "type": "text",
        "position": {
          "x": 42.298895705521474,
          "y": 96
        },
        "width": 103.51214723926381,
        "height": 89.61630695443645,
        "text": "$$monthNum$$",
        "fontFamily": "DM Serif Display",
        "fontSize": 65,
        "textBold": false,
        "textBrush": "#FFFFFFFF",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Center",
        "verticalAlignment": "Center",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "day-num",
        "type": "text",
        "position": {
          "x": 42.298895705521474,
          "y": 179.61630695443645
        },
        "width": 103.51214723926381,
        "height": 89.61630695443645,
        "text": "$$dayNum$$",
        "fontFamily": "DM Serif Display",
        "fontSize": 65,
        "textBold": false,
        "textBrush": "#FFFFFFFF",
        "backgroundColor": "#00FFFFFF",
        "textAlignment": "Center",
        "verticalAlignment": "Center",
        "isDynamic": false,
        "splittable": false
      },
      {
        "element_id": "collage",
        "type": "collageGallery",
        "position": {
          "x": 216.44171779141104,
          "y": 87.43645083932854
        },
        "width": 634.3067484662577,
        "height": 1036.642685851319,
        "tag": "collageGallery",
        "photos": "$$collagePhotos$$",
        "fit": "cover",
        "verticalAlignment": "Top",
        "container": {
          "maxWidth": 864,
          "maxHeight": 513.4772182254196,
          "itemGap": 8.83435582822086
        },
        "isDynamic": false,
        "layout": "auto",
        "gap": 10
      }
    ]
  }
} as const;

export const TEMPLATES = {
  cover,
  contentB,
  contentA,
  gallery,
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
