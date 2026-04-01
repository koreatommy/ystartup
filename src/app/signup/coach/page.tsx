"use client";

import { useState, type HTMLAttributes } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, UserPlus } from "lucide-react";
import { formatKoreanMobileHyphenInput, validateCoachSignup } from "@/lib/validations/member";
import { signupCoach } from "@/lib/actions/auth";

export default function CoachSignupPage() {
  const [form, setForm] = useState({
    affiliation: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(field: string, value: string) {
    const nextValue =
      field === "phone" ? formatKoreanMobileHyphenInput(value) : value;
    setForm((prev) => ({ ...prev, [field]: nextValue }));
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
    const validationErrors = validateCoachSignup(trimmed);
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
      const result = await signupCoach(trimmed);
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
          <h1 className="font-sidebar text-2xl font-bold text-[var(--color-text)]">코치 가입 신청</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            가입 신청 후 슈퍼관리자 승인 후 사용 가능합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <InputField label="소속" value={form.affiliation} onChange={(v) => handleChange("affiliation", v)} placeholder="소속기관을 입력하세요" error={errors.affiliation} />
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

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
            신청 완료 후 관리자 승인 전까지 로그인 및 학생 조회는 제한됩니다.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              {loading ? "처리 중..." : "코치 가입 신청"}
            </span>
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/signup/student"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              학생으로 가입하기
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
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors bg-[var(--color-bg-base)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-[var(--glass-border)] focus:border-[var(--color-primary)]/50"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
