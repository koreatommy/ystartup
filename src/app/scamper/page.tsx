import Link from "next/link";
import { ScamperGame } from "@/components/ScamperGame";
import { ChevronLeft } from "lucide-react";

export default function ScamperPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex shrink-0 items-center gap-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--glass-bg-hover)]"
          aria-label="메인으로 돌아가기"
        >
          <ChevronLeft className="h-4 w-4" />
          워크북으로
        </Link>
        <span className="font-main text-sm text-[var(--color-text-muted)]">
          SCAMPER · 창의적 사고 게임
        </span>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">
        <ScamperGame />
      </main>
    </div>
  );
}
