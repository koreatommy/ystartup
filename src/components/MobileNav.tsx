"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { chapters } from "@/data/chapters";
import { useTheme } from "@/hooks/useTheme";
import { X, Moon, Sun, Home, Sparkles } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MobileNav({
  isOpen,
  onClose,
  selectedId,
  onSelect,
}: MobileNavProps) {
  const { toggleTheme, isDark, mounted } = useTheme();

  // 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* 사이드 패널 */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-[300px] max-w-[85vw] flex-col glass border-l border-[var(--glass-border)] shadow-2xl md:hidden"
        role="dialog"
        aria-label="네비게이션 메뉴"
      >
        {/* 헤더 */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--glass-border)] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-sidebar text-lg font-bold text-gradient-primary">
              Y-START
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-auto p-4">
          {/* 홈 버튼 */}
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={cn(
              "mb-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all",
              "hover:bg-[var(--glass-bg-hover)]",
              selectedId === ""
                ? "glass-active text-[var(--color-text)]"
                : "text-[var(--color-text-secondary)]"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                selectedId === ""
                  ? "gradient-primary text-white"
                  : "bg-[var(--glass-bg)] text-[var(--color-text-muted)]"
              )}
            >
              <Home className="h-5 w-5" />
            </div>
            <span className="font-sidebar font-medium">대시보드</span>
          </button>

          {/* 구분선 */}
          <div className="mb-4 h-px bg-[var(--glass-border)]" />

          {/* 챕터 목록 */}
          <div className="space-y-2">
            <span className="px-3 text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)]">
              챕터
            </span>
            {chapters.map((chapter) => {
              const isSelected = selectedId === chapter.id;

              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => handleSelect(chapter.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all",
                    "hover:bg-[var(--glass-bg-hover)]",
                    isSelected
                      ? "glass-active text-[var(--color-text)]"
                      : "text-[var(--color-text-secondary)]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white",
                      !isSelected && "opacity-80"
                    )}
                    style={{ backgroundColor: chapter.color }}
                  >
                    <span className="text-sm font-bold">{chapter.id}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-sidebar text-sm font-medium truncate">
                      {chapter.titleKo}
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)] truncate">
                      {chapter.titleEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 하단 - 다크모드 토글 */}
        <div className="shrink-0 border-t border-[var(--glass-border)] p-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[var(--color-text-secondary)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--glass-bg)]">
              {mounted ? (
                isDark ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </div>
            <span className="font-sidebar font-medium">
              {mounted ? (isDark ? "다크 모드" : "라이트 모드") : "테마"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
