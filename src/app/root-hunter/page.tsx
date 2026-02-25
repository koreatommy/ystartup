import Link from "next/link";
import { RootHunter } from "@/components/RootHunter";
import { ChevronLeft } from "lucide-react";

export default function RootHunterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--glass-bg-hover)]"
          aria-label="메인으로 돌아가기"
        >
          <ChevronLeft className="h-4 w-4" />
          워크북으로
        </Link>
        <span className="font-main text-sm text-[var(--color-text-muted)]">
          5 Whys · 뿌리를 찾아라
        </span>
      </header>
      <main className="min-h-0 flex-1">
        <RootHunter />
      </main>
    </div>
  );
}
