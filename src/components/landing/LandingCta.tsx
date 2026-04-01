"use client";

import { Button } from "@/components/ui/button";
import { publicLanding } from "@/content/landing";
import { Sparkles, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface LandingCtaProps {
  onStart: () => void;
  onScrollToCurriculum?: () => void;
}

export function LandingCta({ onStart, onScrollToCurriculum }: LandingCtaProps) {
  const { ref, inView } = useInView();
  const { bottomCta } = publicLanding;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden rounded-2xl glass px-6 py-16 md:px-12 md:py-20 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--gradient-primary-end)]/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--gradient-secondary-start)]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center font-sidebar">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg glow-primary">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
          <span className="text-gradient-primary">{bottomCta.title}</span>
        </h2>

        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
          {bottomCta.body}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            variant="gradient"
            size="lg"
            onClick={onStart}
            className="group w-full sm:w-auto gap-2 glow-primary text-base md:text-lg font-semibold"
            aria-label="지금 시작하기"
          >
            {bottomCta.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          {onScrollToCurriculum && (
            <Button
              variant="glass"
              size="lg"
              onClick={onScrollToCurriculum}
              className="w-full sm:w-auto gap-2 text-base"
              aria-label="전체 커리큘럼 보기"
            >
              {bottomCta.ctaSecondary}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
