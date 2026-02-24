"use client";

import type { ContentBlockData } from "@/content/landing";
import { DataTable } from "./DataTable";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ContentBlockProps {
  block: ContentBlockData;
  className?: string;
}

export function ContentBlock({ block, className }: ContentBlockProps) {
  switch (block.type) {
    case "paragraph":
      return block.paragraph ? (
        <p
          className={cn(
            "font-main text-[15px] leading-relaxed text-[var(--color-text-secondary)]",
            className
          )}
        >
          {block.paragraph}
        </p>
      ) : null;

    case "list":
      return block.listItems?.length ? (
        <ul
          className={cn(
            "space-y-2 font-main text-[15px] text-[var(--color-text-secondary)]",
            className
          )}
        >
          {block.listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null;

    case "highlight":
      return block.highlight ? (
        <div
          className={cn(
            "rounded-xl glass border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-5 py-4 font-main text-sm font-medium text-[var(--color-text)]",
            className
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full gradient-primary">
              <span className="text-[10px] text-white">!</span>
            </div>
            <span>{block.highlight}</span>
          </div>
        </div>
      ) : null;

    case "table":
      return block.table ? (
        <DataTable data={block.table} className={className} />
      ) : null;

    case "checklist":
      return block.checklist?.length ? (
        <ul
          className={cn(
            "space-y-3 font-main text-[15px] text-[var(--color-text-secondary)]",
            className
          )}
        >
          {block.checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md glass border-[var(--glass-border)]">
                {item.checked && (
                  <Check className="h-3 w-3 text-[var(--color-primary)]" />
                )}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null;

    default:
      return null;
  }
}
