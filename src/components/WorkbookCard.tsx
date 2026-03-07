"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { WorkbookContent } from "@/types/workbook";
import { chapters } from "@/data/chapters";
import { BookOpen, ArrowRight } from "lucide-react";
import { GanttChartExample } from "./GanttChartExample";
import { BepChart } from "./BepChart";

/** **텍스트** 를 <strong>으로 렌더링 */
function SummaryBodyWithBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-[var(--color-text)]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

interface WorkbookCardProps {
  content: WorkbookContent;
}

export function WorkbookCard({ content }: WorkbookCardProps) {
  const chapter = chapters.find((c) => c.id === content.wbId.replace("WB", "").trim());
  const chapterColor = chapter?.color || "var(--color-primary)";
  const wb10ConfettiFired = useRef(false);

  useEffect(() => {
    if (content.wbId !== "WB 10" || wb10ConfettiFired.current || typeof window === "undefined")
      return;
    wb10ConfettiFired.current = true;

    const fire = async () => {
      const confetti = (await import("canvas-confetti")).default;
      const duration = 2_000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };

      frame();
    };

    const t = setTimeout(fire, 400);
    return () => clearTimeout(t);
  }, [content.wbId]);

  return (
    <article className="glass rounded-2xl overflow-hidden card-hover">
      {/* 헤더 영역 - 그라디언트 배경 */}
      <div 
        className="relative px-6 py-8 md:px-8"
        style={{
          background: `linear-gradient(135deg, ${chapterColor}20 0%, transparent 100%)`,
        }}
      >
        {/* 배경 장식 */}
        <div 
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: chapterColor }}
        />

        <div className="relative z-10 flex flex-col gap-4">
          {/* 배지 */}
          <div 
            className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-white shadow-lg"
            style={{ backgroundColor: chapterColor }}
          >
            <BookOpen className="h-4 w-4" />
            <span className="font-main text-sm font-semibold">{content.wbId}</span>
            <span className="font-main text-sm font-medium">워크북</span>
          </div>

          {/* 타이틀 */}
          <div className="flex items-center gap-4">
            <span 
              className="h-12 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: chapterColor }}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="font-sidebar text-xl font-bold leading-snug text-[var(--color-text)] md:text-2xl">
                {content.titleKo}
              </h2>
              <p className="font-main text-sm font-normal text-[var(--color-text-muted)]">
                {content.titleEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-6 py-6 md:px-8">
        <h3 className="mb-4 font-main text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          학습 내용
        </h3>
        {(content.summaryTitle != null && content.summaryBody != null) ||
        (content.summaryChecklist != null && content.summaryChecklist.length > 0) ||
        (content.summarySteps != null && content.summarySteps.length > 0) ||
        content.summaryTable != null ||
        content.summaryHighlight != null ? (
          <div className="mb-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 font-main text-sm leading-relaxed text-[var(--color-text)]">
            {content.summaryTitle != null && (
              <p className="mb-2 font-semibold text-[var(--color-text)]">
                {content.summaryTitle}
              </p>
            )}
            {content.summaryBody != null && (
              <p className="mb-4 text-[var(--color-text-muted)]">
                <SummaryBodyWithBold text={content.summaryBody} />
              </p>
            )}
            {content.summaryImage != null && (
              <div className="mb-4 overflow-hidden rounded-lg border border-[var(--glass-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.summaryImage}
                  alt="창업의 이해와 팀기반 창의활동 학습 참고 자료"
                  className="w-full object-contain"
                />
              </div>
            )}
            {content.summaryTable != null && (
              <div className="mb-4 overflow-hidden rounded-lg border border-[var(--glass-border)]">
                {content.summaryTable.title != null && (
                  <p className="border-b border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 font-semibold text-[var(--color-text)]">
                    {content.summaryTable.title}
                  </p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                        {content.summaryTable.columns.map((col) => (
                          <th
                            key={col.key}
                            className="px-3 py-2 font-semibold text-[var(--color-text)]"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {content.summaryTable.rows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-[var(--glass-border)] last:border-b-0"
                        >
                          {content.summaryTable!.columns.map((col) => (
                            <td
                              key={col.key}
                              className="px-3 py-2 text-[var(--color-text-muted)]"
                            >
                              {row[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {content.summaryHighlight != null && (
              <div className="mb-4 rounded-lg border-l-4 border-[var(--color-primary)] bg-[var(--glass-bg)] py-2 pl-3 pr-2">
                <p className="whitespace-pre-line text-[var(--color-text)]">
                  {content.summaryHighlight}
                </p>
              </div>
            )}
            {content.summarySteps != null && content.summarySteps.length > 0 && (
              <div className="mb-4">
                {content.summaryStepsTitle != null && (
                  <p className="mb-2 font-semibold text-[var(--color-text)]">
                    {content.summaryStepsTitle}
                  </p>
                )}
                <ol className="list-decimal space-y-2 pl-5 text-[var(--color-text-muted)]">
                  {content.summarySteps.map((step, i) => (
                    <li key={i} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
                {content.wbId === "WB 08" && (
                  <div className="mt-3">
                    <GanttChartExample />
                  </div>
                )}
                {content.wbId === "WB 09" && (
                  <div className="mt-3">
                    <BepChart />
                  </div>
                )}
              </div>
            )}
            {content.summaryChecklist != null && content.summaryChecklist.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 font-semibold text-[var(--color-text)]">
                  ✨ 생생한 페르소나 구성을 위한 체크리스트
                </p>
                <ul className="list-none space-y-2 text-[var(--color-text-muted)]">
                  {content.summaryChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden>
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.summaryClosing != null && (
              <p className="mt-2 border-t border-[var(--glass-border)] pt-3 text-[var(--color-text-muted)]">
                <SummaryBodyWithBold text={content.summaryClosing} />
              </p>
            )}
          </div>
        ) : null}
        <ul className="flex flex-col gap-4">
          {content.items.map((item, index) => {
            const itemClassName =
              "group flex items-start gap-4 rounded-xl bg-[var(--glass-bg)] p-4 transition-all hover:bg-[var(--glass-bg-hover)]";
            const inner = (
              <>
                <div
                  className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg px-1.5 text-white text-sm font-bold"
                  style={{ backgroundColor: chapterColor }}
                >
                  {item.badgeNumber ?? index + 1}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-main text-sm font-semibold leading-snug text-[var(--color-text)]">
                    {item.label}
                  </span>
                  <span className="font-main text-xs font-normal leading-relaxed text-[var(--color-text-muted)]">
                    {item.subtitle}
                  </span>
                  {item.description != null && item.description.length > 0 && (
                    <p className="mt-2 font-main text-xs leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line border-l-2 border-[var(--color-primary)] pl-3 py-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-subtle)] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[var(--color-text-muted)]" />
              </>
            );
            return (
              <li key={index}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`block ${itemClassName}`}
                    aria-label={`${item.label}: ${item.subtitle}`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className={itemClassName}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
