"use client";

import { Sparkles, Clock } from "lucide-react";
import { logout } from "@/lib/actions/auth";

export default function PendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <Clock className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="font-sidebar text-2xl font-bold text-[var(--color-text)]">
          승인 대기 중
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          회원가입이 완료되었지만, 아직 관리자 승인이 필요합니다.
          <br />
          승인 완료 후 시스템을 이용하실 수 있습니다.
        </p>
        <div className="mt-8 glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3">
            <span className="text-sm text-[var(--color-text-muted)]">현재 상태</span>
            <span className="text-sm font-medium text-amber-400">승인 대기</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3">
            <span className="text-sm text-[var(--color-text-muted)]">안내</span>
            <span className="text-sm font-medium text-[var(--color-text)]">관리자에게 문의하세요</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-all hover:bg-[var(--glass-bg-hover)]"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
