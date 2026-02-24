"use client";

import { useState } from "react";
import Image from "next/image";
import type { WorkbookItem } from "@/types/workbook";
import { Eye, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfPreviewModal } from "./PdfPreviewModal";

interface WorkbookItemThumbnailProps {
  item: WorkbookItem;
  index: number;
}

const CIRCLE_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

function getBadgeDisplay(item: { badgeNumber?: string }, index: number): string {
  if (item.badgeNumber === "1·2") return "①·②";
  if (item.badgeNumber === "4·5") return "④·⑤";
  if (item.badgeNumber === "6·7") return "⑥·⑦";
  if (item.badgeNumber === "7·8") return "⑦·⑧";
  if (item.badgeNumber != null) {
    const n = parseInt(item.badgeNumber, 10);
    if (Number.isInteger(n) && n >= 1 && n <= 9) return CIRCLE_NUMBERS[n - 1];
    return item.badgeNumber;
  }
  return CIRCLE_NUMBERS[index] ?? String(index + 1);
}

export function WorkbookItemThumbnail({ item, index }: WorkbookItemThumbnailProps) {
  const circleNum = getBadgeDisplay(item, index);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = () => {
    if (item.pdfPath) {
      setIsModalOpen(true);
    }
  };

  const handlePrint = () => {
    if (item.pdfPath) {
      const printWindow = window.open(item.pdfPath, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }
    }
  };

  const handleDownload = () => {
    if (item.pdfPath) {
      const link = document.createElement("a");
      link.href = item.pdfPath;
      link.download = item.pdfPath.split("/").pop() || "download.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <figure className="group flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl glass card-hover">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--glass-bg)] cursor-pointer"
          onClick={handlePreview}
        >
          {item.thumbnailPath ? (
            <>
              <Image
                src={item.thumbnailPath}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center">
                <Eye className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-main text-5xl font-light text-gradient-primary">{circleNum}</span>
            </div>
          )}
        </div>
        
        <figcaption className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="line-clamp-2 font-main text-sm font-semibold leading-snug text-[var(--color-text)]">
              {item.label}
            </span>
            <span className="line-clamp-2 font-main text-xs leading-relaxed text-[var(--color-text-muted)]">
              {item.subtitle}
            </span>
          </div>

          {item.pdfPath && (
            <div className="flex gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handlePreview}
                className="flex-1 gap-1.5 text-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>미리보기</span>
              </Button>
              
              <Button
                variant="glass"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
              </Button>
              
              <Button
                variant="glass"
                size="sm"
                onClick={handleDownload}
                className="gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </figcaption>
      </figure>

      {item.pdfPath && (
        <PdfPreviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pdfPath={item.pdfPath}
          title={item.label}
        />
      )}
    </>
  );
}
