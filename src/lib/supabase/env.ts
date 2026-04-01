/**
 * Supabase 공개 URL·anon key가 모두 있을 때만 true.
 * 미들웨어·서버 액션에서 클라이언트 생성 전에 사용합니다.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

export function missingSupabaseEnvMessage(): string {
  return [
    "Supabase 연결 정보가 없습니다.",
    ".env.local에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정한 뒤 개발 서버를 다시 시작하세요.",
    "https://supabase.com/dashboard/project/_/settings/api",
  ].join(" ");
}
