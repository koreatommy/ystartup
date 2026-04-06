"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  listAdminMemosPaged,
  createAdminMemo,
  updateAdminMemo,
  deleteAdminMemo,
} from "@/lib/actions/admin-memos";
import type { AdminMemo, PagedResult } from "@/types/member";

const MEMO_PAGE_SIZE = 10;
const MAX_LEN = 500;

function formatMemoDate(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminMemosSection() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PagedResult<AdminMemo> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newText, setNewText] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const load = useCallback(async (p: number) => {
    const res = await listAdminMemosPaged({ page: p, pageSize: MEMO_PAGE_SIZE });
    if ("error" in res) {
      setLoadError(res.error);
      setResult(null);
      return;
    }
    setLoadError(null);
    if (res.items.length === 0 && res.total > 0 && p > 1) {
      setPage(1);
      return;
    }
    setResult(res);
  }, []);

  useEffect(() => {
    void load(page);
  }, [page, load]);

  const totalPages =
    result && result.pageSize > 0 ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  const start =
    result && result.total > 0 ? (result.page - 1) * result.pageSize + 1 : 0;
  const end =
    result && result.total > 0 ? Math.min(result.page * result.pageSize, result.total) : 0;

  async function handleAdd() {
    const trimmed = newText.trim();
    if (!trimmed) {
      window.alert("메모 내용을 입력해주세요.");
      return;
    }
    setBusy(true);
    const res = await createAdminMemo(trimmed);
    setBusy(false);
    if ("error" in res) {
      window.alert(res.error);
      return;
    }
    setNewText("");
    if (page !== 1) setPage(1);
    else await load(1);
  }

  function startEdit(m: AdminMemo) {
    setEditingId(m.id);
    setEditText(m.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(id: string) {
    setBusy(true);
    const res = await updateAdminMemo(id, editText);
    setBusy(false);
    if ("error" in res) {
      window.alert(res.error);
      return;
    }
    cancelEdit();
    await load(page);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("이 메모를 삭제할까요?")) return;
    setBusy(true);
    const res = await deleteAdminMemo(id);
    setBusy(false);
    if ("error" in res) {
      window.alert(res.error);
      return;
    }
    await load(page);
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">관리자 메모</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          슈퍼관리자만 조회·편집할 수 있는 한 줄 메모입니다.
        </p>
      </div>

      {loadError && (
        <p className="mb-4 whitespace-pre-line rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {loadError}
        </p>
      )}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          maxLength={MAX_LEN}
          disabled={busy}
          placeholder="한 줄 메모 입력"
          className="min-w-0 flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleAdd()}
          className="shrink-0 rounded-xl gradient-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          <span className="relative z-10">추가</span>
        </button>
      </div>
      <p className="mb-4 text-xs text-[var(--color-text-subtle)]">
        최대 {MAX_LEN}자 · {newText.length}/{MAX_LEN}
      </p>

      <div className="space-y-2">
        {(result?.items ?? []).map((m) => (
          <div
            key={m.id}
            className="flex flex-col gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
          >
            {editingId === m.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  maxLength={MAX_LEN}
                  disabled={busy}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
                />
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void saveEdit(m.id)}
                    className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={cancelEdit}
                    className="rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]" title={m.content}>
                    {m.content}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {formatMemoDate(m.created_at)}
                    {m.author_name ? ` · ${m.author_name}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => startEdit(m)}
                    className="rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDelete(m.id)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {result && result.items.length === 0 && !loadError && (
          <p className="py-6 text-center text-sm text-[var(--color-text-subtle)]">등록된 메모가 없습니다.</p>
        )}
      </div>

      {result && result.total > 0 && (
        <div className="mt-4 flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">
            {result.total === 0
              ? "0건"
              : `${start.toLocaleString("ko-KR")}–${end.toLocaleString("ko-KR")} / 전체 ${result.total.toLocaleString("ko-KR")}건`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={result.page <= 1 || busy}
              onClick={() => setPage((p) => p - 1)}
              className={cn(
                "rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-sm font-medium transition-colors",
                result.page <= 1 || busy
                  ? "cursor-not-allowed opacity-40"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]",
              )}
            >
              이전
            </button>
            <span className="min-w-[4.5rem] text-center text-sm text-[var(--color-text-muted)]">
              {result.page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={result.page >= totalPages || busy}
              onClick={() => setPage((p) => p + 1)}
              className={cn(
                "rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-sm font-medium transition-colors",
                result.page >= totalPages || busy
                  ? "cursor-not-allowed opacity-40"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]",
              )}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
