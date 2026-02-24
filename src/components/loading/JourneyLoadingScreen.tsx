"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/data/chapters";
import { cn } from "@/lib/utils";

const TITLE_DURATION_MS = 600;
const LINE_DURATION_MS = 1200;
const STEP_STAGGER_MS = 180;
const HOLD_AFTER_LAST_MS = 800;
const FADE_OUT_MS = 500;

/** 이미지와 동일한 10단계 창업 여정 로딩 애니메이션 (타이틀 → 세로선 그리기 → 단계 순차 등장) */
export interface JourneyLoadingScreenProps {
  onComplete: () => void;
  minDisplayMs?: number;
  className?: string;
}

export function JourneyLoadingScreen({
  onComplete,
  minDisplayMs = 3500,
  className,
}: JourneyLoadingScreenProps) {
  const [phase, setPhase] = useState<"title" | "line" | "steps" | "out">("title");
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("line"), TITLE_DURATION_MS);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "line") return;
    const t2 = setTimeout(() => setPhase("steps"), LINE_DURATION_MS);
    return () => clearTimeout(t2);
  }, [phase]);

  useEffect(() => {
    if (phase !== "steps") return;
    const id = setInterval(() => {
      setVisibleStepCount((n) => {
        if (n >= chapters.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, STEP_STAGGER_MS);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (visibleStepCount < chapters.length) return;
    const totalAnimationMs =
      TITLE_DURATION_MS + LINE_DURATION_MS + chapters.length * STEP_STAGGER_MS;
    const holdMs = Math.max(HOLD_AFTER_LAST_MS, minDisplayMs - totalAnimationMs);
    const t = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, FADE_OUT_MS);
    }, holdMs);
    return () => clearTimeout(t);
  }, [visibleStepCount, onComplete, minDisplayMs]);

  const lineHeightPercent = phase === "title" ? 0 : phase === "line" ? 100 : 100;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col bg-[#0f0f1a] text-white transition-opacity duration-500",
        isExiting && "opacity-0",
        className
      )}
      aria-label="로딩 중: 10단계 창업 여정"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10">
        {/* 제목 */}
        <h2 className="font-sidebar text-xl font-semibold text-white">
          10단계 창업 여정
        </h2>

        {/* 타임라인 + 단계 목록 */}
        <div className="relative mt-8 flex flex-1 min-h-0">
          {/* 세로선 트랙 (연한 회색) */}
          <div className="absolute left-5 top-0 z-0 h-full w-0.5 bg-[var(--color-border-subtle)]" aria-hidden />
          {/* 세로선: 위에서 아래로 채워지는 보라색 라인 */}
          <div
            className="absolute left-5 top-0 z-[1] w-0.5 bg-[#8b5cf6] transition-[height] duration-[1200ms] ease-out"
            style={{ height: `${lineHeightPercent}%` }}
            aria-hidden
          />

          {/* 단계들 */}
          <ul className="relative flex flex-1 flex-col gap-5 pl-12">
            {chapters.map((chapter, index) => {
              const isVisible = visibleStepCount > index;
              return (
                <li
                  key={chapter.id}
                  className={cn(
                    "flex items-start gap-3 transition-all duration-300 ease-out",
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  )}
                >
                  {/* 숫자 원 (01~10) */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[#1a1a2e] text-sm font-bold text-[var(--color-text-muted)]"
                    aria-hidden
                  >
                    {chapter.id}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(--color-bar-${chapter.id})` }}
                        aria-hidden
                      />
                      <span className="font-sidebar text-sm font-medium text-white">
                        {chapter.titleKo}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      {chapter.titleEn}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
