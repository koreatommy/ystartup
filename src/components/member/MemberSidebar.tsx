"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import type { Role } from "@/constants/member";
import { ROLE_LABELS } from "@/constants/member";

export interface MenuGroup {
  section: string;
  items: string[];
}

interface MemberSidebarProps {
  title: string;
  role: Role;
  menu: MenuGroup[];
  selected: string;
  onSelect: (item: string) => void;
  className?: string;
}

export function MemberSidebar({ title, role, menu, selected, onSelect, className }: MemberSidebarProps) {
  return (
    <aside className={cn("w-[260px] shrink-0 flex-col border-r border-[var(--glass-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl", className ?? "hidden lg:flex")}>
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-[var(--glass-border)] px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <span className="block font-sidebar text-sm font-bold text-gradient-primary">Y-START</span>
          <span className="block text-[10px] text-[var(--color-text-subtle)]">{title}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="mb-3 px-3">
          <span className="text-xs text-[var(--color-text-subtle)]">
            로그인 역할: {ROLE_LABELS[role]}
          </span>
        </div>

        <nav className="space-y-5">
          {menu.map((group) => (
            <div key={group.section}>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
                {group.section}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = selected === item;
                  return (
                    <button
                      key={item}
                      onClick={() => onSelect(item)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all",
                        isActive
                          ? "glass-active text-[var(--color-text)] font-medium"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]",
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
