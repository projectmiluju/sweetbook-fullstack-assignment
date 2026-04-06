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

export function buildProjectBlockId(index: number): string {
  return `project:${index}`;
}

export function buildPhotoBlockId(index: number): string {
  return `photo:${index}`;
}

export function isBlockHidden(hiddenBlocks: string[], blockId: string): boolean {
  return hiddenBlocks.includes(blockId);
}

export function toggleHiddenBlock(hiddenBlocks: string[], blockId: string): string[] {
  if (hiddenBlocks.includes(blockId)) {
    return hiddenBlocks.filter((id) => id !== blockId);
  }
  return [...hiddenBlocks, blockId];
}
