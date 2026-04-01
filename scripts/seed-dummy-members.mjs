/**
 * 승인된 코치 + 학생 더미 데이터 (Auth + profiles)
 *
 * .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * 실행: node scripts/seed-dummy-members.mjs
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
const DUMMY_PASSWORD =
  process.env.COACH_STUDENT_RESET_PASSWORD?.trim() ||
  process.env.SEED_DUMMY_PASSWORD ||
  "DemoYstart1!";

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL 와 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAuthUser(email, password, userMetadata) {
  const { data: created, error: createErr } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });

  if (!createErr && created?.user) {
    return created.user.id;
  }

  const msg = createErr?.message || "";
  const already =
    /already|registered|exists|duplicate/i.test(msg) ||
    createErr?.status === 422;
  if (!already) {
    console.error(`createUser 실패 (${email}):`, msg);
    process.exit(1);
  }

  const { data: page, error: listErr } =
    await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.error("listUsers 실패:", listErr.message);
    process.exit(1);
  }
  const u = page.users.find(
    (x) => x.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!u) {
    console.error(`기존 사용자를 찾을 수 없음: ${email}`);
    process.exit(1);
  }
  await admin.auth.admin.updateUserById(u.id, {
    password,
    email_confirm: true,
  });
  return u.id;
}

const coaches = [
  {
    email: "coach.kim@demo.ystart.local",
    name: "김영월",
    phone: "010-2001-0001",
    affiliation: "영월교육지원청",
  },
  {
    email: "coach.lee@demo.ystart.local",
    name: "이소방",
    phone: "010-2002-0002",
    affiliation: "한국소방마이스터고등학교",
  },
  {
    email: "coach.park@demo.ystart.local",
    name: "박주천",
    phone: "010-2003-0003",
    affiliation: "주천고등학교",
  },
];

const coachIds = {};

for (const c of coaches) {
  const id = await ensureAuthUser(c.email, DUMMY_PASSWORD, { name: c.name });
  coachIds[c.email] = id;
  const { error } = await admin.from("profiles").upsert(
    {
      id,
      role: "coach",
      status: "approved",
      name: c.name,
      phone: c.phone,
      email: c.email,
      affiliation: c.affiliation,
    },
    { onConflict: "id" },
  );
  if (error) {
    console.error("profiles upsert (coach) 실패:", c.email, error.message);
    process.exit(1);
  }
  console.log("코치:", c.email, id);
}

const kim = coachIds["coach.kim@demo.ystart.local"];
const lee = coachIds["coach.lee@demo.ystart.local"];
const park = coachIds["coach.park@demo.ystart.local"];

const students = [
  {
    email: "student01@demo.ystart.local",
    name: "최민수",
    phone: "010-3001-0001",
    school_type: "중학교",
    school_name: "영월중학교",
    grade: "2학년",
    coach_id: kim,
  },
  {
    email: "student02@demo.ystart.local",
    name: "정서연",
    phone: "010-3002-0002",
    school_type: "고등학교",
    school_name: "영월고등학교",
    grade: "1학년",
    coach_id: kim,
  },
  {
    email: "student03@demo.ystart.local",
    name: "한지훈",
    phone: "010-3003-0003",
    school_type: "고등학교",
    school_name: "한국소방마이스터고등학교",
    grade: "2학년",
    coach_id: lee,
  },
  {
    email: "student04@demo.ystart.local",
    name: "윤다은",
    phone: "010-3004-0004",
    school_type: "중학교",
    school_name: "주천중학교",
    grade: "3학년",
    coach_id: park,
  },
  {
    email: "student05@demo.ystart.local",
    name: "강태양",
    phone: "010-3005-0005",
    school_type: "고등학교",
    school_name: "주천고등학교",
    grade: "3학년",
    coach_id: park,
  },
];

for (const s of students) {
  const id = await ensureAuthUser(s.email, DUMMY_PASSWORD, { name: s.name });
  const { error } = await admin.from("profiles").upsert(
    {
      id,
      role: "student",
      status: "approved",
      name: s.name,
      phone: s.phone,
      email: s.email,
      school_type: s.school_type,
      school_name: s.school_name,
      grade: s.grade,
      coach_id: s.coach_id,
    },
    { onConflict: "id" },
  );
  if (error) {
    console.error("profiles upsert (student) 실패:", s.email, error.message);
    process.exit(1);
  }
  console.log("학생:", s.email, id);
}

console.log("\n더미 계정 공통 비밀번호:", DUMMY_PASSWORD);
console.log("(환경변수 SEED_DUMMY_PASSWORD 로 변경 가능)");
