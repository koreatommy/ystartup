"use client";

import { useEffect } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string;
  title: string;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  pdfPath,
  title,
}: PdfPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open(pdfPath, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop() || "download.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl [color-scheme:light]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="font-main text-lg font-semibold text-gray-900 line-clamp-1">
            {title}
          </h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-400"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">프린트</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-400"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">저장</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="ml-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-50">
          <iframe
            src={pdfPath}
            className="h-full w-full"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
