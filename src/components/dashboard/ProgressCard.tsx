"use client";

import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { diameter: 80, strokeWidth: 6 },
  md: { diameter: 120, strokeWidth: 8 },
  lg: { diameter: 160, strokeWidth: 10 },
};

export function ProgressCard({
  title,
  subtitle,
  progress,
  size = "md",
  showPercentage = true,
  className,
}: ProgressCardProps) {
  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("glass rounded-2xl p-6 card-hover", className)}>
      <div className="flex flex-col items-center">
        {/* 원형 프로그레스 */}
        <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
          <svg
            className="progress-ring"
            width={config.diameter}
            height={config.diameter}
          >
            {/* 배경 원 */}
            <circle
              cx={config.diameter / 2}
              cy={config.diameter / 2}
              r={radius}
              fill="none"
              stroke="var(--glass-border)"
              strokeWidth={config.strokeWidth}
            />
            {/* 진행 원 */}
            <circle
              className="progress-ring-circle"
              cx={config.diameter / 2}
              cy={config.diameter / 2}
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
            {/* 그라디언트 정의 */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--gradient-primary-start)" />
                <stop offset="100%" stopColor="var(--gradient-primary-end)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* 중앙 퍼센트 텍스트 */}
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gradient-primary text-2xl font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div className="mt-4 text-center">
          <p className="font-semibold text-[var(--color-text)]">{title}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
