export const ROLES = ["super_admin", "coach", "student"] as const;
export type Role = (typeof ROLES)[number];

export const STATUSES = ["pending", "approved", "rejected", "inactive"] as const;
export type MemberStatus = (typeof STATUSES)[number];

export const SCHOOL_TYPES = ["중학교", "고등학교"] as const;
export type SchoolType = (typeof SCHOOL_TYPES)[number];

export const GRADES = ["1학년", "2학년", "3학년"] as const;
export type Grade = (typeof GRADES)[number];

export const SCHOOLS: Record<SchoolType, string[]> = {
  중학교: [
    "영월중학교",
    "봉래중학교",
    "옥동중학교",
    "녹전중학교",
    "마차중학교",
    "연당중학교",
    "쌍룡중학교",
    "주천중학교",
    "상동중학교",
    "석정여자중학교",
  ],
  고등학교: [
    "영월고등학교",
    "한국소방마이스터고등학교",
    "마차고등학교",
    "주천고등학교",
    "상동고등학교",
    "석정여자고등학교",
  ],
};

export const STATUS_LABELS: Record<MemberStatus, string> = {
  pending: "승인 대기",
  approved: "승인",
  rejected: "반려",
  inactive: "비활성",
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "슈퍼관리자",
  coach: "코치",
  student: "학생",
};

export const STATUS_LOGIN_ALLOWED: Record<MemberStatus, boolean> = {
  pending: false,
  approved: true,
  rejected: false,
  inactive: false,
};

export const DEFAULT_STATUS: Record<Role, MemberStatus> = {
  super_admin: "approved",
  coach: "pending",
  student: "approved",
};
