"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-[var(--glass-bg)]",
    iconColor: "text-[var(--color-text-muted)]",
  },
  primary: {
    iconBg: "gradient-primary",
    iconColor: "text-white",
  },
  success: {
    iconBg: "gradient-success",
    iconColor: "text-white",
  },
  warning: {
    iconBg: "gradient-warning",
    iconColor: "text-white",
  },
};

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            styles.iconBg,
            styles.iconColor
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              trend.isPositive
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            <span>{trend.isPositive ? "+" : "-"}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-[var(--color-text)]">{value}</p>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
