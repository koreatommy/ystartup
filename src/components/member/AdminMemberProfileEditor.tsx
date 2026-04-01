"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  GRADES,
  ROLE_LABELS,
  SCHOOL_TYPES,
  SCHOOLS,
  STATUSES,
  STATUS_LABELS,
} from "@/constants/member";
import type { MemberStatus, SchoolType, Grade } from "@/constants/member";
import type { Profile, ProfileUpdatePayload } from "@/types/member";

function fieldClass(disabled?: boolean) {
  return cn(
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
    disabled
      ? "cursor-not-allowed border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--color-text-subtle)]"
      : "border-[var(--glass-border)] bg-[var(--color-bg-base)] text-[var(--color-text)] focus:border-[var(--color-primary)]/50",
  );
}

export interface AdminMemberProfileEditorProps {
  member: Profile | null;
  coachOptions: { id: string; name: string }[];
  currentAdminId: string;
  saving: boolean;
  deactivating: boolean;
  onSave: (payload: ProfileUpdatePayload) => void | Promise<void>;
  onDeactivate: () => void | Promise<void>;
}

export function AdminMemberProfileEditor({
  member,
  coachOptions,
  currentAdminId,
  saving,
  deactivating,
  onSave,
  onDeactivate,
}: AdminMemberProfileEditorProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [status, setStatus] = useState<MemberStatus>("approved");
  const [schoolType, setSchoolType] = useState<SchoolType | "">("");
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState<Grade | "">("");
  const [coachId, setCoachId] = useState("");

  useEffect(() => {
    if (!member) {
      setName("");
      setPhone("");
      setEmail("");
      setAffiliation("");
      setStatus("approved");
      setSchoolType("");
      setSchoolName("");
      setGrade("");
      setCoachId("");
      return;
    }
    setName(member.name);
    setPhone(member.phone);
    setEmail(member.email);
    setAffiliation(member.affiliation ?? "");
    setStatus(member.status);
    setSchoolType(member.school_type ?? "");
    setSchoolName(member.school_name ?? "");
    setGrade(member.grade ?? "");
    setCoachId(member.coach_id ?? "");
  }, [member]);

  const schoolChoices =
    schoolType && schoolType in SCHOOLS ? SCHOOLS[schoolType as SchoolType] : [];

  if (!member) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-[var(--color-text-muted)]">
        코치 또는 학생 목록에서 회원을 선택하면 정보를 수정할 수 있습니다.
      </div>
    );
  }

  const isCoach = member.role === "coach";
  const isStudent = member.role === "student";
  const isSelf = member.id === currentAdminId;
  const canDeactivate = !isSelf && member.status !== "inactive";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base: ProfileUpdatePayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status,
    };
    if (isCoach) {
      void onSave({ ...base, affiliation: affiliation.trim() || null });
      return;
    }
    if (isStudent) {
      void onSave({
        ...base,
        school_type: schoolType || null,
        school_name: schoolName.trim() || null,
        grade: grade || null,
        coach_id: coachId.trim() || null,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">회원 정보 수정</h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            역할: {ROLE_LABELS[member.role]} · ID: {member.id.slice(0, 8)}…
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving || (!isCoach && !isStudent)}
            className="rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "저장 중…" : "변경 저장"}
          </button>
          <button
            type="button"
            disabled={deactivating || !canDeactivate}
            onClick={() => void onDeactivate()}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deactivating ? "처리 중…" : "비활성(삭제)"}
          </button>
        </div>
      </div>

      {isSelf && (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          본인 계정은 비활성 처리할 수 없습니다.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">상태</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MemberStatus)}
            className={fieldClass()}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">이름</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass()} required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">연락처</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass()} />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass()}
          />
        </label>

        {isCoach && (
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">소속</span>
            <input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className={fieldClass()} />
          </label>
        )}

        {isStudent && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">학교 유형</span>
              <select
                value={schoolType}
                onChange={(e) => {
                  const next = e.target.value as SchoolType | "";
                  setSchoolType(next);
                  const list = next ? SCHOOLS[next] : [];
                  setSchoolName(list[0] ?? "");
                }}
                className={fieldClass()}
              >
                <option value="">선택</option>
                {SCHOOL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">학교명</span>
              <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className={fieldClass(!schoolType)}
                disabled={!schoolType}
              >
                <option value="">선택</option>
                {schoolChoices.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">학년</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as Grade | "")}
                className={fieldClass()}
              >
                <option value="">선택</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">담당 코치</span>
              <select value={coachId} onChange={(e) => setCoachId(e.target.value)} className={fieldClass()}>
                <option value="">미배정</option>
                {coachOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-[var(--color-text-subtle)]">
        비활성(삭제)은 계정을 DB에서 지우지 않고 로그인이 불가능한 상태로 전환합니다.
      </p>
    </form>
  );
}
