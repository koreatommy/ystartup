"use client";

import { cn } from "@/lib/utils";

interface ChartShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  empty?: boolean;
  emptyMessage?: string;
}

export function ChartShell({
  title,
  description,
  children,
  className,
  empty,
  emptyMessage = "표시할 데이터가 없습니다.",
}: ChartShellProps) {
  return (
    <section
      className={cn("glass rounded-2xl p-5", className)}
      aria-label={title}
    >
      <div className="mb-4">
        <h3 className="font-main text-sm font-semibold text-[var(--color-text)]">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{description}</p>
        ) : null}
      </div>
      {empty ? (
        <div
          className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 text-center text-sm text-[var(--color-text-muted)]"
          role="status"
        >
          {emptyMessage}
        </div>
      ) : (
        <div className="min-h-[240px] w-full">{children}</div>
      )}
    </section>
  );
}

export function ChartGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-2">{children}</div>;
}
