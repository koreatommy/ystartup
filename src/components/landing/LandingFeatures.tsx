"use client";

import { Card, CardContent } from "@/components/ui/card";
import { publicLanding } from "@/content/landing";
import { BookOpen, FileEdit, Search, BarChart3 } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const iconMap = {
  BookOpen,
  FileEdit,
  Search,
  BarChart3,
} as const;

export function LandingFeatures() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <section ref={ref} className="scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <h2 className="font-sidebar text-2xl md:text-3xl font-bold text-center text-[var(--color-text)] mb-4">
          실제 학습이 가능한 구조로 설계했습니다
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {publicLanding.features.map((feat, i) => {
            const Icon = iconMap[feat.icon];
            return (
              <Card
                key={feat.title}
                variant="glass-hover"
                className={`transition-all duration-700 ease-out ${
                  inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <CardContent className="flex flex-col items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-sidebar text-base font-semibold text-[var(--color-text)]">
                    {feat.title}
                  </h3>
                  <p className="font-sidebar text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {feat.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
