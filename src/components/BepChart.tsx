"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Legend,
} from "recharts";

/** 예시: 고정비 40, 단가 4, 단위당 변동비 2 → BEP Q=20, 금액=80 */
const FIXED = 40;
const PRICE = 4;
const VARIABLE_PER_UNIT = 2;
const BEP_Q = FIXED / (PRICE - VARIABLE_PER_UNIT);
const BEP_AMOUNT = PRICE * BEP_Q;
const MAX_Q = 40;

const CHART_DATA = Array.from({ length: MAX_Q + 1 }, (_, i) => {
  const q = i;
  return {
    q,
    tr: PRICE * q,
    tc: FIXED + VARIABLE_PER_UNIT * q,
    fixed: FIXED,
  };
});

const INTERPRETATIONS = {
  tr: "총수익 (T.R): 판매량이 늘수록 증가하는 직선입니다. 판매 단가 × 판매 수량으로 계산됩니다.",
  tc: "총비용 (T.C): 고정비에서 시작해 판매량에 따라 변동비가 더해져 올라가는 직선입니다.",
  fixed: "고정비 (F): 판매량과 관계없이 항상 일정한 비용입니다. 임대료, 인건비 등.",
  vc: "변동비 (VC): 판매량에 비례해 늘어나는 비용입니다. 총비용과 고정비 사이의 차이가 변동비입니다.",
  bep: "손익분기점 (BEP): 총수익과 총비용이 만나는 점입니다. 이 판매량 이상이어야 흑자입니다.",
};

type TooltipPayload = { name: string; value: number; dataKey: string }[];

interface BepTooltipProps {
  active?: boolean;
  payload?: TooltipPayload;
  label?: number;
}

function BepTooltip({ active, payload, label }: BepTooltipProps) {
  if (!active || !payload?.length || label == null) return null;

  const q = Number(label);
  const trEntry = payload.find((p) => p.dataKey === "tr");
  const tcEntry = payload.find((p) => p.dataKey === "tc");
  const tr = trEntry?.value ?? 0;
  const tc = tcEntry?.value ?? 0;
  const isBep = q === BEP_Q;
  const vc = tc - FIXED;

  const getInterpretation = () => {
    if (isBep) return INTERPRETATIONS.bep;
    if (q === 0)
      return (
        <>
          {INTERPRETATIONS.fixed}
          <br />
          <span className="mt-1 block text-[var(--color-text-muted)]">
            총비용 직선이 Y축에서 시작하는 값이 고정비입니다.
          </span>
        </>
      );
    if (trEntry && tcEntry)
      return (
        <>
          {tr > tc
            ? "이 구간에서는 총수익이 총비용보다 커서 흑자입니다."
            : "이 구간에서는 총비용이 총수익보다 커서 적자입니다."}
          {q > 0 && tc > FIXED && (
            <>
              <br />
              <span className="mt-1 block text-[var(--color-text-muted)]">
                변동비(VC) = {vc}만 원 (총비용 − 고정비)
              </span>
            </>
          )}
        </>
      );
    if (trEntry) return INTERPRETATIONS.tr;
    if (tcEntry) return INTERPRETATIONS.tc;
    return null;
  };

  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 font-main text-sm shadow-lg">
      <p className="mb-2 font-semibold text-[var(--color-text)]">
        판매량 (Q) = {q}
      </p>
      <ul className="mb-2 space-y-1 text-[var(--color-text-muted)]">
        <li className="flex gap-2">
          <span className="text-blue-600 dark:text-blue-400">총수익 (T.R):</span>
          <span>{tr}만 원</span>
        </li>
        <li className="flex gap-2">
          <span className="text-red-600 dark:text-red-400">총비용 (T.C):</span>
          <span>{tc}만 원</span>
        </li>
        {q > 0 && tc > 0 && (
          <li className="flex gap-2 text-[10px]">
            <span className="text-amber-600 dark:text-amber-400">
              변동비 (VC):
            </span>
            <span>{vc}만 원</span>
          </li>
        )}
      </ul>
      <div className="border-t border-[var(--glass-border)] pt-2">
        <p className="text-xs font-medium leading-relaxed text-[var(--color-text)]">
          {getInterpretation()}
        </p>
      </div>
    </div>
  );
}

export function BepChart() {
  return (
    <div className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3">
      <p className="mb-2 text-center text-xs font-medium text-[var(--color-text-muted)]">
        💡 차트 위에 마우스를 올리면 해석이 표시됩니다
      </p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={CHART_DATA}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--glass-border)"
              vertical={false}
            />
            <XAxis
              dataKey="q"
              type="number"
              domain={[0, MAX_Q]}
              tickFormatter={(v) => `${v}`}
              stroke="var(--color-text-muted)"
              tick={{ fontSize: 11 }}
              label={{
                value: "판매량 (Q)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 11, fill: "var(--color-text-muted)" },
              }}
            />
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(v) => `${v}`}
              stroke="var(--color-text-muted)"
              tick={{ fontSize: 11 }}
              label={{
                value: "금액",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "var(--color-text-muted)" },
              }}
            />
            <Tooltip
              content={<BepTooltip />}
              cursor={{ stroke: "var(--color-text-subtle)", strokeDasharray: "4 4" }}
              formatter={(value: number) => [`${value}만 원`, ""]}
            />
            <ReferenceLine
              y={FIXED}
              stroke="var(--color-text-muted)"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="tr"
              name="총수익 (T.R)"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="tc"
              name="총비용 (T.C)"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={BEP_Q}
              y={BEP_AMOUNT}
              r={6}
              fill="#ef4444"
              stroke="var(--color-text)"
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => (
                <span style={{ color: "var(--color-text-muted)" }}>{value}</span>
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex flex-wrap justify-center gap-3 text-[10px] text-[var(--color-text-muted)]">
        <span>고정비 (F): 가로 점선</span>
        <span>·</span>
        <span>빨간 점: 손익분기점 (BEP)</span>
      </div>
    </div>
  );
}
