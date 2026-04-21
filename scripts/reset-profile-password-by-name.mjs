/**
 * profiles.name 기준 단일 계정 Auth 비밀번호 재설정 (service_role)
 *
 * 사용: node scripts/reset-profile-password-by-name.mjs "이름" "새비밀번호"
 * .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) {
    console.error(".env.local 파일이 없습니다.");
    process.exit(1);
  }
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvLocal();

const name = process.argv[2];
const newPassword = process.argv[3];

if (!name || newPassword === undefined) {
  console.error('사용법: node scripts/reset-profile-password-by-name.mjs "이름" "새비밀번호"');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL 와 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: profiles, error: qErr } = await admin
  .from("profiles")
  .select("id, email, name, role")
  .eq("name", name);

if (qErr) {
  console.error("profiles 조회 실패:", qErr.message);
  process.exit(1);
}

if (!profiles?.length) {
  console.error(`이름이 "${name}" 인 프로필이 없습니다.`);
  process.exit(1);
}

if (profiles.length > 1) {
  console.error(`동일 이름 ${profiles.length}건이 있습니다. 이메일로 수동 처리하세요:`, profiles.map((p) => p.email).join(", "));
  process.exit(1);
}

const row = profiles[0];
const { error } = await admin.auth.admin.updateUserById(row.id, { password: newPassword });

if (error) {
  console.error("Auth 비밀번호 갱신 실패:", error.message);
  process.exit(1);
}

console.log("비밀번호를 갱신했습니다.");
console.log("  id:", row.id);
console.log("  email:", row.email);
console.log("  role:", row.role);
