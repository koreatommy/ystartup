import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, missingSupabaseEnvMessage } from "@/lib/supabase/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(missingSupabaseEnvMessage());
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  );
}
