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
    <section className="relative overflow-hidden rounded-2xl glass px-6 py-16 md:px-12 md:py-24">
      {/* 배경 장식 */}
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[var(--gradient-primary-start)]/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[var(--gradient-secondary-start)]/10 blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* 배지 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Y-START 청소년 창업 교육
          </span>
        </div>

        {/* 제목 */}
        <h1 className="font-sidebar text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
          {landingHero.title.split(" ").slice(0, 2).join(" ")}{" "}
          <span className="text-gradient-primary">
            {landingHero.title.split(" ").slice(2).join(" ")}
          </span>
        </h1>
        
        <p className="mt-4 font-main text-lg text-[var(--color-text-muted)]">
          {landingHero.subtitle}
        </p>

        {/* 소개 문단 */}
        <div className="mt-8 space-y-4 font-main text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {landingHero.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* CTA 버튼들 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="gradient"
            size="lg"
            onClick={onStartFirstChapter}
            className="gap-2 font-sidebar glow-primary"
            aria-label="1단계부터 워크북 시작하기"
          >
            <Rocket className="h-4 w-4" />
            1단계부터 시작하기
          </Button>
          {onScrollToCurriculum && (
            <Button
              variant="glass"
              size="lg"
              onClick={onScrollToCurriculum}
              className="gap-2 font-sidebar"
              aria-label="전체 10단계 커리큘럼 보기"
            >
              전체 10단계 보기
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
