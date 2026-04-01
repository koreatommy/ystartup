"use client";

/** 학생 영역은 단건·소량 UI 위주라 목록 페이징을 두지 않습니다. (슈퍼관리자/코치와 정책 분리) */

import { MemberLayout, type MenuGroup } from "@/components/member";
import { StudentContent } from "./StudentContent";
import type { Profile } from "@/types/member";

const STUDENT_MENU: MenuGroup[] = [
  { section: "대시보드", items: ["내 정보 요약", "담당 코치 정보", "계정 상태"] },
  { section: "내 정보", items: ["내 정보 조회", "연락처/이메일 수정"] },
];

interface Props {
  profile: Profile;
}

export function StudentDashboard({ profile }: Props) {
  return (
    <MemberLayout
      title="내 계정"
      role="student"
      menu={STUDENT_MENU}
      profile={profile}
      defaultSelected="내 정보 요약"
    >
      {(selected, onSelect) => (
        <StudentContent selected={selected} onSelect={onSelect} profile={profile} />
      )}
    </MemberLayout>
  );
}
