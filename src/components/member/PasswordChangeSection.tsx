"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { updateMyPassword } from "@/lib/actions/members";

interface PasswordChangeSectionProps {
  className?: string;
}

export function PasswordChangeSection({ className }: PasswordChangeSectionProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    setMessage(null);
    if (newPassword.trim().length < 6) {
      setMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirm) {
      setMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    const res = await updateMyPassword(newPassword);
    setLoading(false);
    if ("error" in res && res.error) {
      setMessage(res.error);
      return;
    }
    setMessage("비밀번호가 변경되었습니다. 다음 로그인부터 새 비밀번호를 사용하세요.");
    setNewPassword("");
    setConfirm("");
  }

  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">비밀번호 변경</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          새 비밀번호와 확인을 입력한 뒤 변경을 누르세요.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">새 비밀번호</span>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-base)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]/50"
            placeholder="6자 이상"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm text-[var(--color-text-muted)]">새 비밀번호 확인</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-base)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]/50"
            placeholder="한 번 더 입력"
          />
        </label>
      </div>
      {message && (
        <p
          className={cn(
            "mt-3 text-sm",
            message.includes("변경되었습니다") ? "text-emerald-500" : "text-red-400",
          )}
        >
          {message}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={loading}
          className="rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          <span className="relative z-10">{loading ? "처리 중…" : "비밀번호 변경"}</span>
        </button>
      </div>
    </div>
  );
}
