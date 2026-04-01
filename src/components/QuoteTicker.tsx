"use client";

import { useEffect, useMemo, useState } from "react";
import type { WorkbookQuote } from "@/constants/quotes";

const DEFAULT_INTERVAL_MS = 10_000;

interface QuoteTickerProps {
  readonly quotes: readonly WorkbookQuote[];
  /** 격언 전환 주기 (ms). 기본 10초 */
  readonly intervalMs?: number;
  readonly className?: string;
}

export function QuoteTicker({
  quotes,
  intervalMs = DEFAULT_INTERVAL_MS,
  className = "",
}: QuoteTickerProps) {
  const safeQuotes = useMemo(
    () => quotes.filter((q) => q.text.trim().length > 0),
    [quotes],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeQuotes.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % safeQuotes.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, safeQuotes.length]);

  if (safeQuotes.length === 0) return null;

  const current = safeQuotes[index]!;

  return (
    <div
      className={`min-w-0 max-w-full text-center ${className}`.trim()}
      aria-live="polite"
      aria-atomic="true"
    >
      <div key={index} className="quote-ticker-enter">
        <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)] md:text-[0.9375rem]">
          <span className="font-medium text-[var(--color-text)]">
            {current.text}
          </span>
          <span className="text-[var(--color-text-muted)]"> — </span>
          <span className="text-[var(--color-text-muted)]">
            {current.author}
          </span>
        </p>
      </div>
    </div>
  );
}
