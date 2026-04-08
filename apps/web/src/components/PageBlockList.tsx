import {
  getPageDescription,
  getPageLabel,
  isBlockHidden,
} from "@/lib/edit-session";

const TEXT = {
  sectionLabel: "페이지 구성",
  include: "포함",
  exclude: "제외",
  moveUp: "위로 이동",
  moveDown: "아래로 이동",
} as const;

interface PageBlockListProps {
  pages: string[];
  hiddenBlocks: string[];
  projectTitles?: string[];
  onToggle: (blockId: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

export default function PageBlockList({
  pages,
  hiddenBlocks,
  projectTitles,
  onToggle,
  onMove,
}: PageBlockListProps) {
  if (pages.length === 0) return null;

  return (
    <div>
      <p className="block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase">
        {TEXT.sectionLabel}
      </p>
      <div className="mt-2 space-y-2">
        {pages.map((pageId, index) => {
          const hidden = isBlockHidden(hiddenBlocks, pageId);
          const label = getPageLabel(pageId, projectTitles);
          const description = getPageDescription(pageId);

          return (
            <div
              key={`${pageId}-${index}`}
              className={`rounded-lg border px-3 py-2.5 ${
                hidden
                  ? "border-[color:var(--border-soft)] bg-[color:var(--surface-elevated)]"
                  : "border-[color:var(--accent)]/15 bg-[color:var(--accent-soft)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      hidden
                        ? "text-[color:var(--text-dim)]"
                        : "text-[color:var(--foreground)]"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[color:var(--text-dim)]">
                    {description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onMove(index, "up")}
                    disabled={index === 0}
                    aria-label={TEXT.moveUp}
                    className="flex h-7 w-7 items-center justify-center rounded text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(index, "down")}
                    disabled={index === pages.length - 1}
                    aria-label={TEXT.moveDown}
                    className="flex h-7 w-7 items-center justify-center rounded text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle(pageId)}
                    className={`ml-1 rounded px-2 py-1 text-xs font-semibold ${
                      hidden
                        ? "bg-[color:var(--surface)] text-[color:var(--text-dim)] hover:bg-[color:var(--accent-soft)]"
                        : "bg-[color:var(--accent)] text-white hover:opacity-90"
                    }`}
                  >
                    {hidden ? TEXT.exclude : TEXT.include}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
