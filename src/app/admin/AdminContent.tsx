"use client";

import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  SectionHeader,
  StatCard,
  InfoCard,
  DataTable,
  FormCard,
  AdminMemberProfileEditor,
  AdminMemosSection,
} from "@/components/member";
import { SCHOOLS, STATUS_LABELS, ROLE_LABELS, STATUSES } from "@/constants/member";
import type { MemberStatus } from "@/constants/member";
import {
  getAdminStats,
  updateMemberStatus,
  updateProfile,
  listProfilesPaged,
  listCoachIdNames,
  listApprovedCoachIdNames,
  getStudentSchoolCounts,
  getSchoolCoachAssignments,
} from "@/lib/actions/members";
import type { Profile, PagedResult, AdminDashboardStats, ProfileUpdatePayload } from "@/types/member";
import { formatProfileJoinedDate } from "@/lib/utils";
import { AdminMenuCharts } from "@/components/member/charts/admin/AdminMenuCharts";

interface Props {
  selected: string;
  onSelect: (s: string) => void;
  profile: Profile;
}

const PAGE_SIZE = 10;
const DASH_RECENT_SIZE = 5;

const emptyPaged = (): PagedResult<Profile> => ({
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
});

const defaultStats: AdminDashboardStats = {
  total: 0,
  students: 0,
  coaches: 0,
  pending: 0,
  inactive: 0,
  approvedProfiles: 0,
  pendingProfiles: 0,
  coachApproved: 0,
  coachPending: 0,
  coachRejected: 0,
  coachInactive: 0,
  studentsMiddleSchool: 0,
  studentsHighSchool: 0,
  studentsWithCoach: 0,
  studentsWithoutCoach: 0,
};

export function AdminContent({ selected, onSelect, profile }: Props) {
  const [stats, setStats] = useState<AdminDashboardStats>(defaultStats);
  const [dashRecent, setDashRecent] = useState<Profile[]>([]);
  const [recentPaged, setRecentPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [allMembersPaged, setAllMembersPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [coachesPaged, setCoachesPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [studentsPaged, setStudentsPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [pendingPaged, setPendingPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [coachApprovalPaged, setCoachApprovalPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [coachApprovalPage, setCoachApprovalPage] = useState(1);
  const [coachApprovalSearchKeyword, setCoachApprovalSearchKeyword] = useState("");
  const [coachApprovalListVersion, setCoachApprovalListVersion] = useState(0);
  const [coachApprovalStatusUpdatingId, setCoachApprovalStatusUpdatingId] = useState<string | null>(null);
  const [assignmentCoachesPaged, setAssignmentCoachesPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [assignmentStudentsPaged, setAssignmentStudentsPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [assignmentDetailMode, setAssignmentDetailMode] = useState<"idle" | "coach" | "unassigned">("idle");
  const [assignmentSelectedCoachId, setAssignmentSelectedCoachId] = useState<string | null>(null);
  const [assignmentSelectedCoachLabel, setAssignmentSelectedCoachLabel] = useState<string | null>(null);
  const [assignmentCoachOptions, setAssignmentCoachOptions] = useState<{ id: string; name: string }[]>([]);
  const [assignmentCoachByStudentId, setAssignmentCoachByStudentId] = useState<Record<string, string>>({});
  const [assignmentStatusUpdatingId, setAssignmentStatusUpdatingId] = useState<string | null>(null);
  const [assignmentListVersion, setAssignmentListVersion] = useState(0);
  const [coachIdNames, setCoachIdNames] = useState<{ id: string; name: string }[]>([]);
  const [schoolCounts, setSchoolCounts] = useState<Record<string, number>>({});
  const [schoolCoachAssignments, setSchoolCoachAssignments] = useState<Record<string, string[]>>({});
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [manageCoachesPaged, setManageCoachesPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [manageStudentsPaged, setManageStudentsPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [manageCoachesPage, setManageCoachesPage] = useState(1);
  const [manageStudentsPage, setManageStudentsPage] = useState(1);
  const [manageCoachSearchKeyword, setManageCoachSearchKeyword] = useState("");
  const [manageStudentSearchKeyword, setManageStudentSearchKeyword] = useState("");
  const [manageListVersion, setManageListVersion] = useState(0);
  const [selectedManageMember, setSelectedManageMember] = useState<Profile | null>(null);
  const [manageSelectionKind, setManageSelectionKind] = useState<"coach" | "student" | null>(null);
  const [manageSaving, setManageSaving] = useState(false);
  const [manageDeactivating, setManageDeactivating] = useState(false);
  const [padletCoachesPaged, setPadletCoachesPaged] = useState<PagedResult<Profile>>(emptyPaged);
  const [padletCoachesPage, setPadletCoachesPage] = useState(1);
  const [padletCoachSearchKeyword, setPadletCoachSearchKeyword] = useState("");

  const [recentPage, setRecentPage] = useState(1);
  const [allMembersPage, setAllMembersPage] = useState(1);
  const [coachesPage, setCoachesPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [assignmentCoachPage, setAssignmentCoachPage] = useState(1);
  const [assignmentStudentsPage, setAssignmentStudentsPage] = useState(1);
  const [assignmentCoachSearchKeyword, setAssignmentCoachSearchKeyword] = useState("");
  const [coachSearchKeyword, setCoachSearchKeyword] = useState("");
  const [studentSearchKeyword, setStudentSearchKeyword] = useState("");

  const prevSelectedRef = useRef(selected);

  useLayoutEffect(() => {
    if (prevSelectedRef.current !== selected) {
      prevSelectedRef.current = selected;
      setRecentPage(1);
      setAllMembersPage(1);
      setCoachesPage(1);
      setStudentsPage(1);
      setPendingPage(1);
      setCoachApprovalPage(1);
      setCoachApprovalSearchKeyword("");
      setAssignmentCoachPage(1);
      setAssignmentStudentsPage(1);
      setAssignmentCoachSearchKeyword("");
      setAssignmentDetailMode("idle");
      setAssignmentSelectedCoachId(null);
      setAssignmentSelectedCoachLabel(null);
      setAssignmentCoachByStudentId({});
      setManageCoachesPage(1);
      setManageStudentsPage(1);
      setManageCoachSearchKeyword("");
      setManageStudentSearchKeyword("");
      setSelectedManageMember(null);
      setManageSelectionKind(null);
      setPadletCoachesPage(1);
      setPadletCoachSearchKeyword("");
    }
  }, [selected]);

  useEffect(() => {
    setCoachesPage(1);
  }, [coachSearchKeyword]);

  useEffect(() => {
    setStudentsPage(1);
  }, [studentSearchKeyword]);

  useEffect(() => {
    setManageCoachesPage(1);
  }, [manageCoachSearchKeyword]);

  useEffect(() => {
    setManageStudentsPage(1);
  }, [manageStudentSearchKeyword]);

  useEffect(() => {
    setCoachApprovalPage(1);
  }, [coachApprovalSearchKeyword]);

  useEffect(() => {
    setPadletCoachesPage(1);
  }, [padletCoachSearchKeyword]);

  useEffect(() => {
    setAssignmentCoachPage(1);
  }, [assignmentCoachSearchKeyword]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const menuChanged = prevSelectedRef.current === selected;
      const s = await getAdminStats();
      if (cancelled) return;
      setStats(s);

      const coachMapPromise = listCoachIdNames();
      const schoolCountsPromise = getStudentSchoolCounts();
      const schoolCoachAssignmentsPromise = getSchoolCoachAssignments();

      switch (selected) {
          case "운영 현황": {
            const r = await listProfilesPaged({ page: 1, pageSize: DASH_RECENT_SIZE });
            if (!cancelled) setDashRecent(r.items);
            break;
          }
          case "최근 가입자": {
            const r = await listProfilesPaged({ page: recentPage, pageSize: PAGE_SIZE });
            if (!cancelled) setRecentPaged(r);
            break;
          }
          case "전체 회원 목록": {
            const r = await listProfilesPaged({ page: allMembersPage, pageSize: PAGE_SIZE });
            if (!cancelled) setAllMembersPaged(r);
            break;
          }
          case "코치 목록": {
            const r = await listProfilesPaged({
              role: "coach",
              page: coachesPage,
              pageSize: PAGE_SIZE,
              search: coachSearchKeyword,
            });
            if (!cancelled) setCoachesPaged(r);
            break;
          }
          case "학생 목록": {
            const [r, coaches] = await Promise.all([
              listProfilesPaged({
                role: "student",
                page: studentsPage,
                pageSize: PAGE_SIZE,
                search: studentSearchKeyword,
              }),
              coachMapPromise,
            ]);
            if (!cancelled) {
              setStudentsPaged(r);
              setCoachIdNames(coaches);
            }
            break;
          }
          case "승인 대기 현황": {
            const r = await listProfilesPaged({
              role: "coach",
              status: "pending",
              page: pendingPage,
              pageSize: PAGE_SIZE,
            });
            if (!cancelled) setPendingPaged(r);
            break;
          }
          case "코치 승인 관리": {
            const r = await listProfilesPaged({
              role: "coach",
              page: coachApprovalPage,
              pageSize: PAGE_SIZE,
              search: coachApprovalSearchKeyword,
            });
            if (!cancelled) setCoachApprovalPaged(r);
            break;
          }
          case "학생-코치 배정 관리": {
            const [coachesR, approvedCoachOptions] = await Promise.all([
              listProfilesPaged({
                role: "coach",
                status: "approved",
                page: assignmentCoachPage,
                pageSize: PAGE_SIZE,
                search: assignmentCoachSearchKeyword,
              }),
              listApprovedCoachIdNames(),
            ]);
            if (cancelled) return;
            setAssignmentCoachesPaged(coachesR);
            setAssignmentCoachOptions(approvedCoachOptions);

            if (assignmentDetailMode === "idle") {
              setAssignmentStudentsPaged(emptyPaged());
              break;
            }
            if (assignmentDetailMode === "coach") {
              if (!assignmentSelectedCoachId) {
                setAssignmentStudentsPaged(emptyPaged());
                break;
              }
              const studentsR = await listProfilesPaged({
                role: "student",
                page: assignmentStudentsPage,
                pageSize: PAGE_SIZE,
                assignedToCoachId: assignmentSelectedCoachId,
              });
              if (!cancelled) {
                setAssignmentStudentsPaged(studentsR);
                setAssignmentCoachByStudentId({});
              }
              break;
            }
            const studentsR = await listProfilesPaged({
              role: "student",
              page: assignmentStudentsPage,
              pageSize: PAGE_SIZE,
              assignedToCoachId: null,
            });
            if (!cancelled) {
              setAssignmentStudentsPaged(studentsR);
              setAssignmentCoachByStudentId({});
            }
            break;
          }
          case "학교별 배정 현황":
          case "학교 목록 관리": {
            const [counts, assignments] = await Promise.all([schoolCountsPromise, schoolCoachAssignmentsPromise]);
            if (!cancelled) {
              setSchoolCounts(counts);
              setSchoolCoachAssignments(assignments);
            }
            break;
          }
          case "회원 정보 관리": {
            const [rCoaches, rStudents, coaches] = await Promise.all([
              listProfilesPaged({
                role: "coach",
                page: manageCoachesPage,
                pageSize: PAGE_SIZE,
                search: manageCoachSearchKeyword,
              }),
              listProfilesPaged({
                role: "student",
                page: manageStudentsPage,
                pageSize: PAGE_SIZE,
                search: manageStudentSearchKeyword,
              }),
              coachMapPromise,
            ]);
            if (!cancelled) {
              setManageCoachesPaged(rCoaches);
              setManageStudentsPaged(rStudents);
              setCoachIdNames(coaches);
            }
            break;
          }
          case "코치 Padlet 주소": {
            const r = await listProfilesPaged({
              role: "coach",
              page: padletCoachesPage,
              pageSize: PAGE_SIZE,
              search: padletCoachSearchKeyword,
            });
            if (!cancelled) setPadletCoachesPaged(r);
            break;
          }
          default:
            break;
        }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    selected,
    recentPage,
    allMembersPage,
    coachesPage,
    studentsPage,
    coachSearchKeyword,
    studentSearchKeyword,
    manageCoachesPage,
    manageStudentsPage,
    manageCoachSearchKeyword,
    manageStudentSearchKeyword,
    manageListVersion,
    pendingPage,
    coachApprovalPage,
    coachApprovalSearchKeyword,
    coachApprovalListVersion,
    assignmentCoachPage,
    assignmentStudentsPage,
    assignmentCoachSearchKeyword,
    assignmentDetailMode,
    assignmentSelectedCoachId,
    assignmentListVersion,
    padletCoachesPage,
    padletCoachSearchKeyword,
  ]);

  useEffect(() => {
    if (selected !== "회원 정보 관리" || !selectedManageMember || !manageSelectionKind) return;
    const list = manageSelectionKind === "coach" ? manageCoachesPaged.items : manageStudentsPaged.items;
    const found = list.find((m) => m.id === selectedManageMember.id);
    if (found) {
      setSelectedManageMember(found);
    } else {
      setSelectedManageMember(null);
      setManageSelectionKind(null);
    }
  }, [selected, manageSelectionKind, manageCoachesPaged.items, manageStudentsPaged.items, selectedManageMember?.id]);

  useEffect(() => {
    if (selected !== "학생 목록") return;
    setSelectedStudent((prev) => {
      const items = studentsPaged.items;
      if (!items.length) return null;
      if (!prev) return items[0];
      return items.find((student) => student.id === prev.id) ?? items[0];
    });
  }, [selected, studentsPaged.items]);

  useEffect(() => {
    if (selected !== "코치 승인 관리") return;
    const maxPage = Math.max(1, Math.ceil(coachApprovalPaged.total / PAGE_SIZE));
    if (coachApprovalPage > maxPage) {
      setCoachApprovalPage(maxPage);
    }
  }, [selected, coachApprovalPaged.total, coachApprovalPage]);

  async function handleApprove(id: string) {
    await updateMemberStatus(id, "approved");
    let page = pendingPage;
    let r = await listProfilesPaged({
      role: "coach",
      status: "pending",
      page,
      pageSize: PAGE_SIZE,
    });
    const maxPage = Math.max(1, Math.ceil(r.total / PAGE_SIZE));
    if (page > maxPage) {
      page = maxPage;
      setPendingPage(page);
      r = await listProfilesPaged({
        role: "coach",
        status: "pending",
        page,
        pageSize: PAGE_SIZE,
      });
    }
    setPendingPaged(r);
    setStats(await getAdminStats());
  }

  async function handleReject(id: string) {
    await updateMemberStatus(id, "rejected");
    let page = pendingPage;
    let r = await listProfilesPaged({
      role: "coach",
      status: "pending",
      page,
      pageSize: PAGE_SIZE,
    });
    const maxPage = Math.max(1, Math.ceil(r.total / PAGE_SIZE));
    if (page > maxPage) {
      page = maxPage;
      setPendingPage(page);
      r = await listProfilesPaged({
        role: "coach",
        status: "pending",
        page,
        pageSize: PAGE_SIZE,
      });
    }
    setPendingPaged(r);
    setStats(await getAdminStats());
  }

  async function handleCoachApprovalStatusChange(coachId: string, nextStatus: MemberStatus) {
    const current = coachApprovalPaged.items.find((c) => c.id === coachId);
    if (!current || current.status === nextStatus) return;
    setCoachApprovalStatusUpdatingId(coachId);
    const res = await updateMemberStatus(coachId, nextStatus);
    setCoachApprovalStatusUpdatingId(null);
    if ("error" in res && res.error) {
      window.alert(res.error);
      return;
    }
    setCoachApprovalListVersion((v) => v + 1);
  }

  const coachNameById = (id: string | null) =>
    id ? coachIdNames.find((c) => c.id === id)?.name ?? "-" : "-";

  async function handleManageSave(payload: ProfileUpdatePayload) {
    if (!selectedManageMember) return;
    setManageSaving(true);
    const res = await updateProfile(selectedManageMember.id, payload);
    setManageSaving(false);
    if ("error" in res && res.error) {
      window.alert(res.error);
      return;
    }
    setManageListVersion((v) => v + 1);
    setStats(await getAdminStats());
  }

  async function handleManageDeactivate() {
    if (!selectedManageMember) return;
    if (selectedManageMember.id === profile.id) return;
    if (!window.confirm("이 회원을 비활성 처리하시겠습니까? (로그인 제한, DB에서는 삭제하지 않습니다.)")) return;
    setManageDeactivating(true);
    const res = await updateMemberStatus(selectedManageMember.id, "inactive");
    setManageDeactivating(false);
    if ("error" in res && res.error) {
      window.alert(res.error);
      return;
    }
    setManageListVersion((v) => v + 1);
    setStats(await getAdminStats());
  }

  async function handleAssignmentCoachChange(studentId: string, nextCoachId: string | null) {
    setAssignmentStatusUpdatingId(studentId);
    const res = await updateProfile(studentId, { coach_id: nextCoachId });
    setAssignmentStatusUpdatingId(null);
    if ("error" in res && res.error) {
      window.alert(res.error);
      return;
    }
    setAssignmentListVersion((v) => v + 1);
    setStats(await getAdminStats());
  }

  const adminCount = stats.total - stats.students - stats.coaches;
  const coachSearchPlaceholder = useMemo(() => "코치 검색 (이름/소속/이메일/연락처)", []);
  const studentSearchPlaceholder = useMemo(() => "학생 검색 (이름/학교/이메일/연락처)", []);
  const analyticsSection = (
    <div className="mt-6">
      <AdminMenuCharts selected={selected} stats={stats} schoolCounts={schoolCounts} adminCount={adminCount} />
    </div>
  );

  const padletPageUrlTotal = useMemo(
    () => padletCoachesPaged.items.reduce((acc, c) => acc + c.padlet_urls.length, 0),
    [padletCoachesPaged.items],
  );
  const padletPageCoachesWithUrls = useMemo(
    () => padletCoachesPaged.items.filter((c) => c.padlet_urls.length > 0).length,
    [padletCoachesPaged.items],
  );

  const contentMap: Record<string, React.ReactNode> = {
    "운영 현황": (
      <>
        <SectionHeader
          badge="Super Admin Workspace"
          title="슈퍼관리자 전용 회원관리 화면"
          description="전체 회원, 승인, 배정, 기준정보, 권한 정책까지 관리자 업무를 한 곳에서 탐색할 수 있는 구조입니다."
          selected={selected}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 회원" value={String(stats.total)} hint={`학생 ${stats.students} / 코치 ${stats.coaches} / 관리자 ${adminCount}`} />
          <StatCard label="승인 대기 코치" value={String(stats.pending)} hint="즉시 검토 필요" />
          <StatCard label="비활성 계정" value={String(stats.inactive)} hint="inactive 상태 회원" />
          <StatCard label="학교 수" value="16" hint="중학교 10 / 고등학교 6" />
        </div>
        {analyticsSection}
        <div className="flex flex-col gap-6">
          <DataTable
            title="최근 가입자"
            headers={["가입일", "이름", "역할", "학교/소속", "상태"]}
            rows={dashRecent.map((m) => [
              formatProfileJoinedDate(m.created_at),
              m.name,
              ROLE_LABELS[m.role],
              m.school_name || m.affiliation || "-",
              STATUS_LABELS[m.status],
            ])}
          />
          <InfoCard
            title="운영 요약"
            rows={[
              { label: "학생-코치 배정 완료율", value: "100%" },
              { label: "승인 대기 코치", value: `${stats.pending}명` },
              { label: "최근 비활성 처리", value: `${stats.inactive}건` },
              { label: "학교 등록 현황", value: "16개교" },
            ]}
          />
          <AdminMemosSection />
        </div>
      </>
    ),

    "승인 대기 현황": (
      <>
        <SectionHeader badge="Pending Review" title="승인 대기 현황" description="코치 가입 신청 중 승인 대기 중인 목록입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="대기 중" value={String(stats.pending)} hint="코치 신청" />
          <StatCard label="승인 완료" value={String(stats.coachApproved)} hint="학생 선택 가능" />
          <StatCard label="반려 완료" value={String(stats.coachRejected)} hint="재신청 가능" />
          <StatCard label="평균 처리시간" value="4h" hint="최근 7일" />
        </div>
        {analyticsSection}
        <div className="flex flex-col gap-6">
          <DataTable
            title="코치 승인 대기 목록"
            headers={["가입일", "이름", "소속", "연락처", "이메일", "처리"]}
            rows={pendingPaged.items.map((c) => [
              formatProfileJoinedDate(c.created_at),
              c.name,
              c.affiliation || "-",
              c.phone,
              c.email,
              <div key={c.id} className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => handleApprove(c.id)} className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-medium text-white">
                  <span className="relative z-10">승인</span>
                </button>
                <button type="button" onClick={() => handleReject(c.id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
                  반려
                </button>
              </div>,
            ])}
            pagination={{
              page: pendingPage,
              pageSize: PAGE_SIZE,
              totalCount: pendingPaged.total,
              onPageChange: setPendingPage,
            }}
          />
          <InfoCard
            title="처리 안내"
            rows={[
              { label: "승인 기준", value: "소속·연락처·이메일 확인" },
              { label: "반려 사유 예시", value: "중복 신청 / 정보 누락" },
              { label: "상태값", value: "pending / approved / rejected" },
            ]}
          />
        </div>
      </>
    ),

    "최근 가입자": (
      <>
        <SectionHeader badge="Recent Signup" title="최근 가입자" description="최근에 가입한 회원 목록입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 가입" value={String(stats.total)} hint="전체 기준" />
          <StatCard label="학생 가입" value={String(stats.students)} hint="즉시 approved" />
          <StatCard label="코치 가입" value={String(stats.coaches)} hint="pending 처리" />
          <StatCard label="비활성 회원" value={String(stats.inactive)} hint="inactive 처리" />
        </div>
        {analyticsSection}
        <DataTable
          title="최근 가입자 목록"
          headers={["가입일", "이름", "역할", "이메일", "상태"]}
          rows={recentPaged.items.map((m) => [
            formatProfileJoinedDate(m.created_at),
            m.name,
            ROLE_LABELS[m.role],
            m.email,
            STATUS_LABELS[m.status],
          ])}
          pagination={{
            page: recentPage,
            pageSize: PAGE_SIZE,
            totalCount: recentPaged.total,
            onPageChange: setRecentPage,
          }}
        />
      </>
    ),

    "전체 회원 목록": (
      <>
        <SectionHeader badge="All Members" title="전체 회원 목록" description="시스템에 등록된 모든 회원을 조회할 수 있습니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 회원" value={String(stats.total)} hint="관리 대상 전체" />
          <StatCard label="approved" value={String(stats.approvedProfiles)} hint="정상 이용 가능" />
          <StatCard label="pending" value={String(stats.pendingProfiles)} hint="승인 필요" />
          <StatCard label="inactive" value={String(stats.inactive)} hint="로그인 불가" />
        </div>
        {analyticsSection}
        <DataTable
          title="전체 회원 목록"
          headers={["가입일", "이름", "역할", "학교/소속", "상태", "이메일"]}
          rows={allMembersPaged.items.map((m) => [
            formatProfileJoinedDate(m.created_at),
            m.name,
            ROLE_LABELS[m.role],
            m.school_name || m.affiliation || "-",
            STATUS_LABELS[m.status],
            m.email,
          ])}
          pagination={{
            page: allMembersPage,
            pageSize: PAGE_SIZE,
            totalCount: allMembersPaged.total,
            onPageChange: setAllMembersPage,
          }}
        />
      </>
    ),

    "코치 목록": (
      <>
        <SectionHeader badge="Coach List" title="코치 목록" description="등록된 코치 목록입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 코치" value={String(stats.coaches)} hint="등록 코치" />
          <StatCard label="approved" value={String(stats.coachApproved)} hint="학생 선택 가능" />
          <StatCard label="pending" value={String(stats.coachPending)} hint="승인 필요" />
          <StatCard label="inactive" value={String(stats.coachInactive)} hint="비활성 처리" />
        </div>
        {analyticsSection}
        <DataTable
          title="코치 목록"
          headers={["가입일", "이름", "소속", "상태", "연락처"]}
          rows={coachesPaged.items.map((c) => [
            formatProfileJoinedDate(c.created_at),
            c.name,
            c.affiliation || "-",
            STATUS_LABELS[c.status],
            c.phone,
          ])}
          pagination={{
            page: coachesPage,
            pageSize: PAGE_SIZE,
            totalCount: coachesPaged.total,
            onPageChange: setCoachesPage,
          }}
          actions={
            <input
              type="search"
              value={coachSearchKeyword}
              onChange={(e) => setCoachSearchKeyword(e.target.value)}
              placeholder={coachSearchPlaceholder}
              className="h-10 w-full max-sm:min-w-0 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:min-w-[200px] sm:w-[320px]"
            />
          }
        />
      </>
    ),

    "코치 Padlet 주소": (
      <>
        <SectionHeader
          badge="Coach Padlet"
          title="코치 Padlet 주소"
          description="코치별로 등록한 Padlet 보드 URL을 확인합니다. 코치는 본인 화면에서 주소를 편집합니다."
          selected={selected}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 코치" value={String(stats.coaches)} hint="등록 코치" />
          <StatCard label="이 페이지 코치" value={String(padletCoachesPaged.items.length)} hint={`${padletCoachesPage}페이지`} />
          <StatCard label="이 페이지 URL 수" value={String(padletPageUrlTotal)} hint="표시 중인 행 합계" />
          <StatCard
            label="이 페이지 Padlet 보유"
            value={String(padletPageCoachesWithUrls)}
            hint="주소 1개 이상"
          />
        </div>
        <DataTable
          className="mt-6"
          title="코치별 Padlet URL"
          headers={["코치", "상태", "Padlet URL 목록"]}
          rows={padletCoachesPaged.items.map((c) => [
            <div key={`${c.id}-coach`} className="min-w-0 space-y-0.5">
              <p className="font-medium text-[var(--color-text)]">{c.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{c.affiliation || "소속 없음"}</p>
              <p className="truncate text-xs text-[var(--color-text-subtle)]">{c.email}</p>
            </div>,
            STATUS_LABELS[c.status],
            <div key={`${c.id}-urls`} className="flex w-full min-w-0 flex-col gap-2">
              {c.padlet_urls.length === 0 ? (
                <span className="text-sm text-[var(--color-text-subtle)]">등록된 Padlet 없음</span>
              ) : (
                c.padlet_urls.map((e, idx) => (
                  <a
                    key={e.id}
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm text-[var(--color-primary)] underline-offset-2 hover:underline"
                  >
                    {idx + 1}. {e.url}
                  </a>
                ))
              )}
            </div>,
          ])}
          pagination={{
            page: padletCoachesPage,
            pageSize: PAGE_SIZE,
            totalCount: padletCoachesPaged.total,
            onPageChange: setPadletCoachesPage,
          }}
          actions={
            <input
              type="search"
              value={padletCoachSearchKeyword}
              onChange={(e) => setPadletCoachSearchKeyword(e.target.value)}
              placeholder={coachSearchPlaceholder}
              className="h-10 w-full max-sm:min-w-0 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:min-w-[200px] sm:w-[320px]"
            />
          }
        />
        <InfoCard
          className="mt-6"
          title="안내"
          rows={[
            { label: "데이터 출처", value: "각 코치 프로필의 padlet_urls" },
            { label: "페이지당", value: `${PAGE_SIZE}명 (다음 페이지에서 나머지 코치 확인)` },
            { label: "수정", value: "코치 계정 → Padlet URL 관리에서만 변경 가능" },
          ]}
        />
      </>
    ),

    "학생 목록": (
      <>
        <SectionHeader badge="Student List" title="학생 목록" description="등록된 학생 목록입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 학생" value={String(stats.students)} hint="등록 학생" />
          <StatCard label="중학생" value={String(stats.studentsMiddleSchool)} hint="중학교 소속" />
          <StatCard label="고등학생" value={String(stats.studentsHighSchool)} hint="고등학교 소속" />
          <StatCard label="배정 완료" value={String(stats.studentsWithCoach)} hint="코치 배정 완료" />
        </div>
        {analyticsSection}
        <DataTable
          title="학생 목록"
          headers={["가입일", "이름", "학교", "학년", "담당 코치", "상태"]}
          rows={studentsPaged.items.map((s) => [
            formatProfileJoinedDate(s.created_at),
            s.name,
            s.school_name || "-",
            s.grade || "-",
            coachNameById(s.coach_id),
            STATUS_LABELS[s.status],
          ])}
          selectedRowIndex={studentsPaged.items.findIndex((student) => student.id === selectedStudent?.id)}
          onRowClick={(rowIndex) => {
            setSelectedStudent(studentsPaged.items[rowIndex] ?? null);
          }}
          pagination={{
            page: studentsPage,
            pageSize: PAGE_SIZE,
            totalCount: studentsPaged.total,
            onPageChange: setStudentsPage,
          }}
          actions={
            <input
              type="search"
              value={studentSearchKeyword}
              onChange={(e) => setStudentSearchKeyword(e.target.value)}
              placeholder={studentSearchPlaceholder}
              className="h-10 w-full max-sm:min-w-0 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:min-w-[200px] sm:w-[320px]"
            />
          }
        />
        {selectedStudent && (
          <InfoCard
            title="회원 상세 정보"
            rows={[
              { label: "가입일", value: formatProfileJoinedDate(selectedStudent.created_at) },
              { label: "이름", value: selectedStudent.name },
              { label: "역할", value: ROLE_LABELS[selectedStudent.role] },
              { label: "연락처", value: selectedStudent.phone },
              { label: "이메일", value: selectedStudent.email },
              { label: "학교유형", value: selectedStudent.school_type || "-" },
              { label: "학교명", value: selectedStudent.school_name || "-" },
              { label: "학년", value: selectedStudent.grade || "-" },
              { label: "소속", value: selectedStudent.affiliation || "-" },
            ]}
            className="mt-6"
          />
        )}
      </>
    ),

    "회원 정보 관리": (
      <>
        <SectionHeader
          badge="Member Management"
          title="회원 정보 관리"
          description="코치·학생 목록에서 회원을 선택한 뒤 정보를 수정하거나 비활성 처리할 수 있습니다."
          selected={selected}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 코치" value={String(stats.coaches)} hint="등록" />
          <StatCard label="전체 학생" value={String(stats.students)} hint="등록" />
          <StatCard label="비활성 회원" value={String(stats.inactive)} hint="inactive" />
          <StatCard
            label="선택"
            value={selectedManageMember?.name ?? "-"}
            hint={selectedManageMember ? ROLE_LABELS[selectedManageMember.role] : "목록에서 선택"}
          />
        </div>
        {analyticsSection}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <div className="space-y-6">
            <DataTable
              title="코치 목록"
              headers={["가입일", "이름", "소속", "상태", "연락처"]}
              rows={manageCoachesPaged.items.map((c) => [
                formatProfileJoinedDate(c.created_at),
                c.name,
                c.affiliation || "-",
                STATUS_LABELS[c.status],
                c.phone,
              ])}
              selectedRowIndex={
                manageSelectionKind === "coach"
                  ? manageCoachesPaged.items.findIndex((c) => c.id === selectedManageMember?.id)
                  : -1
              }
              onRowClick={(rowIndex) => {
                const row = manageCoachesPaged.items[rowIndex];
                if (row) {
                  setSelectedManageMember(row);
                  setManageSelectionKind("coach");
                }
              }}
              pagination={{
                page: manageCoachesPage,
                pageSize: PAGE_SIZE,
                totalCount: manageCoachesPaged.total,
                onPageChange: setManageCoachesPage,
              }}
              actions={
                <input
                  type="search"
                  value={manageCoachSearchKeyword}
                  onChange={(e) => setManageCoachSearchKeyword(e.target.value)}
                  placeholder="코치 검색 (이름/소속/이메일/연락처)"
                  className="h-10 w-full max-sm:min-w-0 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:min-w-[200px] sm:w-[320px]"
                />
              }
            />
            <DataTable
              title="학생 목록"
              headers={["가입일", "이름", "학교", "학년", "담당 코치", "상태"]}
              rows={manageStudentsPaged.items.map((s) => [
                formatProfileJoinedDate(s.created_at),
                s.name,
                s.school_name || "-",
                s.grade || "-",
                coachNameById(s.coach_id),
                STATUS_LABELS[s.status],
              ])}
              selectedRowIndex={
                manageSelectionKind === "student"
                  ? manageStudentsPaged.items.findIndex((s) => s.id === selectedManageMember?.id)
                  : -1
              }
              onRowClick={(rowIndex) => {
                const row = manageStudentsPaged.items[rowIndex];
                if (row) {
                  setSelectedManageMember(row);
                  setManageSelectionKind("student");
                }
              }}
              pagination={{
                page: manageStudentsPage,
                pageSize: PAGE_SIZE,
                totalCount: manageStudentsPaged.total,
                onPageChange: setManageStudentsPage,
              }}
              actions={
                <input
                  type="search"
                  value={manageStudentSearchKeyword}
                  onChange={(e) => setManageStudentSearchKeyword(e.target.value)}
                  placeholder="학생 검색 (이름/학교/이메일/연락처)"
                  className="h-10 w-full max-sm:min-w-0 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:min-w-[200px] sm:w-[320px]"
                />
              }
            />
          </div>
          <AdminMemberProfileEditor
            member={selectedManageMember}
            coachOptions={coachIdNames}
            currentAdminId={profile.id}
            saving={manageSaving}
            deactivating={manageDeactivating}
            onSave={handleManageSave}
            onDeactivate={handleManageDeactivate}
          />
        </div>
      </>
    ),

    "코치 승인 관리": (
      <>
        <SectionHeader
          badge="Coach Approval"
          title="코치 승인 관리"
          description="등록된 전체 코치 목록에서 상태를 확인·변경합니다. 승인 대기만 보려면 대시보드의 승인 대기 현황을 이용하세요."
          selected={selected}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 코치" value={String(stats.coaches)} hint="등록 코치" />
          <StatCard label="승인 대기" value={String(stats.pending)} hint="처리 필요" />
          <StatCard label="승인 완료" value={String(stats.coachApproved)} hint="학생 선택 가능" />
          <StatCard label="반려·비활성" value={String(stats.coachRejected + stats.coachInactive)} hint="rejected + inactive" />
        </div>
        {analyticsSection}
        <div className="flex flex-col gap-6">
          <DataTable
            title="코치 목록 · 상태 변경"
            headers={["가입일", "이름", "소속", "이메일", "연락처", "상태"]}
            rows={coachApprovalPaged.items.map((c) => [
              formatProfileJoinedDate(c.created_at),
              c.name,
              c.affiliation || "-",
              c.email,
              c.phone,
              <div key={c.id} onClick={(e) => e.stopPropagation()}>
                <select
                  value={c.status}
                  disabled={coachApprovalStatusUpdatingId === c.id}
                  onChange={(e) =>
                    void handleCoachApprovalStatusChange(c.id, e.target.value as MemberStatus)
                  }
                  className="w-full min-w-[7.5rem] rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 py-1.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>,
            ])}
            pagination={{
              page: coachApprovalPage,
              pageSize: PAGE_SIZE,
              totalCount: coachApprovalPaged.total,
              onPageChange: setCoachApprovalPage,
            }}
            actions={
              <input
                type="search"
                value={coachApprovalSearchKeyword}
                onChange={(e) => setCoachApprovalSearchKeyword(e.target.value)}
                placeholder={coachSearchPlaceholder}
                className="h-10 w-full max-sm:min-w-0 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:min-w-[200px] sm:w-[320px]"
              />
            }
          />
          <InfoCard
            title="상태 전환 규칙"
            rows={[
              { label: "가입 직후", value: "pending" },
              { label: "승인", value: "approved (학생 담당 가능)" },
              { label: "반려", value: "rejected" },
              { label: "비활성", value: "inactive (로그인 제한)" },
            ]}
          />
        </div>
      </>
    ),

    "학생-코치 배정 관리": (
      <>
        <SectionHeader badge="Assignment" title="학생-코치 배정 관리" description="학생과 코치 간의 배정을 관리합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="배정 학생" value={String(stats.students)} hint="전체 학생" />
          <StatCard label="배정 가능 코치" value={String(stats.coachApproved)} hint="approved 코치" />
          <StatCard label="배정 변경 요청" value="0" hint="관리자 처리" />
          <StatCard label="미배정 학생" value={String(stats.studentsWithoutCoach)} hint="코치 없음" />
        </div>
        {analyticsSection}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <DataTable
            title="배정 가능 코치"
            headers={["가입일", "이름", "소속", "연락처"]}
            rows={assignmentCoachesPaged.items.map((c) => [
              formatProfileJoinedDate(c.created_at),
              c.name,
              c.affiliation || "-",
              c.phone,
            ])}
            selectedRowIndex={
              assignmentDetailMode === "coach" && assignmentSelectedCoachId
                ? assignmentCoachesPaged.items.findIndex((c) => c.id === assignmentSelectedCoachId)
                : -1
            }
            onRowClick={(rowIndex) => {
              const row = assignmentCoachesPaged.items[rowIndex];
              if (row) {
                setAssignmentDetailMode("coach");
                setAssignmentSelectedCoachId(row.id);
                setAssignmentSelectedCoachLabel(row.name);
                setAssignmentStudentsPage(1);
              }
            }}
            pagination={{
              page: assignmentCoachPage,
              pageSize: PAGE_SIZE,
              totalCount: assignmentCoachesPaged.total,
              onPageChange: setAssignmentCoachPage,
            }}
            actions={
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="search"
                  value={assignmentCoachSearchKeyword}
                  onChange={(e) => setAssignmentCoachSearchKeyword(e.target.value)}
                  placeholder="코치 검색 (이름/소속/이메일/연락처)"
                  className="h-10 w-full min-w-[200px] rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] sm:w-[280px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentDetailMode("unassigned");
                    setAssignmentSelectedCoachId(null);
                    setAssignmentSelectedCoachLabel("미배정 학생");
                    setAssignmentStudentsPage(1);
                  }}
                  className={`h-10 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors ${
                    assignmentDetailMode === "unassigned"
                      ? "border-[var(--color-primary)] bg-[var(--glass-bg-hover)] text-[var(--color-text)]"
                      : "border-[var(--glass-border)] text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]"
                  }`}
                >
                  미배정 학생 보기 ({stats.studentsWithoutCoach}명)
                </button>
              </div>
            }
          />
          <div className="space-y-6">
            {assignmentDetailMode === "idle" ? (
              <div className="glass rounded-2xl p-8 text-center text-sm text-[var(--color-text-subtle)]">
                왼쪽에서 코치를 선택하거나 「미배정 학생 보기」를 누르면 배정된 학생 목록이 표시됩니다.
              </div>
            ) : (
              <DataTable
                title={
                  assignmentDetailMode === "unassigned"
                    ? "미배정 학생"
                    : assignmentSelectedCoachLabel
                      ? `코치(${assignmentSelectedCoachLabel})별 배정 학생`
                      : "배정 학생"
                }
                headers={["가입일", "이름", "학교", "학년", "담당 코치 변경"]}
                rows={assignmentStudentsPaged.items.map((s) => {
                  const nextCoachId = assignmentCoachByStudentId[s.id] ?? (s.coach_id ?? "");
                  const unchanged = (s.coach_id ?? "") === nextCoachId;
                  const rowUpdating = assignmentStatusUpdatingId === s.id;
                  return [
                    formatProfileJoinedDate(s.created_at),
                    s.name,
                    s.school_name || "-",
                    s.grade || "-",
                    <div key={s.id} className="flex min-w-[240px] items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={nextCoachId}
                        disabled={rowUpdating}
                        onChange={(e) =>
                          setAssignmentCoachByStudentId((prev) => ({
                            ...prev,
                            [s.id]: e.target.value,
                          }))
                        }
                        className="h-9 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
                      >
                        <option value="">미배정</option>
                        {assignmentCoachOptions.map((coach) => (
                          <option key={coach.id} value={coach.id}>
                            {coach.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={rowUpdating || unchanged}
                        onClick={() => void handleAssignmentCoachChange(s.id, nextCoachId || null)}
                        className="h-9 shrink-0 rounded-lg border border-[var(--glass-border)] px-3 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--glass-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {rowUpdating ? "저장 중…" : "변경"}
                      </button>
                    </div>,
                  ];
                })}
                pagination={{
                  page: assignmentStudentsPage,
                  pageSize: PAGE_SIZE,
                  totalCount: assignmentStudentsPaged.total,
                  onPageChange: setAssignmentStudentsPage,
                }}
              />
            )}
            <InfoCard
              title="배정 규칙"
              rows={[
                { label: "학생 당 코치 수", value: "1명" },
                { label: "코치 당 학생 수", value: "다수 가능" },
                { label: "변경 권한", value: "super_admin만 가능" },
              ]}
            />
          </div>
        </div>
      </>
    ),

    "학교별 배정 현황": (
      <>
        <SectionHeader badge="School Assignment" title="학교별 배정 현황" description="학교별 학생/코치 배정 현황을 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="학교 수" value="16" hint="등록 학교" />
          <StatCard label="중학교" value="10" hint="고정 목록" />
          <StatCard label="고등학교" value="6" hint="고정 목록" />
          <StatCard label="코치 배정 검토" value="0건" hint="학교별 편차 점검" />
        </div>
        {analyticsSection}
        <DataTable
          title="학교별 배정 현황"
          headers={["학교명", "유형", "학생 수", "코치"]}
          rows={[
            ...SCHOOLS["중학교"].map((name) => [
              name,
              "중학교",
              String(schoolCounts[name] ?? 0),
              schoolCoachAssignments[name]?.join(", ") || "-",
            ]),
            ...SCHOOLS["고등학교"].map((name) => [
              name,
              "고등학교",
              String(schoolCounts[name] ?? 0),
              schoolCoachAssignments[name]?.join(", ") || "-",
            ]),
          ]}
        />
      </>
    ),

    "학교 목록 관리": (
      <>
        <SectionHeader badge="School Management" title="학교 목록 관리" description="학교 목록을 관리합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="전체 학교" value="16" hint="현재 등록" />
          <StatCard label="중학교" value="10" hint="영월 관내" />
          <StatCard label="고등학교" value="6" hint="영월 관내" />
          <StatCard label="최근 변경" value="0건" hint="최근 30일" />
        </div>
        {analyticsSection}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <DataTable
            title="학교 목록"
            headers={["학교명", "유형", "상태"]}
            rows={[
              ...SCHOOLS["중학교"].map((name) => [name, "중학교", "사용 중"]),
              ...SCHOOLS["고등학교"].map((name) => [name, "고등학교", "사용 중"]),
            ]}
          />
          <InfoCard
            title="학교 운영 포인트"
            rows={[
              { label: "학교 목록 변경", value: "super_admin만 가능" },
              { label: "학생 가입 시 사용", value: "선택형 목록" },
              { label: "확장 방식", value: "상수 + 관리 화면 병행" },
            ]}
          />
        </div>
      </>
    ),

    "상태값 관리": (
      <>
        <SectionHeader badge="Status Management" title="상태값 관리" description="회원 상태값 정의를 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="사용 상태값" value="4" hint="고정 enum" />
          <StatCard label="pending" value={String(stats.pendingProfiles)} hint="승인 대기" />
          <StatCard label="approved" value={String(stats.approvedProfiles)} hint="정상 이용" />
          <StatCard label="inactive" value={String(stats.inactive)} hint="로그인 제한" />
        </div>
        {analyticsSection}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <DataTable
            title="상태값 정의"
            headers={["상태값", "의미", "로그인 가능"]}
            rows={[
              ["pending", "가입대기", "불가"],
              ["approved", "승인", "가능"],
              ["rejected", "반려", "불가"],
              ["inactive", "비활성", "불가"],
            ]}
          />
          <InfoCard
            title="운영 원칙"
            rows={[
              { label: "coach 기본값", value: "pending" },
              { label: "student 기본값", value: "approved" },
              { label: "삭제 대체", value: "inactive 우선" },
            ]}
          />
        </div>
      </>
    ),

    "내 정보 확인": (
      <>
        <SectionHeader badge="My Profile" title="내 정보 확인" description="관리자 계정 정보를 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="역할" value="슈퍼관리자" hint="최고 관리자" />
          <StatCard label="상태" value={STATUS_LABELS[profile.status]} hint="정상 이용 가능" />
          <StatCard label="권한 범위" value="전체 관리" hint="회원 / 학교 / 배정" />
          <StatCard label="최근 로그인" value="오늘" hint="관리자 계정" />
        </div>
        {analyticsSection}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <InfoCard
            title="내 정보 확인"
            rows={[
              { label: "이름", value: profile.name },
              { label: "소속", value: profile.affiliation || "-" },
              { label: "연락처", value: profile.phone || "-" },
              { label: "이메일", value: profile.email || "-" },
            ]}
          />
          <InfoCard
            title="관리 권한 요약"
            rows={[
              { label: "조회 가능", value: "전체 회원" },
              { label: "수정 가능", value: "전체 회원 / 학교 / 배정" },
              { label: "승인 처리", value: "코치 승인 / 반려" },
            ]}
          />
        </div>
      </>
    ),

    "권한 정책 확인": (
      <>
        <SectionHeader badge="Permission Policy" title="권한 정책 확인" description="역할별 권한 정책을 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="역할 수" value="3" hint="super_admin / coach / student" />
          <StatCard label="상태값 수" value="4" hint="pending 등" />
          <StatCard label="RLS 정책" value="적용" hint="DB 레벨 권한 통제" />
          <StatCard label="RBAC" value="적용" hint="앱 레벨 권한 통제" />
        </div>
        {analyticsSection}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <DataTable
            title="권한 정책 표"
            headers={["역할", "조회", "수정"]}
            rows={[
              ["슈퍼관리자", "전체 회원", "전체 회원 / 학교 / 배정"],
              ["코치", "본인 + 담당 학생", "본인 정보만"],
              ["학생", "본인 정보만", "연락처 / 이메일만"],
            ]}
          />
          <InfoCard
            title="보안 원칙"
            rows={[
              { label: "프론트 숨김만 사용", value: "불가" },
              { label: "서버 검증", value: "필수" },
              { label: "RLS와 서버 일관성", value: "필수" },
            ]}
          />
        </div>
      </>
    ),
  };

  return contentMap[selected] || <div className="text-[var(--color-text-muted)]">메뉴를 선택해주세요.</div>;
}
