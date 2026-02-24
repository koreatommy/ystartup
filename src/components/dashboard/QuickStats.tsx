"use client";

import { cn } from "@/lib/utils";
import { StatsCard } from "./StatsCard";
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";

interface QuickStatsProps {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  className?: string;
}

export function QuickStats({
  totalSteps,
  completedSteps,
  inProgressSteps,
  className,
}: QuickStatsProps) {
  const notStartedSteps = totalSteps - completedSteps - inProgressSteps;

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <StatsCard
        icon={BookOpen}
        label="전체 단계"
        value={totalSteps}
        subtitle="창업 여정"
        variant="default"
      />
      <StatsCard
        icon={CheckCircle}
        label="완료"
        value={completedSteps}
        subtitle={`${Math.round((completedSteps / totalSteps) * 100)}% 달성`}
        variant="success"
      />
      <StatsCard
        icon={Clock}
        label="진행 중"
        value={inProgressSteps}
        subtitle="현재 학습 중"
        variant="warning"
      />
      <StatsCard
        icon={Trophy}
        label="남은 단계"
        value={notStartedSteps}
        subtitle="아직 시작하지 않음"
        variant="primary"
      />
    </div>
  );
}
