"use client";

import { useState, useEffect, type HTMLAttributes } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, UserPlus } from "lucide-react";
import { SCHOOLS, SCHOOL_TYPES, GRADES, type SchoolType } from "@/constants/member";
import { formatKoreanMobileHyphenInput, validateStudentSignup } from "@/lib/validations/member";
import { signupStudent, getApprovedCoaches } from "@/lib/actions/auth";
import type { CoachOption } from "@/types/member";

export default function StudentSignupPage() {
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [form, setForm] = useState({
    school_type: "" as string,
    school_name: "",
    grade: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    coach_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    getApprovedCoaches().then(setCoaches);
  }, []);

  const schoolOptions = form.school_type
    ? SCHOOLS[form.school_type as SchoolType] || []
    : [];
  const filteredCoaches = coaches.filter((coach) => {
    if (!form.school_type) return true;
    if (!coach.school_type) return true;
    if (coach.school_type !== form.school_type) return false;
    if (!form.school_name) return true;
    if (!coach.school_name) return true;
    return coach.school_name === form.school_name;
  });

  function handleChange(field: string, value: string) {
    const nextValue =
      field === "phone" ? formatKoreanMobileHyphenInput(value) : value;
    setForm((prev) => {
      const next = { ...prev, [field]: nextValue };
      if (field === "school_type") {
        next.school_name = "";
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const trimmed = { ...form, email: form.email.trim() };
    const validationErrors = validateStudentSignup(trimmed);
    if (validationErrors.length > 0) {
      const errMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errMap[err.field] = err.message;
      });
      setErrors(errMap);
      return;
    }

    setLoading(true);
    try {
      const result = await signupStudent({
        email: trimmed.email,
        password: form.password,
        name: form.name,
        phone: trimmed.phone,
        school_type: form.school_type as SchoolType,
        school_name: form.school_name,
        grade: form.grade as typeof GRADES[number],
        coach_id: form.coach_id,
      });
      if (result?.error) {
        setServerError(result.error);
      }
    } catch {
      setServerError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-sidebar text-2xl font-bold text-[var(--color-text)]">학생 회원가입</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            가입 즉시 승인되며, 학교·학년·담당 코치 선택은 필수입니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <SelectField
            label="학교 유형"
            value={form.school_type}
            onChange={(v) => handleChange("school_type", v)}
            options={SCHOOL_TYPES.map((t) => ({ value: t, label: t }))}
            placeholder="학교 유형을 선택하세요"
            error={errors.school_type}
          />

          <SelectField
            label="학교명"
            value={form.school_name}
            onChange={(v) => handleChange("school_name", v)}
            options={schoolOptions.map((s) => ({ value: s, label: s }))}
            placeholder={form.school_type ? "학교를 선택하세요" : "학교 유형을 먼저 선택하세요"}
            disabled={!form.school_type}
            error={errors.school_name}
          />

          <SelectField
            label="학년"
            value={form.grade}
            onChange={(v) => handleChange("grade", v)}
            options={GRADES.map((g) => ({ value: g, label: g }))}
            placeholder="학년을 선택하세요"
            error={errors.grade}
          />

          <InputField label="이름" value={form.name} onChange={(v) => handleChange("name", v)} placeholder="이름을 입력하세요" error={errors.name} />
          <InputField
            label="연락처"
            value={form.phone}
            onChange={(v) => handleChange("phone", v)}
            placeholder="010-0000-0000"
            error={errors.phone}
            inputMode="tel"
            autoComplete="tel"
            maxLength={13}
          />
          <InputField
            label="이메일"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
            placeholder="example@email.com"
            type="email"
            error={errors.email}
            autoComplete="email"
          />
          <InputField label="비밀번호" value={form.password} onChange={(v) => handleChange("password", v)} placeholder="6자 이상" type="password" error={errors.password} />

          <SelectField
            label="담당 코치"
            value={form.coach_id}
            onChange={(v) => handleChange("coach_id", v)}
            options={filteredCoaches.map((c) => ({
              value: c.id,
              label: `${c.name}${c.affiliation ? ` | ${c.affiliation}` : ""}`,
            }))}
            placeholder="담당 코치를 선택하세요"
            error={errors.coach_id}
          />

          <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-4 py-3 text-sm text-[var(--color-primary)]">
            {filteredCoaches.length > 0
              ? "담당 코치 선택 목록에는 승인된 코치만 노출됩니다."
              : "선택 가능한 코치가 없습니다. 관리자에게 코치 승인/학교 배정을 요청해주세요."}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              {loading ? "처리 중..." : "학생 회원가입"}
            </span>
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/signup/coach"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              코치로 가입하기
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1 text-[var(--color-primary)] hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              로그인으로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
  inputMode,
  autoComplete,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors bg-[var(--color-bg-base)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-[var(--glass-border)] focus:border-[var(--color-primary)]/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors bg-[var(--color-bg-base)] text-[var(--color-text)] ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-[var(--glass-border)] focus:border-[var(--color-primary)]/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
