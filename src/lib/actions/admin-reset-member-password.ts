"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, missingSupabaseEnvMessage } from "@/lib/supabase/env";
import { createAdminSupabase, hasServiceRoleKey } from "@/lib/supabase/admin";

/** 관리자가 코치·학생 로그인 비밀번호를 초기화할 때 사용하는 고정 임시 비밀번호 */
const ADMIN_RESET_INITIAL_PASSWORD = "123456";

/**
 * 슈퍼관리자 전용: 코치 또는 학생 계정의 Auth 비밀번호를 임시 값으로 재설정합니다.
 * `SUPABASE_SERVICE_ROLE_KEY` 가 있어야 합니다.
 */
export async function resetCoachStudentPasswordToInitial(
  memberId: string,
): Promise<{ success: true } | { error: string }> {
  if (!isSupabaseConfigured()) {
    return { error: missingSupabaseEnvMessage() };
  }
  if (!hasServiceRoleKey()) {
    return {
      error:
        "비밀번호 초기화에는 서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.",
    };
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "인증되지 않았습니다." };
  }

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!caller || caller.role !== "super_admin") {
    return { error: "권한이 없습니다." };
  }

  const { data: target, error: targetErr } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", memberId)
    .single();

  if (targetErr || !target) {
    return { error: "대상 회원을 찾을 수 없습니다." };
  }
  if (target.role !== "coach" && target.role !== "student") {
    return { error: "코치·학생 계정만 비밀번호를 초기화할 수 있습니다." };
  }

  const admin = createAdminSupabase();
  const { error } = await admin.auth.admin.updateUserById(memberId, {
    password: ADMIN_RESET_INITIAL_PASSWORD,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
