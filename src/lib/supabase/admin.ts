import "server-only";
import { createClient } from "@supabase/supabase-js";

export function canBypassSignupRateLimit(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.BYPASS_SUPABASE_SIGNUP_RATE_LIMIT === "true"
  );
}

export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error("서비스 롤 키가 없어 관리자 가입 경로를 사용할 수 없습니다.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
