"use client";

const ROLES = [
  "CEO (대표)",
  "CMO (마케팅)",
  "CTO (기술)",
  "CFO (재무)",
  "CPO (제품)",
] as const;

type Priority = "red" | "yellow" | "green";

interface GanttTask {
  roleIndex: number;
  label: string;
  priority: Priority;
  startWeek: number;
  endWeek: number;
}

const WEEKS = 4;

/** WB 08 업무 우선순위 관리 코드에 따른 역할별 간트 차트 예시 (하드코딩) */
const GANTT_TASKS: GanttTask[] = [
  { roleIndex: 0, label: "목표 설정", priority: "red", startWeek: 1, endWeek: 1 },
  { roleIndex: 0, label: "방향 제시", priority: "yellow", startWeek: 2, endWeek: 3 },
  { roleIndex: 1, label: "마케팅 기획", priority: "red", startWeek: 1, endWeek: 2 },
  { roleIndex: 1, label: "고객 소통", priority: "green", startWeek: 3, endWeek: 4 },
  { roleIndex: 2, label: "기술 검토", priority: "yellow", startWeek: 1, endWeek: 1 },
  { roleIndex: 2, label: "제품 개발", priority: "red", startWeek: 2, endWeek: 4 },
  { roleIndex: 3, label: "예산 편성", priority: "red", startWeek: 1, endWeek: 2 },
  { roleIndex: 3, label: "자금 관리", priority: "yellow", startWeek: 3, endWeek: 4 },
  { roleIndex: 4, label: "서비스 기획", priority: "red", startWeek: 1, endWeek: 2 },
  { roleIndex: 4, label: "디자인", priority: "yellow", startWeek: 3, endWeek: 4 },
];

const PRIORITY_STYLES: Record<Priority, { bg: string; border: string; text: string }> = {
  red: {
    bg: "bg-red-500/25",
    border: "border-red-500",
    text: "text-red-600 dark:text-red-400",
  },
  yellow: {
    bg: "bg-amber-500/25",
    border: "border-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  green: {
    bg: "bg-emerald-500/25",
    border: "border-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
};

export function GanttChartExample() {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]">
      <div className="min-w-[420px] font-main text-sm">
        {/* 헤더: 주차 */}
        <div className="grid grid-cols-[100px_1fr] border-b border-[var(--glass-border)]">
          <div className="flex items-center justify-center border-r border-[var(--glass-border)] py-2 font-semibold text-[var(--color-text-muted)]">
            역할
          </div>
          <div
            className="grid gap-px border-[var(--glass-border)] py-2 pr-2"
            style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: WEEKS }, (_, i) => (
              <div
                key={i}
                className="text-center text-xs font-medium text-[var(--color-text-muted)]"
              >
                {i + 1}주차
              </div>
            ))}
          </div>
        </div>

        {/* 역할별 행 */}
        {ROLES.map((role, roleIndex) => {
          const tasks = GANTT_TASKS.filter((t) => t.roleIndex === roleIndex);
          return (
            <div
              key={roleIndex}
              className="grid grid-cols-[100px_1fr] border-b border-[var(--glass-border)] last:border-b-0"
            >
              <div className="border-r border-[var(--glass-border)] py-2 pl-2 text-xs font-medium text-[var(--color-text)]">
                {role}
              </div>
              <div
                className="grid gap-1 py-2 pr-2 pl-1"
                style={{
                  gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
                  gridTemplateRows: "minmax(32px, auto)",
                }}
              >
                {tasks.map((task, taskIdx) => {
                  const span = task.endWeek - task.startWeek + 1;
                  const startCol = task.startWeek;
                  const style = PRIORITY_STYLES[task.priority];
                  return (
                    <div
                      key={taskIdx}
                      className={`flex items-center justify-center rounded border px-1 py-1 text-[10px] font-medium ${style.bg} ${style.border} ${style.text}`}
                      style={{
                        gridColumn: `${startCol} / span ${span}`,
                        gridRow: "1",
                      }}
                    >
                      {task.label}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 border-t border-[var(--glass-border)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-red-500 bg-red-500/25" />
          Red: 최우선
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-amber-500 bg-amber-500/25" />
          Yellow: 여유
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-emerald-500 bg-emerald-500/25" />
          Green: 후순위
        </span>
      </div>
    </div>
  );
}
