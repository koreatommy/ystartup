/**
 * 슈퍼관리자 Auth 사용자 + profiles 행 생성/갱신
 *
 * 필요 환경 변수 (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (Dashboard → Settings → API Keys → Secret / service_role)
 *
 * 선택:
 *   BOOTSTRAP_ADMIN_EMAIL (기본 admin@ystart.local)
 *   BOOTSTRAP_ADMIN_PASSWORD (기본 ystart1! — Supabase 이메일 최소 6자 제한 대응)
 *
 * 실행: npm run create-super-admin
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
const email =
  process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || "admin@ystart.local";
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "ystart1!";

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL 와 SUPABASE_SERVICE_ROLE_KEY 가 .env.local 에 필요합니다.\n" +
      "Secret 키는 Supabase → Project Settings → API Keys → Secret keys 에서 확인하세요.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let userId;

const { data: created, error: createErr } =
  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "시스템 관리자" },
  });

if (createErr) {
  const msg = createErr.message || "";
  const already =
    /already|registered|exists|duplicate/i.test(msg) ||
    createErr.status === 422;
  if (already) {
    const { data: page, error: listErr } =
      await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) {
      console.error("기존 사용자 조회 실패:", listErr.message);
      process.exit(1);
    }
    const u = page.users.find(
      (x) => x.email?.toLowerCase() === email.toLowerCase(),
    );
    if (!u) {
      console.error("createUser 실패:", createErr.message);
      process.exit(1);
    }
    userId = u.id;
    console.log("기존 Auth 사용자 사용:", email, userId);
  } else {
    console.error("createUser 실패:", createErr.message);
    if (/password|length|characters/i.test(msg)) {
      console.error(
        "\n힌트: Supabase → Authentication → Providers → Email → Minimum password length 를 확인하거나, BOOTSTRAP_ADMIN_PASSWORD 를 더 길게 설정하세요.",
      );
    }
    process.exit(1);
  }
} else {
  userId = created.user.id;
  console.log("Auth 사용자 생성:", email, userId);
}

const { error: pwdErr } = await admin.auth.admin.updateUserById(userId, {
  password,
  email_confirm: true,
});

if (pwdErr) {
  console.warn("비밀번호 갱신 경고 (무시 가능):", pwdErr.message);
}

const { error: profileErr } = await admin.from("profiles").upsert(
  {
    id: userId,
    role: "super_admin",
    status: "approved",
    name: "시스템 관리자",
    phone: "010-0000-0000",
    email,
    affiliation: "본부",
  },
  { onConflict: "id" },
);

if (profileErr) {
  console.error("profiles upsert 실패:", profileErr.message);
  process.exit(1);
}

console.log("\n완료. 로그인 이메일:", email);
console.log("초기 비밀번호:", password);
console.log("/login 에서 위 계정으로 로그인 후 /admin 으로 이동합니다.");
