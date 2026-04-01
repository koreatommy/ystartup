"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STATUS_LABELS } from "@/constants/member";
import type { Profile } from "@/types/member";
import { ChartGrid, ChartShell } from "../ChartShell";
import { CHART_RADIAL_TRACK, FALLBACK_CHART_HEX, chartColorAt } from "../chartTheme";

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
};

function profileCompletenessRadar(profile: Profile, hasCoach: boolean) {
  return [
    { axis: "연락처", score: profile.phone?.trim() ? 10 : 0 },
    { axis: "이메일", score: profile.email?.trim() ? 10 : 0 },
    { axis: "학교유형·명", score: profile.school_type && profile.school_name?.trim() ? 10 : 0 },
    { axis: "학년", score: profile.grade ? 10 : 0 },
    { axis: "담당 코치", score: hasCoach ? 10 : 0 },
  ];
}

function coachContactRadar(coach: Profile | null) {
  if (!coach) {
    return [
      { axis: "이름", score: 0 },
      { axis: "소속", score: 0 },
      { axis: "연락처", score: 0 },
      { axis: "이메일", score: 0 },
    ];
  }
  return [
    { axis: "이름", score: coach.name?.trim() ? 10 : 0 },
    { axis: "소속", score: coach.affiliation?.trim() ? 10 : 0 },
    { axis: "연락처", score: coach.phone?.trim() ? 10 : 0 },
    { axis: "이메일", score: coach.email?.trim() ? 10 : 0 },
  ];
}

export interface StudentMenuChartsProps {
  selected: string;
  profile: Profile;
  coach: Profile | null;
}

export function StudentMenuCharts({ selected, profile, coach }: StudentMenuChartsProps) {
  const hasCoach = !!coach;
  const completeness = profileCompletenessRadar(profile, hasCoach);

  switch (selected) {
    case "내 정보 요약":
    case "내 정보 조회":
      return (
        <ChartGrid>
          <ChartShell title="프로필 채움 정도" description="항목별로 등록된 정보가 있으면 만점입니다.">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={completeness} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="내 정보" dataKey="score" stroke={FALLBACK_CHART_HEX[0]} fill={FALLBACK_CHART_HEX[0]} fillOpacity={0.45} />
                <Tooltip cursor={false} contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${Number(v ?? 0)}/10`, "점수"]} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );

    case "담당 코치 정보":
      return (
        <ChartGrid>
          <ChartShell
            title="담당 코치 정보 항목"
            description="코치 프로필에 채워진 연락·소속 정보를 요약합니다."
            empty={!coach}
            emptyMessage="배정된 담당 코치가 없습니다."
          >
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={coachContactRadar(coach)} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="코치" dataKey="score" stroke={FALLBACK_CHART_HEX[1]} fill={FALLBACK_CHART_HEX[1]} fillOpacity={0.4} />
                <Tooltip cursor={false} contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${Number(v ?? 0)}/10`, "점수"]} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );

    case "계정 상태": {
      const isApproved = profile.status === "approved";
      const radialData = [{ name: "이용 가능", value: isApproved ? 100 : 0, fill: isApproved ? FALLBACK_CHART_HEX[1] : FALLBACK_CHART_HEX[4] }];
      const labelRows = [
        { name: STATUS_LABELS.approved, ok: profile.status === "approved" ? 1 : 0 },
        { name: "이용 제한(inactive 등)", ok: profile.status !== "approved" ? 1 : 0 },
      ];
      return (
        <ChartGrid>
          <ChartShell title="현재 계정 상태" description="승인된 계정은 로그인·이용이 가능합니다.">
            <ResponsiveContainer width="100%" height={240}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="58%" outerRadius="92%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={CHART_RADIAL_TRACK} dataKey="value" cornerRadius={6} />
                <Legend
                  formatter={() => `${STATUS_LABELS[profile.status]} · ${isApproved ? "정상" : "제한"}`}
                  wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip cursor={false} contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${Number(v ?? 0)}%`, isApproved ? "이용 가능도" : "상태"]} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="상태 요약" description="현재 프로필 상태와 비교 축입니다.">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={labelRows} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={0} angle={-8} textAnchor="end" height={52} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} domain={[0, 1]} />
                <Tooltip cursor={false} contentStyle={TOOLTIP_STYLE} formatter={(v) => [Number(v) === 1 ? "해당" : "-", ""]} />
                <Bar activeBar={false} dataKey="ok" radius={[6, 6, 0, 0]}>
                  {labelRows.map((row, i) => (
                    <Cell key={row.name} fill={row.ok ? chartColorAt(i) : "#334155"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "연락처/이메일 수정":
      return null;

    default:
      return null;
  }
}
