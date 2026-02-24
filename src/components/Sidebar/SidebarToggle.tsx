"use client";

import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  /** 'edge' = 사이드바 오른쪽 가장자리(기본), 'inline' = 하단 영역 내부 인라인 */
  position?: "edge" | "inline";
}

export function SidebarToggle({ isCollapsed, onToggle, position = "edge" }: SidebarToggleProps) {
  const isInline = position === "inline";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group z-10 flex flex-col items-center justify-center gap-1 border border-[var(--glass-border)] bg-[var(--glass-bg)] py-2.5 shadow-md backdrop-blur-xl transition-all duration-200",
        "hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-bg-hover)] hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        "active:scale-[0.98] active:bg-[var(--glass-bg-active)]",
        "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
        isInline
          ? "min-h-[52px] w-full rounded-xl px-4"
          : "absolute -right-3 top-6 min-h-[52px] rounded-l-xl border-r-0 pl-4 pr-2.5"
      )}
      aria-label={isCollapsed ? "메뉴 열기" : "메뉴 닫기"}
    >
      <span className="text-xs font-semibold tracking-tight text-[var(--color-text)]">
        매뉴
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-[11px] font-medium transition-colors",
          "text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]"
        )}
      >
        {isCollapsed ? "열기 >" : "< 닫기"}
      </span>
    </button>
  );
}
