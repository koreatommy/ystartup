"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, LogIn } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4">
      <div className="w-full max-w-md text-center text-[var(--color-text-muted)]">로딩 중...</div>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      unstable_rethrow(err);
      setError("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-sidebar text-3xl font-bold text-gradient-primary">Y-START</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            창업 교육 회원관리 시스템
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {registered === "student" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              학생 회원가입이 완료되었습니다. 로그인해주세요.
            </div>
          )}
          {registered === "coach" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              코치 가입 신청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-base)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)]/50"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-base)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)]/50"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              {loading ? "로그인 중..." : "로그인"}
            </span>
          </button>

          <div className="flex items-center justify-center gap-4 text-sm">
            <Link
              href="/signup/student"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              학생 회원가입
            </Link>
            <span className="text-[var(--color-text-subtle)]">|</span>
            <Link
              href="/signup/coach"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              코치 가입 신청
            </Link>
          </div>

          <div className="flex justify-center border-t border-[var(--glass-border)] pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              랜딩 페이지로
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
