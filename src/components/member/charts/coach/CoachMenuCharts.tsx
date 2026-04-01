"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Profile } from "@/types/member";
import { ChartGrid, ChartShell } from "../ChartShell";
import { chartColorAt, FALLBACK_CHART_HEX, pieSliceLabel } from "../chartTheme";

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
};

function CountTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 shadow-lg">
      <span className="text-slate-200">{p?.name}</span>
      <span className="ml-2 font-medium text-white">{p?.value ?? 0}명</span>
    </div>
  );
}

function schoolDistribution(students: Profile[], topN: number) {
  const map = new Map<string, number>();
  for (const s of students) {
    const key = s.school_name?.trim() || "학교 미입력";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN).reduce((acc, [, n]) => acc + n, 0);
  const rows = top.map(([name, count]) => ({
    name: name.length > 10 ? `${name.slice(0, 9)}…` : name,
    fullName: name,
    count,
  }));
  if (rest > 0) {
    rows.push({ name: "기타", fullName: "기타 학교 합계", count: rest });
  }
  return rows;
}

function gradeDistribution(rows: Profile[]) {
  const map = new Map<string, number>();
  for (const s of rows) {
    const g = s.grade?.trim() || "학년 미입력";
    map.set(g, (map.get(g) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

export interface CoachMenuChartsProps {
  selected: string;
  students: Profile[];
  /** 담당 학생 조회 등에서 현재 페이지에 보이는 행 */
  pagedStudents?: Profile[];
}

export function CoachMenuCharts({ selected, students, pagedStudents }: CoachMenuChartsProps) {
  const middle = students.filter((s) => s.school_type === "중학교").length;
  const high = students.filter((s) => s.school_type === "고등학교").length;
  const otherType = Math.max(0, students.length - middle - high);
  const schoolBars = useMemo(() => schoolDistribution(students, 8), [students]);
  const pageRows = pagedStudents ?? students;

  switch (selected) {
    case "내 정보 요약": {
      const typeData = [
        { name: "중학교", value: middle },
        { name: "고등학교", value: high },
        ...(otherType > 0 ? [{ name: "기타/미입력", value: otherType }] : []),
      ].filter((d) => d.value > 0);
      return (
        <ChartGrid>
          <ChartShell title="담당 학생 학교급 분포" description="학교 유형 기준 담당 학생 비율입니다." empty={students.length === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  label={pieSliceLabel}
                >
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<CountTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "담당 학생 현황":
      return (
        <ChartGrid>
          <ChartShell title="학교별 담당 학생 수" description="상위 학교와 기타 합계입니다." empty={students.length === 0}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={schoolBars} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={96} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { fullName?: string; count?: number };
                    return (
                      <div style={TOOLTIP_STYLE} className="px-3 py-2 shadow-lg">
                        <div className="text-slate-200">{row.fullName}</div>
                        <div className="font-medium text-white">{row.count ?? 0}명</div>
                      </div>
                    );
                  }}
                />
                <Bar activeBar={false} dataKey="count" radius={[0, 6, 6, 0]}>
                  {schoolBars.map((_, i) => (
                    <Cell key={i} fill={FALLBACK_CHART_HEX[i % FALLBACK_CHART_HEX.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );

    case "최근 등록 학생": {
      const grades = gradeDistribution(pageRows);
      return (
        <ChartGrid>
          <ChartShell title="현재 목록 학년 분포" description="이 페이지에 표시된 담당 학생의 학년 구성입니다." empty={pageRows.length === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={grades} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<CountTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {grades.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "담당 학생 조회":
      return (
        <ChartGrid>
          <ChartShell title="전체 담당 학교 분포 요약" description="모든 담당 학생 기준 학교별 인원입니다." empty={students.length === 0}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={schoolBars} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={96} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { fullName?: string; count?: number };
                    return (
                      <div style={TOOLTIP_STYLE} className="px-3 py-2 shadow-lg">
                        <div className="text-slate-200">{row.fullName}</div>
                        <div className="font-medium text-white">{row.count ?? 0}명</div>
                      </div>
                    );
                  }}
                />
                <Bar activeBar={false} dataKey="count" radius={[0, 6, 6, 0]}>
                  {schoolBars.map((_, i) => (
                    <Cell key={i} fill={FALLBACK_CHART_HEX[i % FALLBACK_CHART_HEX.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );

    case "내 정보 조회":
    case "내 정보 수정":
      return (
        <ChartGrid>
          <ChartShell title="담당 학생 수" description="현재 배정된 담당 학생입니다.">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{ name: "담당 학생", value: students.length }]} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<CountTooltip />} />
                <Bar
                  activeBar={false}
                  dataKey="value"
                  fill={FALLBACK_CHART_HEX[0]}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={72}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );

    default:
      return null;
  }
}
