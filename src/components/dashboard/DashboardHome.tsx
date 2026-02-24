"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { QuickStats } from "./QuickStats";
import { Timeline } from "./Timeline";
import { Rocket, Sparkles, ArrowRight, ZoomIn, X } from "lucide-react";
import { chapters } from "@/data/chapters";

const ROADMAP_IMG_SRC = "/roadmap-6steps.png";
const ROADMAP_IMG_ALT =
  "세상을 바꾸는 10단계 창업 여정 지도 [Y-START UP] - 팀 빌딩, 아이디어·5 Whys, 고객 공감·문제 구체화, 제품·비즈니스 모델, 전략·운영·재무·피칭";

interface DashboardHomeProps {
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

// 임시 진행 상태 (나중에 실제 데이터로 교체)
const MOCK_COMPLETED_STEPS: string[] = [];
const MOCK_IN_PROGRESS_STEPS = 0;

export function DashboardHome({
  selectedId,
  onSelect,
  className,
}: DashboardHomeProps) {
  const [roadmapZoomOpen, setRoadmapZoomOpen] = useState(false);
  const totalSteps = chapters.length;
  const completedSteps = MOCK_COMPLETED_STEPS.length;
  const inProgressSteps = MOCK_IN_PROGRESS_STEPS;

  return (
    <div className={cn("space-y-8", className)}>
      {/* 환영 헤더 */}
      <section className="glass rounded-2xl p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--color-primary)]">
                Y-START 창업 교육
              </span>
            </div>
            <h1 className="font-sidebar text-3xl font-bold text-[var(--color-text)]">
              꿈을 현실로 만드는{" "}
              <span className="text-gradient-primary">창업 여정</span>
            </h1>
            <div className="max-w-2xl space-y-3 text-[var(--color-text-secondary)] [&_p]:leading-relaxed">
              <p>
                🗺️ 꿈을 현실로 만드는 창업 여정: 아이디어에서 실행까지의 로드맵
              </p>
              <p>
                👋 안녕하세요, 미래의 주인공인 청소년 창업가 여러분! 여러분은 &apos;창업&apos;이라는 단어를 들으면 무엇이 떠오르나요? 거창한 회사를 세우는 것만이 창업은 아닙니다. 우리 주변의 🔍 문제를 발견하고, 새로운 해결 방법을 찾아가는 과정 자체가 창업입니다. 이 여정은 여러분의{" "}
                <strong>✨ 창의성(Creativity), 도전정신(Challenge), 그리고 협업 능력(Collaboration)</strong>
                을 키워가는 아주 특별한 탐험이 될 것입니다. 10단계의 지도를 따라 &apos;나도 세상을 바꿀 수 있다&apos;는 💪 자신감을 얻어보세요!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect("01")}
            className="group inline-flex items-center gap-2 rounded-xl btn-gradient px-6 py-3 font-sidebar font-medium text-white shadow-lg transition-all hover:shadow-xl glow-primary"
          >
            <Rocket className="h-5 w-5" />
            <span>1단계부터 시작하기</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* 6단계 로드맵(좌) + 10단계 창업 여정 타임라인(우). 로드맵 아래 빈공간에 진행상황 2x2 */}
      <section
        className="grid gap-6 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start"
        aria-label="로드맵 및 창업 여정"
      >
        <div className="flex min-w-0 flex-col gap-6">
          <div
            className="relative overflow-hidden rounded-2xl glass p-4 md:p-6"
            aria-label="Y-START UP 로드맵"
          >
            <button
              type="button"
              onClick={() => setRoadmapZoomOpen(true)}
              className="group absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="로드맵 크게 보기"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <img
              src={ROADMAP_IMG_SRC}
              alt={ROADMAP_IMG_ALT}
              className="w-full cursor-pointer rounded-xl object-contain transition-opacity hover:opacity-95"
              onClick={() => setRoadmapZoomOpen(true)}
            />
          </div>

          {/* 로드맵 확대 모달 */}
          {roadmapZoomOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setRoadmapZoomOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="로드맵 확대 보기"
            >
              <button
                type="button"
                onClick={() => setRoadmapZoomOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="닫기"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={ROADMAP_IMG_SRC}
                alt={ROADMAP_IMG_ALT}
                className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <QuickStats
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            inProgressSteps={inProgressSteps}
          />
        </div>
        <div className="min-w-0 shrink-0 lg:max-w-[340px]">
          <Timeline
            selectedId={selectedId}
            onSelect={onSelect}
            completedSteps={MOCK_COMPLETED_STEPS}
          />
        </div>
      </section>

      {/* 빠른 시작 섹션 */}
      <section className="glass rounded-2xl p-6">
        <h2 className="mb-4 font-sidebar text-lg font-semibold text-[var(--color-text)]">
          추천 학습
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.slice(0, 3).map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect(chapter.id)}
              className="group flex items-start gap-4 rounded-xl bg-[var(--glass-bg)] p-4 text-left transition-all hover:bg-[var(--glass-bg-hover)] card-hover"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ backgroundColor: chapter.color }}
              >
                <span className="text-lg font-bold">{chapter.id}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-sidebar font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {chapter.titleKo}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)] truncate">
                  {chapter.titleEn}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[var(--color-primary)]" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
