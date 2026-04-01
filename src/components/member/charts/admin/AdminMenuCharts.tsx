"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SCHOOLS, type SchoolType } from "@/constants/member";
import type { AdminDashboardStats } from "@/types/member";
import { ChartGrid, ChartShell } from "../ChartShell";
import { chartColorAt, FALLBACK_CHART_HEX, pieSliceLabel } from "../chartTheme";

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
};

function MemberTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: { name?: string } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = p?.name ?? p?.payload?.name ?? label ?? "";
  const value = p?.value ?? 0;
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 shadow-lg">
      <span className="text-slate-200">{name}</span>
      <span className="ml-2 font-medium text-white">{value}명</span>
    </div>
  );
}

function countRejectedTotal(stats: AdminDashboardStats): number {
  return Math.max(0, stats.total - stats.approvedProfiles - stats.pendingProfiles - stats.inactive);
}

function schoolStudentRows(schoolCounts: Record<string, number>) {
  const rows: { name: string; fullName: string; count: number; type: SchoolType }[] = [];
  (["중학교", "고등학교"] as SchoolType[]).forEach((type) => {
    SCHOOLS[type].forEach((fullName) => {
      rows.push({
        name: fullName.length > 8 ? `${fullName.slice(0, 7)}…` : fullName,
        fullName,
        count: schoolCounts[fullName] ?? 0,
        type,
      });
    });
  });
  return rows.sort((a, b) => b.count - a.count);
}

function sumSchoolType(schoolCounts: Record<string, number>, type: SchoolType): number {
  return SCHOOLS[type].reduce((acc, name) => acc + (schoolCounts[name] ?? 0), 0);
}

const PERMISSION_RADAR = [
  { axis: "회원 조회", super_admin: 10, coach: 4, student: 3 },
  { axis: "회원 수정", super_admin: 10, coach: 2, student: 2 },
  { axis: "승인/배정", super_admin: 10, coach: 1, student: 1 },
  { axis: "학교·기준정보", super_admin: 10, coach: 1, student: 1 },
];

export interface AdminMenuChartsProps {
  selected: string;
  stats: AdminDashboardStats;
  schoolCounts: Record<string, number>;
  adminCount: number;
}

export function AdminMenuCharts({ selected, stats, schoolCounts, adminCount }: AdminMenuChartsProps) {
  const rejectedTotal = countRejectedTotal(stats);
  const hasAnyMember = stats.total > 0;

  switch (selected) {
    case "운영 현황": {
      const roleData = [
        { name: "학생", value: stats.students },
        { name: "코치", value: stats.coaches },
        { name: "관리자", value: adminCount },
      ].filter((d) => d.value > 0);
      const coachStatusData = [
        { name: "승인", value: stats.coachApproved },
        { name: "승인 대기", value: stats.coachPending },
        { name: "반려", value: stats.coachRejected },
        { name: "비활성", value: stats.coachInactive },
      ];
      return (
        <ChartGrid>
          <ChartShell title="역할별 회원 비율" description="전체 프로필 기준 역할 분포입니다." empty={roleData.length === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={88} label={pieSliceLabel}>
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="코치 계정 상태" description="코치 역할 프로필의 상태 분포입니다.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={coachStatusData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" name="인원" radius={[6, 6, 0, 0]}>
                  {coachStatusData.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "승인 대기 현황": {
      const coachPipeline = [
        { name: "승인", value: stats.coachApproved },
        { name: "대기", value: stats.coachPending },
        { name: "반려", value: stats.coachRejected },
        { name: "비활성", value: stats.coachInactive },
      ];
      const waitApprovePieData = [
        { name: "승인 대기", value: stats.pending },
        { name: "승인 완료", value: stats.coachApproved },
        { name: "기타 상태", value: Math.max(0, stats.coaches - stats.pending - stats.coachApproved) },
      ].filter((d) => d.value > 0);
      return (
        <ChartGrid>
          <ChartShell title="코치 승인 파이프라인" description="코치 프로필 상태별 인원입니다.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={coachPipeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {coachPipeline.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="대기 vs 승인 코치" description="승인 대기 코치와 승인 완료 코치 비교입니다." empty={stats.coaches === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={waitApprovePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={88}
                  label={pieSliceLabel}
                >
                  {waitApprovePieData.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "최근 가입자": {
      const roleSnap = [
        { name: "학생", value: stats.students },
        { name: "코치", value: stats.coaches },
        { name: "관리자", value: adminCount },
      ];
      return (
        <ChartGrid>
          <ChartShell title="역할별 등록 규모" description="현재 시점 기준 역할별 회원 수입니다." empty={!hasAnyMember}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={roleSnap} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {roleSnap.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "전체 회원 목록": {
      const statusData = [
        { name: "승인", value: stats.approvedProfiles },
        { name: "승인 대기", value: stats.pendingProfiles },
        { name: "비활성", value: stats.inactive },
        { name: "반려", value: rejectedTotal },
      ];
      return (
        <ChartGrid>
          <ChartShell title="전체 상태 분포" description="모든 역할 프로필의 상태별 인원입니다.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="상태 비율" description="동일 데이터의 구성 비율입니다." empty={!hasAnyMember}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={88}
                  label={pieSliceLabel}
                >
                  {statusData
                    .filter((d) => d.value > 0)
                    .map((_, i) => (
                      <Cell key={i} fill={chartColorAt(i)} />
                    ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "코치 목록": {
      const coachDist = [
        { name: "승인", value: stats.coachApproved },
        { name: "대기", value: stats.coachPending },
        { name: "반려", value: stats.coachRejected },
        { name: "비활성", value: stats.coachInactive },
      ];
      return (
        <ChartGrid>
          <ChartShell title="코치 상태 분포" description="등록된 코치 프로필 상태입니다." empty={stats.coaches === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={coachDist.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  label={pieSliceLabel}
                >
                  {coachDist
                    .filter((d) => d.value > 0)
                    .map((_, i) => (
                      <Cell key={i} fill={chartColorAt(i)} />
                    ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "학생 목록": {
      const schoolTypeData = [
        { name: "중학교", value: stats.studentsMiddleSchool },
        { name: "고등학교", value: stats.studentsHighSchool },
      ];
      const assignData = [
        { name: "코치 배정됨", value: stats.studentsWithCoach },
        { name: "미배정", value: stats.studentsWithoutCoach },
      ];
      return (
        <ChartGrid>
          <ChartShell title="학교급 분포" description="학생 프로필의 학교 유형별 인원입니다." empty={stats.students === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={schoolTypeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {schoolTypeData.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="코치 배정 현황" description="학생 기준 배정 여부입니다." empty={stats.students === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={assignData.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={88}
                  label={pieSliceLabel}
                >
                  {assignData
                    .filter((d) => d.value > 0)
                    .map((_, i) => (
                      <Cell key={i} fill={chartColorAt(i)} />
                    ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "회원 정보 관리": {
      const roleMix = [
        { name: "코치", value: stats.coaches },
        { name: "학생", value: stats.students },
      ].filter((d) => d.value > 0);
      return (
        <ChartGrid>
          <ChartShell title="코치 vs 학생" description="관리 대상 역할 비중입니다." empty={roleMix.length === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={roleMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={88} label={pieSliceLabel}>
                  {roleMix.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "코치 승인 관리": {
      const donut = [
        { name: "승인 대기", value: stats.pending },
        { name: "승인 완료", value: stats.coachApproved },
        { name: "반려·비활성 등", value: Math.max(0, stats.coaches - stats.pending - stats.coachApproved) },
      ].filter((d) => d.value > 0);
      return (
        <ChartGrid>
          <ChartShell title="코치 처리 현황" description="전체 코치 중 대기·승인·기타 비중입니다." empty={stats.coaches === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={donut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={56} outerRadius={88} label={pieSliceLabel}>
                  {donut.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "학생-코치 배정 관리": {
      const assign = [
        { name: "배정 완료", value: stats.studentsWithCoach },
        { name: "미배정", value: stats.studentsWithoutCoach },
      ];
      return (
        <ChartGrid>
          <ChartShell title="학생 배정 요약" description="전체 학생 기준 코치 배정 여부입니다." empty={stats.students === 0}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={assign} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {assign.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "학교별 배정 현황":
    case "학교 목록 관리": {
      const rows = schoolStudentRows(schoolCounts);
      const hasSchoolData = rows.some((r) => r.count > 0);
      const typeSum = [
        { name: "중학교 소속 학생", value: sumSchoolType(schoolCounts, "중학교") },
        { name: "고등학교 소속 학생", value: sumSchoolType(schoolCounts, "고등학교") },
      ];
      return (
        <ChartGrid>
          <ChartShell
            title="학교별 학생 수"
            description="등록 학생이 있는 학교 순입니다."
            empty={!hasSchoolData}
            emptyMessage="학교별 학생 데이터가 없습니다. 해당 메뉴를 열면 집계가 로드됩니다."
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={rows.slice(0, 16)} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#94a3b8", fontSize: 10 }} />
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
                <Bar activeBar={false} dataKey="count" name="학생 수" radius={[0, 6, 6, 0]}>
                  {rows.slice(0, 16).map((entry) => (
                    <Cell key={entry.fullName} fill={entry.type === "중학교" ? FALLBACK_CHART_HEX[0] : FALLBACK_CHART_HEX[1]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="학교급별 학생 합계" description="중·고등학교 소속 학생 수 합계입니다." empty={!hasSchoolData}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeSum} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={56} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill={FALLBACK_CHART_HEX[0]} />
                  <Cell fill={FALLBACK_CHART_HEX[1]} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "상태값 관리": {
      const statusBars = [
        { name: "승인", value: stats.approvedProfiles },
        { name: "대기", value: stats.pendingProfiles },
        { name: "비활성", value: stats.inactive },
        { name: "반려", value: rejectedTotal },
      ];
      return (
        <ChartGrid>
          <ChartShell title="상태별 프로필 수" description="전체 프로필의 상태 분포입니다.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={false} content={<MemberTooltip />} />
                <Bar activeBar={false} dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusBars.map((_, i) => (
                    <Cell key={i} fill={chartColorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    case "내 정보 확인":
    case "권한 정책 확인": {
      return (
        <ChartGrid>
          <ChartShell title="역할별 권한 범위(교육용 지표)" description="상대 점수로 조회·수정·운영 권한을 비교합니다. 실제 정책은 표와 RLS를 따릅니다.">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={PERMISSION_RADAR} cx="50%" cy="50%" outerRadius="78%">
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 9 }} />
                <Radar name="슈퍼관리자" dataKey="super_admin" stroke={FALLBACK_CHART_HEX[0]} fill={FALLBACK_CHART_HEX[0]} fillOpacity={0.35} />
                <Radar name="코치" dataKey="coach" stroke={FALLBACK_CHART_HEX[1]} fill={FALLBACK_CHART_HEX[1]} fillOpacity={0.25} />
                <Radar name="학생" dataKey="student" stroke={FALLBACK_CHART_HEX[2]} fill={FALLBACK_CHART_HEX[2]} fillOpacity={0.2} />
                <Legend />
                <Tooltip cursor={false} contentStyle={TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartShell>
        </ChartGrid>
      );
    }

    default:
      return null;
  }
}
