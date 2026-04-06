import type { BookTypeId } from "@/lib/book-types";

export interface CustomText {
  coverTitle: string;
  graduationMessage: string;
}

export interface EditSession {
  bookType: BookTypeId;
  customText: CustomText;
  hiddenBlocks: string[];
  pages: string[];
}

export function createDefaultEditSession(bookType: BookTypeId, subjectName: string): EditSession {
  return {
    bookType,
    customText: {
      coverTitle: subjectName,
      graduationMessage: `${subjectName}의 수료를 진심으로 축하합니다.`
    },
    hiddenBlocks: [],
    pages: []
  };
}
