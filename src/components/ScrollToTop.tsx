"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 300;

interface ScrollToTopProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

export function ScrollToTop({ scrollContainerRef }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateVisible = () => {
      setVisible(el.scrollTop > SCROLL_THRESHOLD);
    };

    updateVisible();
    el.addEventListener("scroll", updateVisible, { passive: true });

    return () => el.removeEventListener("scroll", updateVisible);
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-30 flex h-12 w-12 items-center justify-center rounded-full glass shadow-lg transition-all",
        "hover:scale-105 hover:bg-[var(--glass-bg-hover)] hover:shadow-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        "group gradient-primary text-white glow-primary"
      )}
      aria-label="맨 위로 스크롤"
    >
      <ChevronUp className="h-5 w-5" />
      <span className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg glass px-3 py-1.5 text-xs text-[var(--color-text)] opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        맨 위로
      </span>
    </button>
  );
}
