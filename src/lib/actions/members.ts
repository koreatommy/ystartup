"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, missingSupabaseEnvMessage } from "@/lib/supabase/env";
import { mapSupabaseAuthErrorMessage } from "@/lib/supabase/auth-errors";
import { validateProfileUpdate } from "@/lib/validations/member";
import type {
  Profile,
  ProfileUpdatePayload,
  PagedResult,
  ListProfilesPagedParams,
  AdminDashboardStats,
} from "@/types/member";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function emptyPaged<T>(page: number, pageSize: number): PagedResult<T> {
  return { items: [], total: 0, page, pageSize };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function getAllMembers() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as Profile[];
}

export async function getMembersByRole(role: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", role)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as Profile[];
}

export async function getPendingCoaches() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "coach")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as Profile[];
}

/** 프로필 목록 페이징 (필터: role, status). 정렬: created_at 내림차순 */
export async function listProfilesPaged(params: ListProfilesPagedParams = {}): Promise<PagedResult<Profile>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!isSupabaseConfigured()) {
    return emptyPaged<Profile>(page, pageSize);
  }

  const supabase = await createServerSupabase();
  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.role) {
    query = query.eq("role", params.role);
  }
  if (params.status) {
    query = query.eq("status", params.status);
  }
  if (params.role === "student" && params.assignedToCoachId !== undefined) {
    if (params.assignedToCoachId === null) {
      query = query.is("coach_id", null);
    } else {
      query = query.eq("coach_id", params.assignedToCoachId);
    }
  }
  const trimmedSearch = params.search?.trim();
  if (trimmedSearch) {
    const escapedSearch = trimmedSearch.replace(/[%_]/g, "\\$&");
    query = query.or(
      [
        `name.ilike.%${escapedSearch}%`,
        `email.ilike.%${escapedSearch}%`,
        `affiliation.ilike.%${escapedSearch}%`,
        `school_name.ilike.%${escapedSearch}%`,
        `phone.ilike.%${escapedSearch}%`,
      ].join(","),
    );
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return emptyPaged<Profile>(page, pageSize);
  }

  return {
    items: (data || []) as Profile[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

/** 학생 목록의 담당 코치명 매핑용 (코치 수가 적을 때 한 번에 조회) */
export async function listCoachIdNames(): Promise<{ id: string; name: string }[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("profiles").select("id, name").eq("role", "coach");

  if (error) return [];
  return (data || []) as { id: string; name: string }[];
}

/** 배정 화면에서 사용할 승인된 코치 id/name 목록 */
export async function listApprovedCoachIdNames(): Promise<{ id: string; name: string }[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "coach")
    .eq("status", "approved");

  if (error) return [];
  return (data || []) as { id: string; name: string }[];
}

/** 학교별 학생 수 집계 (학교명 → 인원). `school_name`만 조회 */
export async function getStudentSchoolCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) return {};
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("profiles").select("school_name").eq("role", "student");

  if (error) return {};
  const counts: Record<string, number> = {};
  for (const row of data || []) {
    const key = (row as { school_name: string | null }).school_name || "";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

/** 학교별 배정 코치명 집계 (학교명 -> 코치명 배열). 학생-코치 배정 기준으로 계산 */
export async function getSchoolCoachAssignments(): Promise<Record<string, string[]>> {
  if (!isSupabaseConfigured()) return {};
  const supabase = await createServerSupabase();
  const [{ data: students, error: studentsError }, { data: coaches, error: coachesError }] = await Promise.all([
    supabase
      .from("profiles")
      .select("school_name, coach_id")
      .eq("role", "student")
      .not("coach_id", "is", null),
    supabase.from("profiles").select("id, name").eq("role", "coach"),
  ]);

  if (studentsError || coachesError) return {};

  const coachNameById = new Map<string, string>();
  for (const coach of coaches || []) {
    const row = coach as { id: string; name: string | null };
    if (row.id && row.name) {
      coachNameById.set(row.id, row.name);
    }
  }

  const schoolCoachSetMap: Record<string, Set<string>> = {};
  for (const student of students || []) {
    const row = student as { school_name: string | null; coach_id: string | null };
    if (!row.school_name || !row.coach_id) continue;
    const coachName = coachNameById.get(row.coach_id);
    if (!coachName) continue;
    if (!schoolCoachSetMap[row.school_name]) {
      schoolCoachSetMap[row.school_name] = new Set<string>();
    }
    schoolCoachSetMap[row.school_name].add(coachName);
  }

  const assignments: Record<string, string[]> = {};
  for (const [schoolName, coachNames] of Object.entries(schoolCoachSetMap)) {
    assignments[schoolName] = Array.from(coachNames).sort((a, b) => a.localeCompare(b, "ko"));
  }
  return assignments;
}

export async function getMyStudents() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .eq("coach_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as Profile[];
}

export async function updateMemberStatus(memberId: string, status: string) {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증되지 않았습니다." };

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!callerProfile || callerProfile.role !== "super_admin") {
    return { error: "권한이 없습니다." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", memberId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateProfile(memberId: string, payload: ProfileUpdatePayload) {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증되지 않았습니다." };

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!callerProfile || callerProfile.role !== "super_admin") {
    return { error: "권한이 없습니다." };
  }

  if (payload.coach_id !== undefined && payload.coach_id !== null) {
    const { data: coachProfile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", payload.coach_id)
      .single();
    if (!coachProfile || coachProfile.role !== "coach" || coachProfile.status !== "approved") {
      return { error: "승인된 코치에게만 배정할 수 있습니다." };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", memberId);

  if (error) return { error: error.message };
  return { success: true };
}

function normalizeEmail(e: string | undefined | null) {
  return (e ?? "").trim().toLowerCase();
}

function mapProfilesUpdateError(message: string, code?: string): string {
  const m = message.toLowerCase();
  if (code === "23505" || m.includes("duplicate") || m.includes("unique")) {
    if (m.includes("email")) return "이미 사용 중인 이메일입니다.";
    return "중복된 값이 있어 저장할 수 없습니다.";
  }
  return message;
}

export async function updateMyProfile(payload: { phone?: string; email?: string; affiliation?: string }) {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증되지 않았습니다." };

  const { data: callerProfile, error: profileFetchError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileFetchError || !callerProfile?.role) {
    return { error: "프로필을 찾을 수 없습니다." };
  }

  const role = callerProfile.role as string;
  if (role !== "coach" && role !== "student") {
    return { error: "코치 또는 학생 계정만 프로필을 수정할 수 있습니다." };
  }

  const trimmed: { phone?: string; email?: string; affiliation?: string } = {};
  if (payload.phone !== undefined) trimmed.phone = payload.phone.trim();
  if (payload.email !== undefined) trimmed.email = payload.email.trim();
  if (payload.affiliation !== undefined) trimmed.affiliation = payload.affiliation.trim();

  const validationErrors = validateProfileUpdate(trimmed, role);
  if (validationErrors.length > 0) {
    return { error: validationErrors[0].message };
  }

  if (trimmed.email !== undefined) {
    const next = normalizeEmail(trimmed.email);
    const current = normalizeEmail(user.email);
    if (next !== current) {
      const { error: authEmailError } = await supabase.auth.updateUser({ email: trimmed.email });
      if (authEmailError) {
        return { error: mapSupabaseAuthErrorMessage(authEmailError.message) };
      }
    }
  }

  const { error } = await supabase.from("profiles").update(trimmed).eq("id", user.id);

  if (error) {
    return { error: mapProfilesUpdateError(error.message, error.code) };
  }
  return { success: true };
}

/** 코치/학생 본인 로그인 비밀번호 변경 (Supabase Auth) */
export async function updateMyPassword(newPassword: string): Promise<{ success?: true; error?: string }> {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };
  const trimmed = newPassword?.trim() ?? "";
  if (trimmed.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 합니다." };
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증되지 않았습니다." };

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!caller || (caller.role !== "coach" && caller.role !== "student")) {
    return { error: "비밀번호 변경은 코치 또는 학생 계정만 사용할 수 있습니다." };
  }

  const { error } = await supabase.auth.updateUser({ password: trimmed });
  if (error) return { error: mapSupabaseAuthErrorMessage(error.message) };
  return { success: true };
}

export async function getAdminStats(): Promise<AdminDashboardStats> {
  const empty: AdminDashboardStats = {
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

  if (!isSupabaseConfigured()) {
    return empty;
  }
  const supabase = await createServerSupabase();

  const [
    { count: totalCount },
    { count: studentCount },
    { count: coachCount },
    { count: pendingCount },
    { count: inactiveCount },
    { count: approvedProfiles },
    { count: pendingProfiles },
    { count: coachApproved },
    { count: coachRejected },
    { count: coachInactive },
    { count: studentsMiddleSchool },
    { count: studentsHighSchool },
    { count: studentsWithCoach },
    { count: studentsWithoutCoach },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach").eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "inactive"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach").eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach").eq("status", "rejected"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach").eq("status", "inactive"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student").eq("school_type", "중학교"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student").eq("school_type", "고등학교"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student").not("coach_id", "is", null),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student").is("coach_id", null),
  ]);

  return {
    total: totalCount || 0,
    students: studentCount || 0,
    coaches: coachCount || 0,
    pending: pendingCount || 0,
    inactive: inactiveCount || 0,
    approvedProfiles: approvedProfiles || 0,
    pendingProfiles: pendingProfiles || 0,
    coachApproved: coachApproved || 0,
    coachPending: pendingCount || 0,
    coachRejected: coachRejected || 0,
    coachInactive: coachInactive || 0,
    studentsMiddleSchool: studentsMiddleSchool || 0,
    studentsHighSchool: studentsHighSchool || 0,
    studentsWithCoach: studentsWithCoach || 0,
    studentsWithoutCoach: studentsWithoutCoach || 0,
  };
}
