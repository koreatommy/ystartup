"use client";

import type { ChapterMeta } from "@/types/workbook";
import { cn } from "@/lib/utils";

interface WorkbookThumbnailProps {
  chapter: ChapterMeta;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

export function WorkbookThumbnail({
  chapter,
  isSelected,
  onSelect,
}: WorkbookThumbnailProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(chapter.id)}
      aria-label={`${chapter.titleKo} 워크북 보기`}
      className={cn(
        "flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl glass transition-all card-hover",
        isSelected && "ring-2 ring-[var(--color-primary)] bg-[var(--glass-bg-active)]"
      )}
      aria-pressed={isSelected}
    >
      <span
        className="h-1.5 w-full shrink-0"
        style={{ backgroundColor: chapter.color }}
        aria-hidden
      />
      <div className="flex flex-col gap-1.5 p-3 text-left">
        <div className="flex items-center gap-2">
          <span 
            className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white"
            style={{ backgroundColor: chapter.color }}
          >
            {chapter.id}
          </span>
          <span className="font-main text-xs font-semibold text-[var(--color-text)]">
            WB {chapter.id}
          </span>
        </div>
        <span className="line-clamp-2 font-main text-xs font-normal leading-snug text-[var(--color-text-muted)]">
          {chapter.titleKo}
        </span>
      </div>
    </button>
  );
}
