"use client";

import { Button } from "@/components/ui/button";
import { landingCta } from "@/content/landing";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";

interface LandingCtaProps {
  onStartFirstChapter: () => void;
}

export function LandingCta({ onStartFirstChapter }: LandingCtaProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl glass px-6 py-16 md:px-12 md:py-20">
      {/* 배경 장식 */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--gradient-primary-end)]/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--gradient-secondary-start)]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* 아이콘 */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg glow-primary">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        <h2 className="font-sidebar text-2xl font-bold text-[var(--color-text)] md:text-3xl">
          <span className="text-gradient-primary">{landingCta.title}</span>
        </h2>
        
        <p className="mt-4 font-main text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          {landingCta.message}
        </p>

        <Button
          variant="gradient"
          size="lg"
          onClick={onStartFirstChapter}
          className="group mt-8 gap-2 font-sidebar glow-primary"
          aria-label="워크북에서 시작하기"
        >
          <BookOpen className="h-4 w-4" />
          {landingCta.ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
}
