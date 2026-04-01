import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, missingSupabaseEnvMessage } from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: missingSupabaseEnvMessage() }, { status: 503 });
  }
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("list_approved_coaches");

  if (error) {
    return NextResponse.json({ error: "코치 목록 조회 중 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json(data);
}
