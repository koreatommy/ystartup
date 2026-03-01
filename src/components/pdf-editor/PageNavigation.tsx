"use client";

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function PageNavigation({
  currentPage,
  totalPages,
  scale,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: PageNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 p-2 bg-[#323639] border-t border-gray-700">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1 px-2 sm:px-3 text-gray-300 hover:bg-[#4a4d50] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden md:inline">이전</span>
        </Button>

        <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value, 10);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-center border border-gray-600 bg-[#3a3d40] text-white rounded text-xs sm:text-sm"
            min={1}
            max={totalPages}
          />
          <span className="text-xs sm:text-sm text-gray-300">/ {totalPages}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="gap-1 px-2 sm:px-3 text-gray-300 hover:bg-[#4a4d50] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
        >
          <span className="hidden md:inline">다음</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={scale <= 0.5}
          title="축소"
          className="px-2 sm:px-3 text-gray-300 hover:bg-[#4a4d50] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
        >
          <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        <button
          onClick={onResetZoom}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-300 hover:bg-[#4a4d50] hover:text-white rounded transition-colors"
          title="확대/축소 초기화"
        >
          {Math.round(scale * 100)}%
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={scale >= 3}
          title="확대"
          className="px-2 sm:px-3 text-gray-300 hover:bg-[#4a4d50] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
        >
          <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetZoom}
          className="hidden lg:flex gap-1 px-2 sm:px-3 text-gray-300 hover:bg-[#4a4d50] hover:text-white"
          title="화면 맞춤"
        >
          <Maximize className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs">맞춤</span>
        </Button>
      </div>
    </div>
  );
}
