"use client";

import Image from "next/image";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MODOO_REPORT_HREF = "/reports/modoo-report.html";
const MODOO_REPORT_TITLE = "모두(Modoo) 보고서";
const MODOO_REPORT_INTRO =
  "본 분석 보고서는 한국창업융합연구원에서 총 2172건의 아이디어를 분석한 보고서 입니다.";
const MODOO_REPORT_COPYRIGHT =
  "저작권 © 한국창업융합연구원. 무단 전재·재배포 및 상업적 이용을 금합니다.";

/** `public/images/games/modoo.png` 교체 시 숫자만 올리면 `/_next/image`·브라우저 캐시를 끊을 수 있습니다. */
const MODOO_ASSET_REV = "3";
const MODOO_IMG_SRC = `/images/games/modoo.png?v=${MODOO_ASSET_REV}`;
const MODOO_IMG_ALT =
  "Hot Issue — 모두(Modoo) 학습 게임·콘텐츠 미리보기";

interface QuickStatsProps {
  className?: string;
}

export function QuickStats({ className }: QuickStatsProps) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl glass card-hover",
        className
      )}
      aria-label="Hot Issue"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--glass-border)] px-5 py-4">
        <h2 className="font-sidebar text-lg font-semibold text-[var(--color-text)]">
          Hot Issue
        </h2>
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 font-sidebar"
            onClick={() => setReportOpen(true)}
          >
            <FileText className="size-4" aria-hidden />
            보고서 보기
          </Button>
          <DialogContent
            showClose
            className="flex h-[90vh] max-h-[90vh] w-full max-w-[min(96vw,1120px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,1120px)]"
          >
            <DialogHeader className="shrink-0 border-b border-gray-200 px-4 py-3 pr-12">
              <DialogTitle className="font-sidebar text-base text-gray-900">
                {MODOO_REPORT_TITLE}
              </DialogTitle>
              <DialogDescription className="font-main text-sm leading-relaxed text-gray-600">
                {MODOO_REPORT_INTRO}
              </DialogDescription>
              <p className="font-main text-xs leading-relaxed text-gray-500">
                {MODOO_REPORT_COPYRIGHT}
              </p>
            </DialogHeader>
            <iframe
              title={MODOO_REPORT_TITLE}
              src={MODOO_REPORT_HREF}
              className="min-h-0 w-full flex-1 border-0 bg-white"
              loading="lazy"
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative w-full overflow-hidden rounded-b-2xl bg-[var(--glass-bg)]">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={MODOO_IMG_SRC}
            alt={MODOO_IMG_ALT}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 820px"
            priority={false}
          />
        </div>
      </div>
    </article>
  );
}
