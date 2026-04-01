"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, StatCard, InfoCard } from "@/components/member";
import { updateMyCoachPadletUrls } from "@/lib/actions/members";
import { MAX_COACH_PADLET_URLS } from "@/lib/validations/member";
import { cn } from "@/lib/utils";
import type { PadletUrlEntry, Profile } from "@/types/member";

function inputClass() {
  return cn(
    "w-full rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-base)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors",
    "focus:border-[var(--color-primary)]/50",
  );
}

interface Props {
  profile: Profile;
  selected: string;
  /** `CoachContent`의 `coachAnalytics`와 동일 위치에 삽입 */
  analyticsSlot: React.ReactNode;
}

export function CoachPadletUrlsSection({ profile, selected, analyticsSlot }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState<PadletUrlEntry[]>(() => [...profile.padlet_urls]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEntries([...profile.padlet_urls]);
  }, [profile.padlet_urls]);

  function addRow() {
    setMessage(null);
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), url: "" }]);
  }

  function removeRow(id: string) {
    setMessage(null);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function updateUrl(id: string, url: string) {
    setMessage(null);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, url } : e)));
  }

  async function handleSave() {
    setMessage(null);
    const toSave = entries.map((e) => ({ id: e.id, url: e.url.trim() })).filter((e) => e.url.length > 0);
    setSaving(true);
    const res = await updateMyCoachPadletUrls(toSave);
    setSaving(false);
    if ("error" in res && res.error) {
      setMessage(res.error);
      return;
    }
    setMessage("저장되었습니다.");
    router.refresh();
  }

  const atLimit = entries.length >= MAX_COACH_PADLET_URLS;

  return (
    <>
      <SectionHeader
        badge="Padlet"
        title="Padlet 주소 관리"
        description="담당 학생 안내용 Padlet 보드 URL을 여러 개 등록할 수 있습니다. https://…padlet.com… 주소만 저장됩니다."
        selected={selected}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="저장된 주소" value={String(profile.padlet_urls.length)} hint="서버에 반영된 수" />
        <StatCard label="최대 개수" value={String(MAX_COACH_PADLET_URLS)} hint="코치당 상한" />
        <StatCard label="편집 중 행" value={String(entries.length)} hint="빈 URL은 저장 시 제외" />
        <StatCard label="프로토콜" value="https" hint="필수" />
      </div>
      {analyticsSlot}
      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="glass min-w-0 rounded-2xl p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Padlet URL 목록</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={atLimit}
                onClick={addRow}
                className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                주소 추가
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSave()}
                className="rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "저장 중…" : "저장"}
              </button>
            </div>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              등록된 주소가 없습니다. 「주소 추가」로 행을 만든 뒤 Padlet 링크를 입력하고 저장하세요.
            </p>
          ) : (
            <ul className="space-y-3">
              {entries.map((e, index) => (
                <li
                  key={e.id}
                  className="flex min-w-0 flex-col gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)]/40 p-3 sm:flex-row sm:items-center"
                >
                  <span className="shrink-0 text-xs text-[var(--color-text-subtle)] sm:w-8">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <input
                      type="url"
                      value={e.url}
                      onChange={(ev) => updateUrl(e.id, ev.target.value)}
                      placeholder="https://padlet.com/…"
                      className={inputClass()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {e.url.trim() ? (
                      <a
                        href={e.url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--glass-bg)]"
                      >
                        열기
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeRow(e.id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {message ? (
            <p
              className={cn(
                "mt-4 text-sm",
                message === "저장되었습니다." ? "text-emerald-500" : "text-red-400",
              )}
            >
              {message}
            </p>
          ) : null}

          <p className="mt-4 text-xs text-[var(--color-text-subtle)]">
            빈 URL 행은 저장 시 자동으로 제외됩니다. 삭제는 행의 「삭제」를 누른 뒤 저장하면 서버에서도 제거됩니다.
          </p>
        </div>

        <InfoCard
          title="입력 규칙"
          rows={[
            { label: "허용 도메인", value: "padlet.com 포함 호스트" },
            { label: "프로토콜", value: "https만" },
            { label: "중복", value: "동일 URL 불가" },
            { label: "개수", value: `최대 ${MAX_COACH_PADLET_URLS}개` },
          ]}
        />
      </div>
    </>
  );
}
