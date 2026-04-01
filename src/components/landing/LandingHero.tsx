"use client";

import { Button } from "@/components/ui/button";
import { landingHero } from "@/content/landing";
import { Rocket, ChevronDown, Sparkles } from "lucide-react";

interface LandingHeroProps {
  onStartFirstChapter: () => void;
  onScrollToCurriculum?: () => void;
}

export function LandingHero({
  onStartFirstChapter,
  onScrollToCurriculum,
}: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl px-6 py-20 md:px-12 md:py-32">
      {/* gradient mesh 배경 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[var(--gradient-primary-start)]/15 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[var(--gradient-secondary-start)]/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-[var(--gradient-primary-end)]/8 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center font-sidebar">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Y-START 청소년 창업 교육
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text)]">
          {landingHero.title.split(" ").slice(0, 2).join(" ")}{" "}
          <span className="text-gradient-primary">
            {landingHero.title.split(" ").slice(2).join(" ")}
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-xl font-medium text-[var(--color-text-muted)]">
          {landingHero.subtitle}
        </p>

        <div className="mt-8 space-y-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
          {landingHero.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            variant="gradient"
            size="lg"
            onClick={onStartFirstChapter}
            className="w-full sm:w-auto gap-2 glow-primary text-base md:text-lg font-semibold"
            aria-label="1단계부터 시작하기"
          >
            <Rocket className="h-4 w-4" />
            {landingHero.ctaPrimary}
          </Button>
          {onScrollToCurriculum && (
            <Button
              variant="glass"
              size="lg"
              onClick={onScrollToCurriculum}
              className="w-full sm:w-auto gap-2 text-base md:text-lg"
              aria-label="워크북 둘러보기"
            >
              {landingHero.ctaSecondary}
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* scroll hint */}
        {onScrollToCurriculum && (
          <button
            type="button"
            onClick={onScrollToCurriculum}
            className="mt-12 mx-auto flex items-center justify-center animate-bounce text-[var(--color-text-subtle)]"
            aria-label="아래로 스크롤"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        )}
      </div>
    </section>
  );
}
