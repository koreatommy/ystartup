import type { Role, MemberStatus, SchoolType, Grade } from "@/constants/member";

/** 공통 페이징 응답 (서버/클라이언트 목록 모두 동일 형태로 맞춤) */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** `listProfilesPaged` 서버 액션 파라미터 */
export interface ListProfilesPagedParams {
  page?: number;
  pageSize?: number;
  role?: Role;
  status?: MemberStatus;
  search?: string;
  /** `role === "student"`일 때만 적용. `undefined`: 필터 없음, `null`: 미배정, 문자열: 해당 코치 id */
  assignedToCoachId?: string | null;
}

/** 슈퍼관리자 대시보드 집계 (`getAdminStats`) */
export interface AdminDashboardStats {
  total: number;
  students: number;
  coaches: number;
  /** 코치 중 pending (승인 대기) */
  pending: number;
  inactive: number;
  approvedProfiles: number;
  pendingProfiles: number;
  coachApproved: number;
  coachPending: number;
  coachRejected: number;
  coachInactive: number;
  studentsMiddleSchool: number;
  studentsHighSchool: number;
  studentsWithCoach: number;
  studentsWithoutCoach: number;
}

export interface Profile {
  id: string;
  role: Role;
  status: MemberStatus;
  name: string;
  phone: string;
  email: string;
  affiliation: string | null;
  school_type: SchoolType | null;
  school_name: string | null;
  grade: Grade | null;
  coach_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachOption {
  id: string;
  name: string;
  affiliation: string | null;
  school_type: SchoolType | null;
  school_name: string | null;
}

export interface StudentSignupPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  school_type: SchoolType;
  school_name: string;
  grade: Grade;
  coach_id: string;
}

export interface CoachSignupPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  affiliation: string;
}

export interface ProfileUpdatePayload {
  name?: string;
  phone?: string;
  email?: string;
  affiliation?: string | null;
  school_type?: SchoolType | null;
  school_name?: string | null;
  grade?: Grade | null;
  coach_id?: string | null;
  status?: MemberStatus;
}
