"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { curriculumItems, landingCurriculumIntro } from "@/content/landing";
import { chapters } from "@/data/chapters";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface LandingCurriculumProps {
  onSelectChapter: (id: string) => void;
  curriculumRef?: React.RefObject<HTMLDivElement | null>;
}

export function LandingCurriculum({
  onSelectChapter,
  curriculumRef,
}: LandingCurriculumProps) {
  return (
    <section
      ref={curriculumRef}
      id="curriculum"
      className="scroll-mt-6 space-y-6"
    >
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="font-sidebar text-xl text-[var(--color-text)]">
            {landingCurriculumIntro.title}
          </CardTitle>
          <div className="space-y-2 font-main text-[15px] leading-relaxed text-[var(--color-text-muted)]">
            {landingCurriculumIntro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-main text-sm font-semibold text-[var(--color-text)]">
            창업 여정 10단계 커리큘럼
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {curriculumItems.map((item) => {
              const chapter = chapters.find((c) => c.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectChapter(item.id)}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl bg-[var(--glass-bg)] p-4 text-left transition-all",
                    "hover:bg-[var(--glass-bg-hover)] border border-transparent hover:border-[var(--glass-border)]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  )}
                  aria-label={`${item.session} ${item.titleKo} 워크북으로 이동`}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-lg transition-transform group-hover:scale-105"
                    style={{ backgroundColor: chapter?.color }}
                  >
                    <span className="text-sm font-bold">{item.id}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-main text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {item.titleKo}
                    </span>
                    <span className="mt-0.5 block font-main text-xs text-[var(--color-text-muted)]">
                      {item.titleEn}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[var(--color-primary)]" />
                </button>
              );
            })}
          </div>
          <p className="font-main text-sm italic text-[var(--color-text-muted)]">
            {landingCurriculumIntro.outro}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
