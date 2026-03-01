"use client";

import { useRef, useEffect, useMemo } from "react";
import type { Annotation, AnnotationType, PenAnnotation, ShapeAnnotation, TextAnnotation } from "@/types/annotation";
import { useDrawing } from "@/hooks/useDrawing";

interface AnnotationCanvasProps {
  width: number;
  height: number;
  annotations: Annotation[];
  scale: number;
  currentPage: number;
  currentTool: string | null;
  currentColor: string;
  currentStrokeWidth: number;
  shapeType?: string;
  onAnnotationComplete: (annotation: Annotation) => void;
  onAnnotationRemove: (annotationId: string) => void;
}

export function AnnotationCanvas({
  width,
  height,
  annotations,
  scale,
  currentPage,
  currentTool,
  currentColor,
  currentStrokeWidth,
  shapeType,
  onAnnotationComplete,
  onAnnotationRemove,
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useDrawing({
    canvasRef,
    currentTool: currentTool as AnnotationType | "eraser" | null,
    currentColor,
    currentStrokeWidth,
    currentPage,
    onAnnotationComplete,
    onAnnotationRemove,
    annotations,
    scale,
    shapeType,
  });

  // Memoize page annotations to avoid unnecessary re-renders
  const pageAnnotations = useMemo(
    () => annotations.filter((a) => a.pageNumber === currentPage),
    [annotations, currentPage]
  );

  // Create a key for annotations to track actual changes
  const annotationsKey = useMemo(
    () => pageAnnotations.map(a => a.id).join(','),
    [pageAnnotations]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only set size if changed to avoid clearing during drawing
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, width, height);

    pageAnnotations.forEach((annotation) => {
      if (annotation.type === "pen" || annotation.type === "highlighter") {
        const penAnnotation = annotation as PenAnnotation;
        context.strokeStyle = penAnnotation.color;
        context.lineWidth = penAnnotation.strokeWidth * scale;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.globalAlpha = penAnnotation.opacity;

        context.beginPath();
        penAnnotation.points.forEach((point, index) => {
          if (index === 0) {
            context.moveTo(point.x * scale, point.y * scale);
          } else {
            context.lineTo(point.x * scale, point.y * scale);
          }
        });
        context.stroke();
        context.globalAlpha = 1;
      } else if (annotation.type === "shape") {
        const shapeAnnotation = annotation as ShapeAnnotation;
        context.strokeStyle = shapeAnnotation.color;
        context.lineWidth = shapeAnnotation.strokeWidth * scale;
        context.globalAlpha = shapeAnnotation.opacity;

        const startX = shapeAnnotation.startX * scale;
        const startY = shapeAnnotation.startY * scale;
        const endX = shapeAnnotation.endX * scale;
        const endY = shapeAnnotation.endY * scale;

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
          const arrowLength = 15 * scale;
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
        context.font = `${textAnnotation.fontSize * scale}px Arial`;
        context.globalAlpha = textAnnotation.opacity;
        context.fillText(
          textAnnotation.content,
          textAnnotation.x * scale,
          textAnnotation.y * scale
        );
        context.globalAlpha = 1;
      }
    });
  }, [annotationsKey, width, height, scale, pageAnnotations]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 cursor-crosshair"
      style={{ touchAction: "none" }}
    />
  );
}
