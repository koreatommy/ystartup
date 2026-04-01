"use client";

import { MemberLayout, type MenuGroup } from "@/components/member";
import { CoachContent } from "./CoachContent";
import type { Profile } from "@/types/member";

const COACH_MENU: MenuGroup[] = [
  { section: "대시보드", items: ["내 정보 요약", "담당 학생 현황", "최근 등록 학생"] },
  { section: "학생관리", items: ["담당 학생 조회"] },
  { section: "설정", items: ["내 정보 조회", "내 정보 수정"] },
];

interface Props {
  profile: Profile;
}

export function CoachDashboard({ profile }: Props) {
  return (
    <MemberLayout
      title="코치 업무"
      role="coach"
      menu={COACH_MENU}
      profile={profile}
      defaultSelected="내 정보 요약"
    >
      {(selected, onSelect) => (
        <CoachContent selected={selected} onSelect={onSelect} profile={profile} />
      )}
    </MemberLayout>
  );
}
