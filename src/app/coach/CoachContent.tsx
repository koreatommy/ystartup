"use client";

import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, StatCard, InfoCard, DataTable, FormCard, PasswordChangeSection } from "@/components/member";
import { STATUS_LABELS } from "@/constants/member";
import { getMyStudents, updateMyProfile } from "@/lib/actions/members";
import { cn, formatProfileJoinedDate } from "@/lib/utils";
import type { Profile } from "@/types/member";
import { CoachMenuCharts } from "@/components/member/charts/coach/CoachMenuCharts";
import { CoachPadletUrlsSection } from "./CoachPadletUrlsSection";

const COACH_LIST_PAGE_SIZE = 10;

interface Props {
  selected: string;
  onSelect: (s: string) => void;
  profile: Profile;
}

export function CoachContent({ selected, onSelect, profile }: Props) {
  const router = useRouter();
  const [students, setStudents] = useState<Profile[]>([]);
  const [overviewPage, setOverviewPage] = useState(1);
  const [assignedListPage, setAssignedListPage] = useState(1);
  const [recentSignupPage, setRecentSignupPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    affiliation: profile.affiliation || "",
    phone: profile.phone,
    email: profile.email,
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setEditForm({
      affiliation: profile.affiliation || "",
      phone: profile.phone,
      email: profile.email,
    });
  }, [profile.affiliation, profile.phone, profile.email]);

  useEffect(() => {
    getMyStudents().then(setStudents);
  }, []);

  useEffect(() => {
    if (selected !== "담당 학생 조회") return;
    if (students.length === 0) {
      setSelectedStudentId(null);
      return;
    }
    setSelectedStudentId((prev) => {
      if (prev && students.some((s) => s.id === prev)) return prev;
      return students[0].id;
    });
  }, [selected, students]);

  useLayoutEffect(() => {
    setOverviewPage(1);
    setAssignedListPage(1);
    setRecentSignupPage(1);
  }, [selected]);

  async function handleSave() {
    setSaveMessage(null);
    setSaving(true);
    const res = await updateMyProfile(editForm);
    setSaving(false);
    if ("error" in res && res.error) {
      setSaveMessage(res.error);
      return;
    }
    setSaveMessage("정보가 저장되었습니다.");
    router.refresh();
  }

  const recentStudentsTop5 = students.slice(0, 5);
  const middleSchool = students.filter((s) => s.school_type === "중학교").length;
  const highSchool = students.filter((s) => s.school_type === "고등학교").length;

  const overviewPaged = useMemo(() => {
    const total = students.length;
    const start = (overviewPage - 1) * COACH_LIST_PAGE_SIZE;
    return {
      rows: students.slice(start, start + COACH_LIST_PAGE_SIZE),
      total,
    };
  }, [students, overviewPage]);

  const assignedListPaged = useMemo(() => {
    const total = students.length;
    const start = (assignedListPage - 1) * COACH_LIST_PAGE_SIZE;
    return {
      rows: students.slice(start, start + COACH_LIST_PAGE_SIZE),
      total,
    };
  }, [students, assignedListPage]);

  const recentSignupPaged = useMemo(() => {
    const total = students.length;
    const start = (recentSignupPage - 1) * COACH_LIST_PAGE_SIZE;
    return {
      rows: students.slice(start, start + COACH_LIST_PAGE_SIZE),
      total,
    };
  }, [students, recentSignupPage]);

  const selectedStudent = useMemo(
    () => (selectedStudentId ? students.find((s) => s.id === selectedStudentId) ?? null : null),
    [students, selectedStudentId],
  );

  const noCoachChart =
    selected === "내 정보 조회" || selected === "내 정보 수정" || selected === "Padlet 주소 관리";

  const coachAnalytics = noCoachChart ? null : (
    <div className="mt-6">
      <CoachMenuCharts
        selected={selected}
        students={students}
        pagedStudents={selected === "최근 등록 학생" ? recentSignupPaged.rows : undefined}
      />
    </div>
  );

  const contentMap: Record<string, React.ReactNode> = {
    "내 정보 요약": (
      <>
        <SectionHeader badge="Coach Workspace" title="코치 전용 화면" description="담당 학생 조회와 본인 정보 관리만 가능합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="이름" value={profile.name} hint="coach 계정" />
          <StatCard label="상태" value={STATUS_LABELS[profile.status]} hint="정상 이용 가능" />
          <StatCard label="소속" value={profile.affiliation || "-"} hint="수정 가능" />
          <StatCard label="담당 학생 수" value={String(students.length)} hint="현재 배정 기준" />
        </div>
        {coachAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <InfoCard
            title="내 정보 요약"
            rows={[
              { label: "이름", value: profile.name },
              { label: "소속", value: profile.affiliation || "-" },
              { label: "연락처", value: profile.phone },
              { label: "이메일", value: profile.email },
              { label: "가입일", value: formatProfileJoinedDate(profile.created_at) },
            ]}
            actionLabel="내 정보 수정"
            onAction={() => onSelect("내 정보 수정")}
          />
          <InfoCard
            title="권한 범위"
            rows={[
              { label: "조회 가능", value: "본인 + 담당 학생" },
              { label: "수정 가능", value: "소속 / 연락처 / 이메일 / 비밀번호" },
              { label: "수정 불가", value: "학생 정보 / 상태값" },
            ]}
          />
        </div>
      </>
    ),

    "담당 학생 현황": (
      <>
        <SectionHeader badge="Student Overview" title="담당 학생 현황" description="현재 담당하고 있는 학생 현황입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="담당 학생" value={String(students.length)} hint="현재 배정" />
          <StatCard label="중학생" value={String(middleSchool)} hint="중학교 소속" />
          <StatCard label="고등학생" value={String(highSchool)} hint="고등학교 소속" />
          <StatCard label="최근 등록" value={String(recentStudentsTop5.length)} hint="최근 가입(상위 5명)" />
        </div>
        {coachAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <DataTable
            title="담당 학생 현황"
            headers={["가입일", "이름", "학교", "학년", "상태"]}
            rows={overviewPaged.rows.map((s) => [
              formatProfileJoinedDate(s.created_at),
              s.name,
              s.school_name || "-",
              s.grade || "-",
              STATUS_LABELS[s.status],
            ])}
            pagination={{
              page: overviewPage,
              pageSize: COACH_LIST_PAGE_SIZE,
              totalCount: overviewPaged.total,
              onPageChange: setOverviewPage,
            }}
          />
          <InfoCard
            title="조회 원칙"
            rows={[
              { label: "조회 범위", value: "담당 학생만 가능" },
              { label: "상세 조회", value: "가능" },
              { label: "학생 수정/삭제", value: "불가" },
            ]}
          />
        </div>
      </>
    ),

    "최근 등록 학생": (
      <>
        <SectionHeader badge="Recent Students" title="최근 등록 학생" description="최근 배정된 학생 목록입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="최근 가입" value={String(recentStudentsTop5.length)} hint="상위 5명 기준" />
          <StatCard label="전체 담당" value={String(students.length)} hint="내 담당 학생 기준" />
          <StatCard label="조회 가능 범위" value="담당 학생만" hint="RLS 적용" />
          <StatCard label="최신 등록" value={recentStudentsTop5[0]?.name || "-"} hint="student 계정" />
        </div>
        {coachAnalytics}
        <DataTable
          title="최근 등록 학생"
          headers={["가입일", "이름", "학교", "학년"]}
          rows={recentSignupPaged.rows.map((s) => [
            formatProfileJoinedDate(s.created_at),
            s.name,
            s.school_name || "-",
            s.grade || "-",
          ])}
          pagination={{
            page: recentSignupPage,
            pageSize: COACH_LIST_PAGE_SIZE,
            totalCount: recentSignupPaged.total,
            onPageChange: setRecentSignupPage,
          }}
        />
      </>
    ),

    "담당 학생 조회": (
      <>
        <SectionHeader
          badge="Student List"
          title="담당 학생 조회"
          description="목록에서 학생을 선택하면 상세 정보를 함께 확인할 수 있습니다."
          selected={selected}
        />
        {students.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="전체 담당" value={String(students.length)} hint="페이지네이션 가능" />
              <StatCard label="학교 수" value={String(new Set(students.map((s) => s.school_name)).size)} hint="담당 학생 분포" />
              <StatCard label="선택 학생" value={selectedStudent?.name ?? "-"} hint="목록에서 선택" />
              <StatCard
                label="계정 상태"
                value={selectedStudent ? STATUS_LABELS[selectedStudent.status] : "-"}
                hint="선택 학생"
              />
            </div>
            {coachAnalytics}
            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <DataTable
                title="담당 학생 목록"
                headers={["가입일", "이름", "학교", "학년", "연락처", "이메일"]}
                rows={assignedListPaged.rows.map((s) => [
                  formatProfileJoinedDate(s.created_at),
                  s.name,
                  s.school_name || "-",
                  s.grade || "-",
                  s.phone,
                  s.email,
                ])}
                selectedRowIndex={assignedListPaged.rows.findIndex((s) => s.id === selectedStudentId)}
                onRowClick={(rowIndex) => {
                  const row = assignedListPaged.rows[rowIndex];
                  if (row) setSelectedStudentId(row.id);
                }}
                pagination={{
                  page: assignedListPage,
                  pageSize: COACH_LIST_PAGE_SIZE,
                  totalCount: assignedListPaged.total,
                  onPageChange: setAssignedListPage,
                }}
              />
              {selectedStudent ? (
                <div className="space-y-6">
                  <InfoCard
                    title="학생 상세 정보"
                    rows={[
                      { label: "가입일", value: formatProfileJoinedDate(selectedStudent.created_at) },
                      { label: "이름", value: selectedStudent.name },
                      { label: "연락처", value: selectedStudent.phone },
                      { label: "이메일", value: selectedStudent.email },
                      { label: "학교유형", value: selectedStudent.school_type || "-" },
                      { label: "학교명", value: selectedStudent.school_name || "-" },
                      { label: "학년", value: selectedStudent.grade || "-" },
                      { label: "담당 코치", value: profile.name },
                    ]}
                  />
                  <InfoCard
                    title="조회·표시 규칙"
                    rows={[
                      { label: "열람 가능", value: "담당 학생만" },
                      { label: "표시 항목", value: "학교 / 학년 / 연락처 / 이메일" },
                      { label: "변경 가능 여부", value: "불가" },
                      { label: "코치 변경 요청", value: "관리자 처리 대상" },
                    ]}
                  />
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-8 text-center text-[var(--color-text-muted)]">
            담당 학생이 없습니다.
          </div>
        )}
      </>
    ),

    "내 정보 조회": (
      <>
        <SectionHeader badge="My Info" title="내 정보 조회" description="코치 계정 정보를 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="역할" value="코치" hint="coach 계정" />
          <StatCard label="상태" value={STATUS_LABELS[profile.status]} hint="정상 이용 가능" />
          <StatCard label="수정 가능" value="4개 항목" hint="소속 / 연락처 / 이메일 / 비밀번호" />
          <StatCard label="학생 수정" value="불가" hint="조회만 가능" />
        </div>
        {coachAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <InfoCard
            title="내 정보"
            rows={[
              { label: "이름", value: profile.name },
              { label: "소속", value: profile.affiliation || "-" },
              { label: "연락처", value: profile.phone },
              { label: "이메일", value: profile.email },
              { label: "상태", value: STATUS_LABELS[profile.status] },
            ]}
            actionLabel="수정 화면 이동"
            onAction={() => onSelect("내 정보 수정")}
          />
          <InfoCard
            title="정책 요약"
            rows={[
              { label: "role 변경", value: "불가" },
              { label: "status 변경", value: "불가" },
              { label: "학생 정보 수정", value: "불가" },
            ]}
          />
        </div>
      </>
    ),

    "내 정보 수정": (
      <>
        <SectionHeader badge="Edit Profile" title="내 정보 수정" description="수정 가능한 항목만 수정할 수 있습니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="수정 가능" value="소속" hint="affiliation" />
          <StatCard label="수정 가능" value="연락처" hint="phone" />
          <StatCard label="수정 가능" value="이메일" hint="email" />
          <StatCard label="수정 불가" value="이름/역할/상태" hint="정책 고정" />
        </div>
        {coachAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <FormCard
              title="내 정보 수정"
              submitLabel="변경 저장"
              onSubmit={() => void handleSave()}
              loading={saving}
              fields={[
                { label: "이름", value: profile.name, disabled: true },
                { label: "소속", value: editForm.affiliation, onChange: (v) => setEditForm((p) => ({ ...p, affiliation: v })) },
                { label: "연락처", value: editForm.phone, onChange: (v) => setEditForm((p) => ({ ...p, phone: v })) },
                { label: "이메일", value: editForm.email, onChange: (v) => setEditForm((p) => ({ ...p, email: v })) },
                { label: "역할", value: "coach", disabled: true },
                { label: "상태", value: STATUS_LABELS[profile.status], disabled: true },
              ]}
            />
            {saveMessage ? (
              <p
                className={cn(
                  "text-sm",
                  saveMessage === "정보가 저장되었습니다." ? "text-emerald-500" : "text-red-400",
                )}
              >
                {saveMessage}
              </p>
            ) : null}
            <PasswordChangeSection />
          </div>
          <InfoCard
            title="입력 검증"
            rows={[
              { label: "연락처 형식", value: "000-0000-0000" },
              { label: "이메일 형식", value: "유효성 검증 필수" },
              { label: "중복 검토", value: "이메일 기준 확인" },
            ]}
          />
        </div>
      </>
    ),

    "Padlet 주소 관리": (
      <CoachPadletUrlsSection profile={profile} selected={selected} analyticsSlot={coachAnalytics} />
    ),
  };

  return contentMap[selected] || <div className="text-[var(--color-text-muted)]">메뉴를 선택해주세요.</div>;
}
