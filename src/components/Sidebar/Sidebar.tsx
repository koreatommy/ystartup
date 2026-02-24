"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./SidebarNav";
import { SidebarToggle } from "./SidebarToggle";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Sparkles } from "lucide-react";

interface SidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const SIDEBAR_COLLAPSED_KEY = "ystart-sidebar-collapsed";

export function Sidebar({ selectedId, onSelect }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toggleTheme, isDark, mounted } = useTheme();

  // 로컬 스토리지에서 상태 복원
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState));
  };

  return (
    <aside
      className={cn(
        "relative hidden h-full flex-col border-r border-[var(--glass-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl md:flex sidebar-transition",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* 로고 영역 */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-[var(--glass-border)] px-4",
          isCollapsed && "justify-center px-0"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-sidebar text-lg font-bold text-gradient-primary">
              Y-START
            </span>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav
          selectedId={selectedId}
          onSelect={onSelect}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* 하단 영역 - 매뉴 열기/닫기, 다크모드 토글 */}
      <div
        className={cn(
          "shrink-0 space-y-3 border-t border-[var(--glass-border)] p-3",
          isCollapsed && "flex flex-col items-center"
        )}
      >
        <SidebarToggle
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          position="inline"
        />
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[var(--color-text-secondary)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]",
            isCollapsed && "justify-center px-2.5"
          )}
          title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--glass-bg)]">
            {mounted ? (
              isDark ? (
                <Moon className="h-4.5 w-4.5" />
              ) : (
                <Sun className="h-4.5 w-4.5" />
              )
            ) : (
              <div className="h-4.5 w-4.5" />
            )}
          </div>
          {!isCollapsed && (
            <span className="font-sidebar text-sm font-medium">
              {mounted ? (isDark ? "다크 모드" : "라이트 모드") : "테마"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
