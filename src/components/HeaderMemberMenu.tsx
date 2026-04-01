"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { HoverCard } from "radix-ui";
import { logout } from "@/lib/actions/auth";
import { ROLE_LABELS } from "@/constants/member";
import { cn } from "@/lib/utils";
import type { WorkbookHeaderUser } from "@/types/dashboard";

interface HeaderMemberMenuProps {
  memberAreaHref: string;
  memberAreaLabel: string;
  user: WorkbookHeaderUser;
}

const triggerClass = cn(
  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[var(--color-text-muted)] transition-all",
  "hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]"
);

const panelClass = cn(
  "z-[100] w-[min(calc(100vw-1.5rem),260px)] rounded-xl border border-[var(--glass-border)]",
  "bg-[var(--sidebar-bg)] p-3 shadow-lg backdrop-blur-xl"
);

export function HeaderMemberMenu({
  memberAreaHref,
  memberAreaLabel,
  user,
}: HeaderMemberMenuProps) {
  const roleLabel = ROLE_LABELS[user.role];

  return (
    <HoverCard.Root openDelay={150} closeDelay={150}>
      <HoverCard.Trigger asChild>
        <button type="button" className={triggerClass} aria-label={memberAreaLabel}>
          <User className="h-5 w-5 shrink-0" />
          <span className="hidden text-sm font-medium md:inline">{memberAreaLabel}</span>
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className={panelClass}
        >
          <div className="min-w-0 space-y-1 border-b border-[var(--glass-border)] pb-3">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">{user.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
            <p className="truncate text-xs text-[var(--color-text-subtle)]" title={user.email}>
              {user.email}
            </p>
          </div>
          <div className="mt-3 space-y-2">
            <Link
              href={memberAreaHref}
              className={cn(
                "flex min-h-10 w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium",
                "text-[var(--color-text-secondary)] transition-colors",
                "hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
              )}
            >
              <User className="h-4 w-4 shrink-0" />
              {memberAreaLabel}
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className={cn(
                  "flex min-h-10 w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium",
                  "text-[var(--color-text-secondary)] transition-colors",
                  "hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                로그아웃
              </button>
            </form>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
