"use client";

import { useRef, useEffect } from "react";
import type * as pdfjsLib from "pdfjs-dist";

interface PdfCanvasProps {
  pdfDocument: pdfjsLib.PDFDocumentProxy | null;
  pageNumber: number;
  scale: number;
  onPageRendered?: (width: number, height: number) => void;
}

export function PdfCanvas({
  pdfDocument,
  pageNumber,
  scale,
  onPageRendered,
}: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;

    let isMounted = true;
    let renderTask: any = null;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const renderPage = async () => {
      try {
        // Cancel previous render task if it exists
        if (renderTask) {
          renderTask.cancel();
        }

        const page = await pdfDocument.getPage(pageNumber);
        
        if (!isMounted) {
          page.cleanup();
          return;
        }

        const viewport = page.getViewport({ scale });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        } as any;

        renderTask = page.render(renderContext);

        try {
          await renderTask.promise;
          
          if (isMounted && onPageRendered) {
            onPageRendered(viewport.width, viewport.height);
          }
        } catch (error: any) {
          if (error?.name === 'RenderingCancelledException') {
            // Rendering was cancelled, which is expected during cleanup
            return;
          }
          throw error;
        }

        page.cleanup();
      } catch (error) {
        if (!isMounted) return;
        console.error("Error rendering page:", error);
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDocument, pageNumber, scale, onPageRendered]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ touchAction: "none" }}
    />
  );
}
