"use client";

import { cn } from "@/lib/utils";
import { chapters } from "@/data/chapters";
import {
  BookOpen,
  Lightbulb,
  Users,
  Target,
  Palette,
  Building2,
  Megaphone,
  Settings2,
  Calculator,
  Presentation,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarNavProps {
  selectedId: string;
  onSelect: (id: string) => void;
  isCollapsed: boolean;
}

const chapterIcons: Record<string, LucideIcon> = {
  "01": Users,
  "02": Lightbulb,
  "03": Target,
  "04": BookOpen,
  "05": Palette,
  "06": Building2,
  "07": Megaphone,
  "08": Settings2,
  "09": Calculator,
  "10": Presentation,
};

export function SidebarNav({
  selectedId,
  onSelect,
  isCollapsed,
}: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {/* 홈/대시보드 버튼 */}
      <button
        type="button"
        onClick={() => onSelect("")}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
          "hover:bg-[var(--glass-bg-hover)]",
          selectedId === ""
            ? "glass-active text-[var(--color-text)]"
            : "text-[var(--color-text-secondary)]",
          isCollapsed && "justify-center px-0"
        )}
        title={isCollapsed ? "대시보드" : undefined}
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
            selectedId === ""
              ? "gradient-primary text-white shadow-lg"
              : "bg-[var(--glass-bg)] text-[var(--color-text-muted)] group-hover:bg-[var(--glass-bg-hover)] group-hover:text-[var(--color-text)]"
          )}
        >
          <Home className="h-4.5 w-4.5" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <span className="font-sidebar text-sm font-medium">대시보드</span>
          </div>
        )}
      </button>

      {/* 구분선 */}
      <div className="my-2 h-px bg-[var(--glass-border)]" />

      {/* 챕터 목록 */}
      <div className="space-y-1">
        {!isCollapsed && (
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)]">
            챕터
          </span>
        )}
        {chapters.map((chapter) => {
          const Icon = chapterIcons[chapter.id] || BookOpen;
          const isSelected = selectedId === chapter.id;

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect(chapter.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                "hover:bg-[var(--glass-bg-hover)]",
                isSelected
                  ? "glass-active text-[var(--color-text)]"
                  : "text-[var(--color-text-secondary)]",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? `${chapter.id}. ${chapter.titleKo}` : undefined}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
                  isSelected
                    ? "text-white shadow-lg"
                    : "bg-[var(--glass-bg)] text-[var(--color-text-muted)] group-hover:bg-[var(--glass-bg-hover)] group-hover:text-[var(--color-text)]"
                )}
                style={
                  isSelected
                    ? { backgroundColor: chapter.color }
                    : undefined
                }
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: chapter.color }}
                    />
                    <span className="font-sidebar text-sm font-medium truncate">
                      {chapter.titleKo}
                    </span>
                  </div>
                  <span className="mt-0.5 block text-xs text-[var(--color-text-muted)] truncate">
                    {chapter.titleEn}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
