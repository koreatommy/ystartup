"use client";

import { cn } from "@/lib/utils";

interface InfoRow {
  label: string;
  value: string;
}

interface InfoCardProps {
  title: string;
  rows: InfoRow[];
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function InfoCard({ title, rows, actionLabel, onAction, className }: InfoCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white"
          >
            <span className="relative z-10">{actionLabel}</span>
          </button>
        )}
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3"
          >
            <span className="text-sm text-[var(--color-text-muted)]">{row.label}</span>
            <span className="text-sm font-medium text-[var(--color-text)]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
