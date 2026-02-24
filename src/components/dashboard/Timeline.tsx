"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { chapters } from "@/data/chapters";
import { Check, ArrowRight } from "lucide-react";

const LINE_DURATION_MS = 1800;
const STEP_STAGGER_MS = 220;

interface TimelineProps {
  selectedId: string;
  onSelect: (id: string) => void;
  completedSteps?: string[];
  className?: string;
}

export function Timeline({
  selectedId,
  onSelect,
  completedSteps = [],
  className,
}: TimelineProps) {
  const [lineDone, setLineDone] = useState(false);
  const [visibleStepCount, setVisibleStepCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLineDone(true), LINE_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!lineDone) return;
    const id = setInterval(() => {
      setVisibleStepCount((n) => (n >= chapters.length ? n : n + 1));
    }, STEP_STAGGER_MS);
    return () => clearInterval(id);
  }, [lineDone]);

  return (
    <div className={cn("glass rounded-2xl p-6", className)}>
      <h3 className="mb-6 font-sidebar text-lg font-semibold text-[var(--color-text)]">
        10단계 창업 여정
      </h3>

      <div className="relative">
        {/* 타임라인 선 트랙 (숫자 뒤) */}
        <div className="absolute left-5 top-0 z-0 h-full w-0.5 bg-[var(--color-border-subtle)]" />
        {/* 타임라인 선: 페이지 내 로딩 시 위→아래로 채워짐 (숫자 뒤) */}
        <div
          className="absolute left-5 top-0 z-0 w-0.5 bg-[#8b5cf6] transition-[height] duration-[1800ms] ease-out"
          style={{ height: lineDone ? "100%" : "0%" }}
          aria-hidden
        />

        {/* 타임라인 아이템들 (순차 등장, 선 위에 표시) */}
        <div className="relative z-10 space-y-4">
          {chapters.map((chapter, index) => {
            const isCompleted = completedSteps.includes(chapter.id);
            const isActive = selectedId === chapter.id;
            const isRevealed = visibleStepCount > index;

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onSelect(chapter.id)}
                className={cn(
                  "group relative flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all duration-300",
                  "hover:bg-[var(--glass-bg-hover)]",
                  isActive && "bg-[var(--glass-bg-active)]",
                  !isRevealed && "opacity-0 translate-y-2 pointer-events-none",
                  isRevealed && "opacity-100 translate-y-0"
                )}
              >
                {/* 노드 */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-transparent text-white"
                      : isActive
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                        : "border-[var(--glass-border)] bg-[var(--color-bg-base)] text-[var(--color-text-muted)] group-hover:border-[var(--glass-border-hover)]"
                  )}
                  style={
                    isCompleted
                      ? { backgroundColor: chapter.color }
                      : undefined
                  }
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{chapter.id}</span>
                  )}
                </div>

                {/* 콘텐츠 */}
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: chapter.color }}
                    />
                    <span
                      className={cn(
                        "font-sidebar text-sm font-medium truncate",
                        isActive
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]"
                      )}
                    >
                      {chapter.titleKo}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] truncate">
                    {chapter.titleEn}
                  </p>
                </div>

                {isActive && (
                  <div className="flex h-10 items-center">
                    <ArrowRight className="h-4 w-4 text-[var(--color-primary)]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
