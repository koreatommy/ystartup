"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, missingSupabaseEnvMessage } from "@/lib/supabase/env";
import {
  canBypassSignupRateLimit,
  createAdminSupabase,
  hasServiceRoleKey,
} from "@/lib/supabase/admin";
import { mapSupabaseAuthErrorMessage } from "@/lib/supabase/auth-errors";
import { redirect } from "next/navigation";
import { DEFAULT_STATUS } from "@/constants/member";
import { validateCoachSignup, validateStudentSignup } from "@/lib/validations/member";
import type { StudentSignupPayload, CoachSignupPayload, CoachOption } from "@/types/member";

export async function signupStudent(payload: StudentSignupPayload) {
  if (!isSupabaseConfigured()) {
    return { error: missingSupabaseEnvMessage() };
  }

  const data: StudentSignupPayload = {
    ...payload,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
  };
  const signupErrors = validateStudentSignup(data);
  if (signupErrors.length > 0) {
    return { error: signupErrors[0].message };
  }

  const supabase = await createServerSupabase();
  const { data: coachOptions, error: coachOptionsError } = await supabase.rpc("list_approved_coaches");

  if (coachOptionsError) {
    return { error: "코치 목록을 조회할 수 없습니다. 잠시 후 다시 시도해주세요." };
  }

  const isValidCoach = (coachOptions as CoachOption[] | null)?.some(
    (coach) => coach.id === data.coach_id,
  );

  if (!isValidCoach) {
    return { error: "유효한 담당 코치를 선택해주세요." };
  }

  if (canBypassSignupRateLimit() && hasServiceRoleKey()) {
    const admin = createAdminSupabase();
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name },
    });

    if (authError || !authData.user) {
      return { error: mapSupabaseAuthErrorMessage(authError?.message) };
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: authData.user.id,
      role: "student",
      status: DEFAULT_STATUS.student,
      name: data.name,
      phone: data.phone,
      email: data.email,
      school_type: data.school_type,
      school_name: data.school_name,
      grade: data.grade,
      coach_id: data.coach_id,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(authData.user.id);
      return { error: "프로필 저장에 실패했습니다. 관리자에게 문의해주세요." };
    }

    redirect("/login?registered=student");
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { name: data.name } },
  });

  if (authError || !authData.user) {
    return { error: mapSupabaseAuthErrorMessage(authError?.message) };
  }

  if (!authData.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (signInError) {
      return {
        error: `계정은 생성되었으나 프로필 생성에 실패했습니다. (${mapSupabaseAuthErrorMessage(signInError.message)})`,
      };
    }
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    role: "student",
    status: DEFAULT_STATUS.student,
    name: data.name,
    phone: data.phone,
    email: data.email,
    school_type: data.school_type,
    school_name: data.school_name,
    grade: data.grade,
    coach_id: data.coach_id,
  });

  if (profileError) {
    return { error: "프로필 저장에 실패했습니다. 관리자에게 문의해주세요." };
  }

  await supabase.auth.signOut();
  redirect("/login?registered=student");
}

export async function signupCoach(payload: CoachSignupPayload) {
  if (!isSupabaseConfigured()) {
    return { error: missingSupabaseEnvMessage() };
  }

  const data: CoachSignupPayload = {
    ...payload,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    affiliation: payload.affiliation.trim(),
  };
  const signupErrors = validateCoachSignup(data);
  if (signupErrors.length > 0) {
    return { error: signupErrors[0].message };
  }

  const supabase = await createServerSupabase();

  if (canBypassSignupRateLimit() && hasServiceRoleKey()) {
    const admin = createAdminSupabase();
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name },
    });

    if (authError || !authData.user) {
      return { error: mapSupabaseAuthErrorMessage(authError?.message) };
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: authData.user.id,
      role: "coach",
      status: DEFAULT_STATUS.coach,
      name: data.name,
      phone: data.phone,
      email: data.email,
      affiliation: data.affiliation,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(authData.user.id);
      return { error: "프로필 저장에 실패했습니다. 관리자에게 문의해주세요." };
    }

    redirect("/login?registered=coach");
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { name: data.name } },
  });

  if (authError || !authData.user) {
    return { error: mapSupabaseAuthErrorMessage(authError?.message) };
  }

  if (!authData.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (signInError) {
      return {
        error: `계정은 생성되었으나 프로필 생성에 실패했습니다. (${mapSupabaseAuthErrorMessage(signInError.message)})`,
      };
    }
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    role: "coach",
    status: DEFAULT_STATUS.coach,
    name: data.name,
    phone: data.phone,
    email: data.email,
    affiliation: data.affiliation,
  });

  if (profileError) {
    return { error: "프로필 저장에 실패했습니다. 관리자에게 문의해주세요." };
  }

  await supabase.auth.signOut();
  redirect("/login?registered=coach");
}

export async function login(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return { error: missingSupabaseEnvMessage() };
  }
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: mapSupabaseAuthErrorMessage(error.message) };
  }

  redirect("/");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function getApprovedCoaches(): Promise<CoachOption[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("list_approved_coaches");

  if (error) return [];
  return data || [];
}
