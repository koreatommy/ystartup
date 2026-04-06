"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, missingSupabaseEnvMessage } from "@/lib/supabase/env";
import type { AdminMemo, ListAdminMemosParams, PagedResult } from "@/types/member";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_CONTENT_LENGTH = 500;

/** 마이그레이션 미적용 시 PostgREST가 내는 메시지를 사용자 안내로 치환 */
function mapAdminMemosDbError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("admin_memos") &&
    (m.includes("schema cache") || m.includes("could not find the table") || m.includes("pgrst205"))
  ) {
    return (
      "Supabase DB에 admin_memos 테이블이 없습니다. " +
      "프로젝트의 supabase/migrations/006_admin_memos.sql 전체를 Supabase 대시보드 → SQL Editor에서 실행한 뒤, " +
      "1~2분 후 페이지를 새로고침해 주세요. (로컬이라면 supabase db push 또는 migration 적용)"
    );
  }
  return message;
}

type MemoRow = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  profiles: { name: string } | { name: string }[] | null;
};

function mapMemoRow(row: MemoRow): AdminMemo {
  const p = row.profiles;
  const authorName = Array.isArray(p) ? p[0]?.name ?? null : p?.name ?? null;
  return {
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    author_name: authorName,
  };
}

async function requireSuperAdmin(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
): Promise<{ userId: string } | { error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "인증되지 않았습니다." };

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!caller || caller.role !== "super_admin") {
    return { error: "권한이 없습니다." };
  }
  return { userId: user.id };
}

function validateContent(raw: string): string | { error: string } {
  const content = raw.trim();
  if (!content) return { error: "메모 내용을 입력해주세요." };
  if (content.length > MAX_CONTENT_LENGTH) {
    return { error: `메모는 ${MAX_CONTENT_LENGTH}자 이하여야 합니다.` };
  }
  return content;
}

export async function listAdminMemosPaged(
  params: ListAdminMemosParams = {},
): Promise<PagedResult<AdminMemo> | { error: string }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!isSupabaseConfigured()) {
    return { error: missingSupabaseEnvMessage() };
  }

  const supabase = await createServerSupabase();
  const auth = await requireSuperAdmin(supabase);
  if ("error" in auth) return auth;

  const { data, error, count } = await supabase
    .from("admin_memos")
    .select("id, content, created_at, updated_at, created_by, profiles(name)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return { error: mapAdminMemosDbError(error.message) };
  }

  const items = (data || []).map((row) => mapMemoRow(row as MemoRow));
  return {
    items,
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function createAdminMemo(
  rawContent: string,
): Promise<{ success: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };

  const validated = validateContent(rawContent);
  if (typeof validated !== "string") return validated;

  const supabase = await createServerSupabase();
  const auth = await requireSuperAdmin(supabase);
  if ("error" in auth) return auth;

  const { error } = await supabase.from("admin_memos").insert({
    content: validated,
    created_by: auth.userId,
  });

  if (error) return { error: mapAdminMemosDbError(error.message) };
  return { success: true };
}

export async function updateAdminMemo(
  id: string,
  rawContent: string,
): Promise<{ success: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };

  const validated = validateContent(rawContent);
  if (typeof validated !== "string") return validated;

  const supabase = await createServerSupabase();
  const auth = await requireSuperAdmin(supabase);
  if ("error" in auth) return auth;

  const { error, data } = await supabase
    .from("admin_memos")
    .update({ content: validated })
    .eq("id", id)
    .select("id");

  if (error) return { error: mapAdminMemosDbError(error.message) };
  if (!data?.length) return { error: "메모를 찾을 수 없습니다." };
  return { success: true };
}

export async function deleteAdminMemo(id: string): Promise<{ success: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: missingSupabaseEnvMessage() };

  const supabase = await createServerSupabase();
  const auth = await requireSuperAdmin(supabase);
  if ("error" in auth) return auth;

  const { error, data } = await supabase.from("admin_memos").delete().eq("id", id).select("id");

  if (error) return { error: mapAdminMemosDbError(error.message) };
  if (!data?.length) return { error: "메모를 찾을 수 없습니다." };
  return { success: true };
}
