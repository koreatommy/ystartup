/**
 * 코치·학생 Auth 비밀번호 일괄 재설정 (service_role)
 *
 * .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, COACH_STUDENT_RESET_PASSWORD
 * 실행: node scripts/reset-coach-student-passwords.mjs
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const newPassword = process.env.COACH_STUDENT_RESET_PASSWORD?.trim();

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL 와 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.");
  process.exit(1);
}

if (!newPassword || newPassword.length < 6) {
  console.error(
    "COACH_STUDENT_RESET_PASSWORD 가 필요합니다. (.env.local 에 6자 이상으로 설정하세요.)",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: profiles, error: profilesError } = await admin
  .from("profiles")
  .select("id, role, email")
  .in("role", ["coach", "student"]);

if (profilesError) {
  console.error("profiles 조회 실패:", profilesError.message);
  process.exit(1);
}

const rows = profiles || [];
console.log(`대상 계정: ${rows.length}건 (coach + student)`);

let ok = 0;
let fail = 0;

for (const row of rows) {
  const { error } = await admin.auth.admin.updateUserById(row.id, {
    password: newPassword,
  });
  if (error) {
    console.error(`실패 ${row.email || row.id}:`, error.message);
    fail += 1;
  } else {
    console.log("갱신:", row.email || row.id);
    ok += 1;
  }
}

console.log(`\n완료: 성공 ${ok}, 실패 ${fail}`);
console.log("(비밀번호는 auth에만 반영됩니다. Git에 .env.local 을 커밋하지 마세요.)");
