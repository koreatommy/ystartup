"use client";

import Link from "next/link";
import { Menu, LogOut, Sparkles, BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { logout } from "@/lib/actions/auth";
import { ROLE_LABELS } from "@/constants/member";
import type { Profile } from "@/types/member";

interface MemberHeaderProps {
  profile: Profile;
  onMenuClick: () => void;
}

export function MemberHeader({ profile, onMenuClick }: MemberHeaderProps) {
  const { toggleTheme, isDark, mounted } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--glass-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-all hover:bg-[var(--glass-bg-hover)] lg:hidden"
          aria-label="메뉴"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-sidebar text-lg font-bold text-gradient-primary">Y-START</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[var(--color-text-muted)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
          aria-label="워크북으로"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden text-sm font-medium sm:inline">워크북</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
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
        <div className="text-right">
          <div className="text-sm font-medium text-[var(--color-text)]">{profile.name}</div>
          <div className="text-xs text-[var(--color-text-muted)]">{ROLE_LABELS[profile.role]}</div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-all hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
            title="로그아웃"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
