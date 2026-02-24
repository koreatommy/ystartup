"use client";

import { useTheme } from "@/hooks/useTheme";
import { Menu, Moon, Sun, Sparkles } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  onIndexClick?: () => void;
  /** 슬라이드 메뉴 열림 여부 (매뉴 버튼에 열기/닫기 표시용) */
  isMenuOpen?: boolean;
}

export function Header({ onMenuClick, onIndexClick, isMenuOpen = false }: HeaderProps) {
  const { toggleTheme, isDark, mounted } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--glass-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl px-4 md:px-6">
      {/* 로고/인덱스 버튼 (모바일에서만 보임 - 데스크톱은 사이드바에 있음) */}
      <div className="flex items-center gap-3 md:hidden">
        {onIndexClick ? (
          <button
            type="button"
            onClick={onIndexClick}
            className="flex items-center gap-2 rounded-lg transition-colors hover:opacity-80"
            aria-label="대시보드로 이동"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-sidebar text-lg font-bold text-gradient-primary">
              Y-START
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-sidebar text-lg font-bold text-gradient-primary">
              Y-START
            </span>
          </div>
        )}
      </div>

      {/* 데스크톱: 빈 공간 또는 검색/브레드크럼 등 추가 가능 */}
      <div className="hidden md:block" />

      {/* 오른쪽 액션 영역 */}
      <div className="flex items-center gap-2">
        {/* 다크모드 토글 (데스크톱에서만 - 모바일은 MobileNav에 있음) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)] md:flex"
          aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {mounted ? (
            isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )
          ) : (
            <div className="h-5 w-5" />
          )}
        </button>

        {/* 모바일 메뉴 버튼 */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-[var(--color-text-muted)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)] md:hidden min-h-10"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <span className="text-xs font-medium text-[var(--color-text)]">매뉴</span>
          <span className="text-[10px] opacity-80">
            {isMenuOpen ? "&lt; 닫기" : "열기 &gt;"}
          </span>
        </button>
      </div>
    </header>
  );
}
