"use client";

import { DashboardHome } from "@/components/dashboard";
import { getWorkbook } from "@/data/workbooks";
import { WorkbookCard } from "./WorkbookCard";
import { WorkbookItemThumbnail } from "./WorkbookItemThumbnail";
import { chapters } from "@/data/chapters";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  chapterId: string;
  onSelectChapter?: (id: string) => void;
}

export function MainContent({ chapterId, onSelectChapter }: MainContentProps) {
  // 대시보드 홈
  if (chapterId === "") {
    return (
      <DashboardHome
        selectedId={chapterId}
        onSelect={onSelectChapter ?? (() => {})}
      />
    );
  }

  // 워크북 상세
  const workbook = getWorkbook(chapterId);
  const itemThumbnails = workbook.items;
  
  // 이전/다음 챕터 찾기
  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="flex flex-col gap-8">
      {/* 워크북 카드 */}
      <WorkbookCard content={workbook} />

      {/* 워크북 항목 썸네일 */}
      {itemThumbnails.length > 0 && (
        <section aria-label="워크북 항목 썸네일">
          <h2 className="mb-4 font-main text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            {workbook.wbId} 항목
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {itemThumbnails.map((item, index) => (
              <WorkbookItemThumbnail key={index} item={item} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* 이전/다음 챕터 네비게이션 */}
      <nav className="flex items-center justify-between gap-4 pt-4" aria-label="챕터 네비게이션">
        {prevChapter ? (
          <Button
            variant="glass"
            onClick={() => onSelectChapter?.(prevChapter.id)}
            className="group gap-2"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{prevChapter.id}. {prevChapter.titleKo}</span>
            <span className="sm:hidden">이전</span>
          </Button>
        ) : (
          <div />
        )}
        
        {nextChapter ? (
          <Button
            variant="gradient"
            onClick={() => onSelectChapter?.(nextChapter.id)}
            className="group gap-2"
          >
            <span className="hidden sm:inline">{nextChapter.id}. {nextChapter.titleKo}</span>
            <span className="sm:hidden">다음</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
