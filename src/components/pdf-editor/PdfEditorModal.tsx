"use client";

import { useState, useEffect, useCallback } from "react";
import { Printer, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePdfDocument } from "@/hooks/usePdfDocument";
import { useAnnotations } from "@/hooks/useAnnotations";
import { PdfCanvas } from "./PdfCanvas";
import { AnnotationCanvas } from "./AnnotationCanvas";
import { EditorToolbar } from "./EditorToolbar";
import { PageNavigation } from "./PageNavigation";

interface PdfEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string;
  title: string;
}

export function PdfEditorModal({
  isOpen,
  onClose,
  pdfPath,
  title,
}: PdfEditorModalProps) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const onPageRendered = useCallback((width: number, height: number) => {
    setCanvasSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  const {
    pdfDocument,
    currentPage,
    totalPages,
    scale,
    isLoading,
    error,
    setCurrentPage,
    zoomIn,
    zoomOut,
    resetZoom,
  } = usePdfDocument(pdfPath);

  const {
    annotations,
    selectedTool,
    selectedColor,
    selectedStrokeWidth,
    selectedShape,
    addAnnotation,
    removeAnnotation,
    undo,
    redo,
    canUndo,
    canRedo,
    setSelectedTool,
    setSelectedColor,
    setSelectedStrokeWidth,
    setSelectedShape,
    getAnnotationsForPage,
  } = useAnnotations();

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

  const handlePrint = useCallback(() => {
    const printWindow = window.open(pdfPath, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
  }, [pdfPath]);

  const handleDownload = useCallback(async () => {
    const { exportPdfWithAnnotations } = await import("@/lib/pdfExport");
    
    try {
      await exportPdfWithAnnotations(pdfPath, annotations, title);
    } catch (error) {
      console.error("Export error:", error);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  }, [pdfPath, annotations, title]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#323639] shadow-2xl [color-scheme:light]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
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

        <EditorToolbar
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          selectedStrokeWidth={selectedStrokeWidth}
          onStrokeWidthChange={setSelectedStrokeWidth}
          selectedShape={selectedShape}
          onShapeChange={setSelectedShape}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />

        <div className="flex-1 overflow-auto bg-[#525659]">
          <div className="min-h-full flex items-start justify-center p-4">
            {isLoading && (
              <div className="text-center mt-20">
                <div className="text-lg font-medium text-white">PDF 로딩 중...</div>
              </div>
            )}

            {error && (
              <div className="text-center mt-20">
                <div className="text-lg font-medium text-red-600">오류: {error}</div>
              </div>
            )}

            {pdfDocument && !isLoading && !error && (
              <div className="relative shadow-2xl" style={{ width: canvasSize.width, height: canvasSize.height }}>
                <PdfCanvas
                  pdfDocument={pdfDocument}
                  pageNumber={currentPage}
                  scale={scale}
                  onPageRendered={onPageRendered}
                />
                <AnnotationCanvas
                  width={canvasSize.width}
                  height={canvasSize.height}
                  annotations={getAnnotationsForPage(currentPage)}
                  scale={scale}
                  currentPage={currentPage}
                  currentTool={selectedTool}
                  currentColor={selectedColor}
                  currentStrokeWidth={selectedStrokeWidth}
                  shapeType={selectedShape}
                  onAnnotationComplete={addAnnotation}
                  onAnnotationRemove={removeAnnotation}
                />
              </div>
            )}
          </div>
        </div>

        <PageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          scale={scale}
          onPageChange={setCurrentPage}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
        />
      </div>
    </div>
  );
}
