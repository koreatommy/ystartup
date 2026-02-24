"use client";

import { useRef, useState, useEffect } from "react";
import { DashboardLayoutProps } from "@/types/dashboard";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollToTop } from "./ScrollToTop";
import { MobileNav } from "./MobileNav";

export function DashboardLayout({
  selectedId,
  onSelect,
}: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLElement>(null);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 데스크톱 사이드바 */}
      <Sidebar selectedId={selectedId} onSelect={onSelect} />

      {/* 메인 영역 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 헤더 */}
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          onIndexClick={() => onSelect("")}
          isMenuOpen={mobileNavOpen}
        />

        {/* 메인 콘텐츠 */}
        <main
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-auto"
        >
          {selectedId === "" && (
            <ScrollProgress scrollContainerRef={scrollContainerRef} />
          )}
          <div className="mx-auto max-w-[1248px] px-4 py-6 md:px-6 lg:px-8">
            <MainContent chapterId={selectedId} onSelectChapter={onSelect} />
          </div>
        </main>

        {/* 스크롤 탑 버튼 */}
        <ScrollToTop scrollContainerRef={scrollContainerRef} />
      </div>

      {/* 모바일 네비게이션 */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </div>
  );
}
