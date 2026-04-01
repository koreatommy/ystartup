"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, StatCard, InfoCard, DataTable, FormCard, PasswordChangeSection } from "@/components/member";
import { STATUS_LABELS } from "@/constants/member";
import { updateMyProfile } from "@/lib/actions/members";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/member";
import { StudentMenuCharts } from "@/components/member/charts/student/StudentMenuCharts";

interface Props {
  selected: string;
  onSelect: (s: string) => void;
  profile: Profile;
}

export function StudentContent({ selected, onSelect, profile }: Props) {
  const router = useRouter();
  const [coach, setCoach] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({
    phone: profile.phone,
    email: profile.email,
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setEditForm({ phone: profile.phone, email: profile.email });
  }, [profile.phone, profile.email]);

  useEffect(() => {
    if (profile.coach_id && isSupabaseConfigured()) {
      const supabase = createClient();
      supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.coach_id)
        .single()
        .then(({ data }) => setCoach(data as Profile | null));
      return;
    }
    setCoach(null);
  }, [profile.coach_id]);

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

  const studentAnalytics = (
    <div className="mt-6">
      <StudentMenuCharts selected={selected} profile={profile} coach={coach} />
    </div>
  );

  const contentMap: Record<string, React.ReactNode> = {
    "내 정보 요약": (
      <>
        <SectionHeader badge="Student Workspace" title="학생 전용 내 정보 관리" description="본인 정보 조회와 허용된 항목 수정만 가능합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="이름" value={profile.name} hint="student 계정" />
          <StatCard label="상태" value={STATUS_LABELS[profile.status]} hint="정상 이용 가능" />
          <StatCard label="학교" value={profile.school_name || "-"} hint="직접 변경 불가" />
          <StatCard label="담당 코치" value={coach?.name || "-"} hint="직접 변경 불가" />
        </div>
        {studentAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <InfoCard
            title="내 정보 요약"
            rows={[
              { label: "이름", value: profile.name },
              { label: "연락처", value: profile.phone },
              { label: "이메일", value: profile.email },
              { label: "학교", value: `${profile.school_name || "-"} / ${profile.grade || "-"}` },
            ]}
            actionLabel="내 정보 수정"
            onAction={() => onSelect("연락처/이메일 수정")}
          />
          <InfoCard
            title="수정 가능 범위"
            rows={[
              { label: "가능", value: "연락처 / 이메일 / 비밀번호" },
              { label: "불가", value: "학교 / 학년 / 담당 코치 / 이름" },
              { label: "상태 변경", value: "관리자만 가능" },
            ]}
          />
        </div>
      </>
    ),

    "담당 코치 정보": (
      <>
        <SectionHeader badge="Coach Info" title="담당 코치 정보" description="배정된 담당 코치 정보를 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="담당 코치" value={coach?.name || "-"} hint="현재 배정" />
          <StatCard label="소속" value={coach?.affiliation || "-"} hint="coach affiliation" />
          <StatCard label="연락처" value={coach?.phone || "-"} hint="조회용" />
          <StatCard label="변경 권한" value="없음" hint="student 직접 변경 불가" />
        </div>
        {studentAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <InfoCard
            title="담당 코치 정보"
            rows={[
              { label: "이름", value: coach?.name || "-" },
              { label: "소속", value: coach?.affiliation || "-" },
              { label: "연락처", value: coach?.phone || "-" },
              { label: "이메일", value: coach?.email || "-" },
            ]}
          />
          <InfoCard
            title="안내"
            rows={[
              { label: "코치 변경", value: "super_admin 처리 대상" },
              { label: "학생 직접 변경", value: "불가" },
              { label: "조회 범위", value: "본인 정보 + 담당 코치" },
            ]}
          />
        </div>
      </>
    ),

    "계정 상태": (
      <>
        <SectionHeader badge="Account Status" title="계정 상태" description="계정 상태 안내입니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="현재 상태" value={STATUS_LABELS[profile.status]} hint="정상 로그인 가능" />
          <StatCard label="역할" value="학생" hint="고정값" />
          <StatCard label="가입 처리" value="즉시 승인" hint="student 정책" />
          <StatCard label="로그인 제한 상태" value="inactive" hint="관리자 처리 시 제한" />
        </div>
        {studentAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <DataTable
            title="상태값 안내"
            headers={["상태", "의미", "로그인"]}
            rows={[
              ["approved", "정상 이용 가능", "가능"],
              ["inactive", "이용 제한", "불가"],
              ["pending", "student에는 기본 적용 안 함", "불가"],
              ["rejected", "student에는 일반 적용 안 함", "불가"],
            ]}
          />
          <InfoCard
            title="계정 안내"
            rows={[
              { label: "기본 상태", value: "approved" },
              { label: "변경 권한", value: "super_admin만 가능" },
              { label: "비활성화 우선", value: "삭제보다 inactive 적용" },
            ]}
          />
        </div>
      </>
    ),

    "내 정보 조회": (
      <>
        <SectionHeader badge="My Info" title="내 정보 조회" description="등록된 내 정보를 확인합니다." selected={selected} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="학교유형" value={profile.school_type || "-"} hint="school_type" />
          <StatCard label="학교명" value={profile.school_name || "-"} hint="school_name" />
          <StatCard label="학년" value={profile.grade || "-"} hint="grade" />
          <StatCard label="담당 코치" value={coach?.name || "-"} hint="coach_id 연결" />
        </div>
        {studentAnalytics}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <InfoCard
            title="내 정보"
            rows={[
              { label: "이름", value: profile.name },
              { label: "연락처", value: profile.phone },
              { label: "이메일", value: profile.email },
              { label: "학교유형", value: profile.school_type || "-" },
              { label: "학교명", value: profile.school_name || "-" },
              { label: "학년", value: profile.grade || "-" },
              { label: "담당 코치", value: coach?.name || "-" },
              { label: "상태", value: STATUS_LABELS[profile.status] },
            ]}
          />
          <InfoCard
            title="고정 항목"
            rows={[
              { label: "학교유형", value: "직접 변경 불가" },
              { label: "학교명", value: "직접 변경 불가" },
              { label: "학년", value: "직접 변경 불가" },
              { label: "담당 코치", value: "직접 변경 불가" },
            ]}
          />
        </div>
      </>
    ),

    "연락처/이메일 수정": (
      <>
        <SectionHeader
          badge="Edit Contact"
          title="연락처/이메일 수정"
          description="연락처·이메일을 저장하고, 하단에서 비밀번호를 변경할 수 있습니다."
          selected={selected}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="수정 가능" value="연락처" hint="phone" />
          <StatCard label="수정 가능" value="이메일" hint="email" />
          <StatCard label="수정 가능" value="비밀번호" hint="내 정보 수정 화면 하단" />
          <StatCard label="수정 불가" value="학교/학년" hint="정책 제한" />
          <StatCard label="수정 불가" value="담당 코치" hint="정책 제한" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <FormCard
              title="내 정보 수정"
              submitLabel="변경 저장"
              onSubmit={() => void handleSave()}
              loading={saving}
              fields={[
                { label: "이름", value: profile.name, disabled: true },
                { label: "연락처", value: editForm.phone, onChange: (v) => setEditForm((p) => ({ ...p, phone: v })) },
                { label: "이메일", value: editForm.email, onChange: (v) => setEditForm((p) => ({ ...p, email: v })) },
                { label: "학교", value: profile.school_name || "-", disabled: true },
                { label: "학년", value: profile.grade || "-", disabled: true },
                { label: "담당 코치", value: coach?.name || "-", disabled: true },
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
              { label: "저장 제한", value: "허용 항목만 업데이트" },
            ]}
          />
        </div>
      </>
    ),
  };

  return contentMap[selected] || <div className="text-[var(--color-text-muted)]">메뉴를 선택해주세요.</div>;
}
