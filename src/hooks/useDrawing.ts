"use client";

import { useRef, useCallback, useEffect } from "react";
import type { Annotation, AnnotationType, PenAnnotation, ShapeAnnotation, ShapeType } from "@/types/annotation";

export interface UseDrawingOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentTool: AnnotationType | "eraser" | null;
  currentColor: string;
  currentStrokeWidth: number;
  currentPage: number;
  onAnnotationComplete: (annotation: Annotation) => void;
  onAnnotationRemove: (annotationId: string) => void;
  annotations: Annotation[];
  scale: number;
  shapeType?: string;
}

export function useDrawing({
  canvasRef,
  currentTool,
  currentColor,
  currentStrokeWidth,
  currentPage,
  onAnnotationComplete,
  onAnnotationRemove,
  annotations,
  scale,
  shapeType = "rectangle",
}: UseDrawingOptions) {
  const isDrawing = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const currentPoints = useRef<{ x: number; y: number }[]>([]);
  const tempAnnotationId = useRef<string | null>(null);

  const getCanvasCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
    [canvasRef, scale]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!currentTool || currentTool === "eraser" || currentTool === "text") return;

      isDrawing.current = true;
      const pos = getCanvasCoordinates(e.clientX, e.clientY);
      startPos.current = pos;
      currentPoints.current = [pos];
      tempAnnotationId.current = `temp-${Date.now()}`;

      e.preventDefault();
    },
    [currentTool, getCanvasCoordinates]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDrawing.current || !currentTool || currentTool === "eraser") return;

      const pos = getCanvasCoordinates(e.clientX, e.clientY);

      if (currentTool === "pen" || currentTool === "highlighter") {
        currentPoints.current.push(pos);
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentStrokeWidth * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = currentTool === "highlighter" ? 0.3 : 1;

        const points = currentPoints.current;
        if (points.length > 1) {
          const lastPoint = points[points.length - 2];
          ctx.beginPath();
          ctx.moveTo(lastPoint.x * scale, lastPoint.y * scale);
          ctx.lineTo(pos.x * scale, pos.y * scale);
          ctx.stroke();
        }
      }

      e.preventDefault();
    },
    [currentTool, currentColor, currentStrokeWidth, canvasRef, getCanvasCoordinates, scale]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDrawing.current || !currentTool || currentTool === "eraser") return;

      const endPos = getCanvasCoordinates(e.clientX, e.clientY);

      if (currentTool === "pen" || currentTool === "highlighter") {
        if (currentPoints.current.length > 0) {
          const annotation: PenAnnotation = {
            id: `${currentTool}-${Date.now()}`,
            pageNumber: currentPage,
            type: currentTool,
            points: currentPoints.current,
            strokeWidth: currentStrokeWidth,
            color: currentColor,
            opacity: currentTool === "highlighter" ? 0.3 : 1,
            createdAt: Date.now(),
          };
          onAnnotationComplete(annotation);
        }
      } else if (currentTool === "shape" && startPos.current) {
        const annotation: ShapeAnnotation = {
          id: `shape-${Date.now()}`,
          pageNumber: currentPage,
          type: "shape",
          shapeType: shapeType as ShapeType,
          startX: startPos.current.x,
          startY: startPos.current.y,
          endX: endPos.x,
          endY: endPos.y,
          strokeWidth: currentStrokeWidth,
          color: currentColor,
          opacity: 1,
          createdAt: Date.now(),
        };
        onAnnotationComplete(annotation);
      }

      isDrawing.current = false;
      startPos.current = null;
      currentPoints.current = [];
      tempAnnotationId.current = null;

      e.preventDefault();
    },
    [currentTool, currentColor, currentStrokeWidth, currentPage, shapeType, onAnnotationComplete, getCanvasCoordinates]
  );

  const handleClick = useCallback(
    (e: PointerEvent) => {
      if (currentTool === "text") {
        const pos = getCanvasCoordinates(e.clientX, e.clientY);
        const text = prompt("텍스트를 입력하세요:");
        
        if (text && text.trim()) {
          const annotation: any = {
            id: `text-${Date.now()}`,
            pageNumber: currentPage,
            type: "text",
            x: pos.x,
            y: pos.y,
            content: text.trim(),
            fontSize: currentStrokeWidth * 6,
            color: currentColor,
            opacity: 1,
            createdAt: Date.now(),
          };
          onAnnotationComplete(annotation);
        }
        return;
      }
      
      if (currentTool === "eraser") {
        const pos = getCanvasCoordinates(e.clientX, e.clientY);
        
        for (const annotation of annotations) {
          if (annotation.pageNumber !== currentPage) continue;

          if (annotation.type === "pen" || annotation.type === "highlighter") {
            const penAnnotation = annotation as PenAnnotation;
            for (const point of penAnnotation.points) {
              const distance = Math.sqrt(
                Math.pow(point.x - pos.x, 2) + Math.pow(point.y - pos.y, 2)
              );
              if (distance < 10 / scale) {
                onAnnotationRemove(annotation.id);
                return;
              }
            }
          } else if (annotation.type === "shape") {
            const shapeAnnotation = annotation as ShapeAnnotation;
            const minX = Math.min(shapeAnnotation.startX, shapeAnnotation.endX);
            const maxX = Math.max(shapeAnnotation.startX, shapeAnnotation.endX);
            const minY = Math.min(shapeAnnotation.startY, shapeAnnotation.endY);
            const maxY = Math.max(shapeAnnotation.startY, shapeAnnotation.endY);

            if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) {
              onAnnotationRemove(annotation.id);
              return;
            }
          }
        }
      }
    },
    [currentTool, currentPage, currentColor, currentStrokeWidth, annotations, onAnnotationComplete, onAnnotationRemove, getCanvasCoordinates, scale]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("click", handleClick);
    };
  }, [canvasRef, handlePointerDown, handlePointerMove, handlePointerUp, handleClick]);
}
