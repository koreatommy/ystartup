"use client";

import { cn } from "@/lib/utils";

interface FormField {
  label: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
}

interface FormCardProps {
  title: string;
  fields: FormField[];
  submitLabel: string;
  onSubmit?: () => void;
  loading?: boolean;
  className?: string;
}

export function FormCard({ title, fields, submitLabel, onSubmit, loading, className }: FormCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="min-w-0 text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          <span className="relative z-10">{loading ? "처리 중..." : submitLabel}</span>
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">{field.label}</span>
            <input
              type={field.type || "text"}
              value={field.value}
              placeholder={field.placeholder}
              disabled={field.disabled}
              onChange={field.onChange ? (e) => field.onChange!(e.target.value) : undefined}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
                field.disabled
                  ? "border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--color-text-subtle)] cursor-not-allowed"
                  : "border-[var(--glass-border)] bg-[var(--color-bg-base)] text-[var(--color-text)] focus:border-[var(--color-primary)]/50",
              )}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
