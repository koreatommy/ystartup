"use client";

import { MemberLayout, type MenuGroup } from "@/components/member";
import { AdminContent } from "./AdminContent";
import type { Profile } from "@/types/member";

const ADMIN_MENU: MenuGroup[] = [
  { section: "대시보드", items: ["운영 현황", "승인 대기 현황", "최근 가입자"] },
  {
    section: "회원관리",
    items: ["전체 회원 목록", "코치 목록", "학생 목록", "회원 정보 관리", "코치 Padlet 주소"],
  },
  { section: "승인·배정관리", items: ["코치 승인 관리", "학생-코치 배정 관리", "학교별 배정 현황"] },
  { section: "기준정보", items: ["학교 목록 관리", "상태값 관리"] },
  { section: "설정", items: ["내 정보 확인", "권한 정책 확인"] },
];

interface Props {
  profile: Profile;
}

export function AdminDashboard({ profile }: Props) {
  return (
    <MemberLayout
      title="관리자 콘솔"
      role="super_admin"
      menu={ADMIN_MENU}
      profile={profile}
      defaultSelected="운영 현황"
    >
      {(selected, onSelect) => (
        <AdminContent selected={selected} onSelect={onSelect} profile={profile} />
      )}
    </MemberLayout>
  );
}
