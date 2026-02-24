"use client";

import { useEffect, useState } from "react";

interface ScrollProgressProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

export function ScrollProgress({ scrollContainerRef }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      const value = max > 0 ? Math.min((scrollTop / max) * 100, 100) : 0;
      setProgress(value);
    };

    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateProgress);
      resizeObserver.disconnect();
    };
  }, [scrollContainerRef]);

  return (
    <div
      className="fixed left-0 right-0 top-16 z-30 h-0.5 bg-[var(--glass-border)]"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="페이지 스크롤 진행"
    >
      <div
        className="h-full gradient-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
