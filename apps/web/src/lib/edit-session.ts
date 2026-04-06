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

export function buildDefaultPages(projectCount: number, photoCount: number): string[] {
  const pages: string[] = [];
  for (let i = 0; i < projectCount; i++) {
    pages.push(buildProjectBlockId(i));
  }
  for (let i = 0; i < photoCount; i++) {
    pages.push(buildPhotoBlockId(i));
  }
  return pages;
}

export function movePage(pages: string[], index: number, direction: "up" | "down"): string[] {
  if (direction === "up" && index === 0) return pages;
  if (direction === "down" && index === pages.length - 1) return pages;

  const newPages = [...pages];
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  [newPages[index], newPages[swapIndex]] = [newPages[swapIndex], newPages[index]];
  return newPages;
}
