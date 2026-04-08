import { TEMPLATES } from "./templates";
import type { TemplateData } from "./types";

export interface ResolvedTemplate {
  template: TemplateData;
  /** 표지(스프레드 뷰)인지 여부 — BookPreview에서 templateWidth 결정에 사용 */
  isCover: boolean;
}

/**
 * 백엔드 payload-mapper가 반환한 templateUid를 정적 저장된 TEMPLATES에 매핑한다.
 *
 * 알 수 없는 templateUid는 null 반환 → 호출자가 빈 페이지로 처리하거나 에러 표시.
 */
export function resolveTemplate(templateUid: string): ResolvedTemplate | null {
  if (templateUid === TEMPLATES.cover.templateUid) {
    return { template: TEMPLATES.cover, isCover: true };
  }
  if (templateUid === TEMPLATES.contentB.templateUid) {
    return { template: TEMPLATES.contentB, isCover: false };
  }
  if (templateUid === TEMPLATES.contentA.templateUid) {
    return { template: TEMPLATES.contentA, isCover: false };
  }
  if (templateUid === TEMPLATES.gallery.templateUid) {
    return { template: TEMPLATES.gallery, isCover: false };
  }
  return null;
}
