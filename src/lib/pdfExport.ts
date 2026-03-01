"use client";

import type { Annotation, PenAnnotation, ShapeAnnotation, TextAnnotation } from "@/types/annotation";

export async function exportPdfWithAnnotations(
  pdfUrl: string,
  annotations: Annotation[],
  filename: string
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called in the browser");
  }

  const jsPDF = (await import("jspdf")).default;
  const pdfjsLib = await import("pdfjs-dist");
  
  // Use local worker from node_modules
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    
    const pdfWidth = viewport.width * 0.75;
    const pdfHeight = viewport.height * 0.75;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = new (jsPDF as any)({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
    });

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      if (pageNum > 1) {
        doc.addPage();
      }

      const page = await pdf.getPage(pageNum);
      const pageViewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;

      canvas.width = pageViewport.width;
      canvas.height = pageViewport.height;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({
        canvasContext: context,
        viewport: pageViewport,
      } as any).promise;

      const pageAnnotations = annotations.filter((a) => a.pageNumber === pageNum);

      pageAnnotations.forEach((annotation) => {
        if (annotation.type === "pen" || annotation.type === "highlighter") {
          const penAnnotation = annotation as PenAnnotation;
          context.strokeStyle = penAnnotation.color;
          context.lineWidth = penAnnotation.strokeWidth * 2;
          context.lineCap = "round";
          context.lineJoin = "round";
          context.globalAlpha = penAnnotation.opacity;

          context.beginPath();
          penAnnotation.points.forEach((point, index) => {
            if (index === 0) {
              context.moveTo(point.x * 2, point.y * 2);
            } else {
              context.lineTo(point.x * 2, point.y * 2);
            }
          });
          context.stroke();
          context.globalAlpha = 1;
        } else if (annotation.type === "shape") {
          const shapeAnnotation = annotation as ShapeAnnotation;
          context.strokeStyle = shapeAnnotation.color;
          context.lineWidth = shapeAnnotation.strokeWidth * 2;
          context.globalAlpha = shapeAnnotation.opacity;

          const startX = shapeAnnotation.startX * 2;
          const startY = shapeAnnotation.startY * 2;
          const endX = shapeAnnotation.endX * 2;
          const endY = shapeAnnotation.endY * 2;

          context.beginPath();
          
          if (shapeAnnotation.shapeType === "rectangle") {
            context.rect(startX, startY, endX - startX, endY - startY);
          } else if (shapeAnnotation.shapeType === "ellipse") {
            const centerX = (startX + endX) / 2;
            const centerY = (startY + endY) / 2;
            const radiusX = Math.abs(endX - startX) / 2;
            const radiusY = Math.abs(endY - startY) / 2;
            context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          } else if (shapeAnnotation.shapeType === "line") {
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
          } else if (shapeAnnotation.shapeType === "arrow") {
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrowLength = 30;
            context.lineTo(
              endX - arrowLength * Math.cos(angle - Math.PI / 6),
              endY - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            context.moveTo(endX, endY);
            context.lineTo(
              endX - arrowLength * Math.cos(angle + Math.PI / 6),
              endY - arrowLength * Math.sin(angle + Math.PI / 6)
            );
          }

          context.stroke();
          
          if (shapeAnnotation.fill) {
            context.fillStyle = shapeAnnotation.fill;
            context.fill();
          }
          
          context.globalAlpha = 1;
        } else if (annotation.type === "text") {
          const textAnnotation = annotation as TextAnnotation;
          context.fillStyle = textAnnotation.color;
          context.font = `${textAnnotation.fontSize * 2}px Arial`;
          context.globalAlpha = textAnnotation.opacity;
          context.fillText(
            textAnnotation.content,
            textAnnotation.x * 2,
            textAnnotation.y * 2
          );
          context.globalAlpha = 1;
        }
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      doc.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    }

    const outputFilename = filename.endsWith(".pdf")
      ? `annotated_${filename}`
      : `annotated_${filename}.pdf`;

    doc.save(outputFilename);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}
