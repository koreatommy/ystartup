import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  className?: string;
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
      <div className="mt-3 break-words text-3xl font-bold text-[var(--color-text)]">{value}</div>
      <div className="mt-2 text-sm text-[var(--color-text-subtle)]">{hint}</div>
    </div>
  );
}
