"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import type { ToolType } from "./useAnnotations";

export interface UsePanAndZoomOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentTool: ToolType;
  scale: number;
  minScale?: number;
  maxScale?: number;
  onScaleChange: (scale: number) => void;
}

export interface UsePanAndZoomResult {
  isPanning: boolean;
}

export function usePanAndZoom({
  containerRef,
  currentTool,
  scale,
  minScale = 0.5,
  maxScale = 3,
  onScaleChange,
}: UsePanAndZoomOptions): UsePanAndZoomResult {
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);
  const lastPanPosition = useRef<{ x: number; y: number } | null>(null);
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(scale);
  const activeTouches = useRef<Map<number, { x: number; y: number }>>(new Map());

  const getDistance = (touches: Map<number, { x: number; y: number }>): number => {
    const points = Array.from(touches.values());
    if (points.length < 2) return 0;
    const dx = points[1].x - points[0].x;
    const dy = points[1].y - points[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        activeTouches.current.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
        });
      }

      if (activeTouches.current.size === 2) {
        initialPinchDistance.current = getDistance(activeTouches.current);
        initialScale.current = scale;
        e.preventDefault();
      } else if (activeTouches.current.size === 1 && currentTool === "hand") {
        isPanningRef.current = true;
        setIsPanning(true);
        const touch = e.touches[0];
        lastPanPosition.current = { x: touch.clientX, y: touch.clientY };
        e.preventDefault();
      }
    },
    [containerRef, currentTool, scale]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (activeTouches.current.has(touch.identifier)) {
          activeTouches.current.set(touch.identifier, {
            x: touch.clientX,
            y: touch.clientY,
          });
        }
      }

      if (activeTouches.current.size === 2 && initialPinchDistance.current !== null) {
        const currentDistance = getDistance(activeTouches.current);
        const scaleRatio = currentDistance / initialPinchDistance.current;
        const newScale = Math.min(maxScale, Math.max(minScale, initialScale.current * scaleRatio));
        onScaleChange(newScale);
        e.preventDefault();
      } else if (isPanningRef.current && lastPanPosition.current && activeTouches.current.size === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastPanPosition.current.x;
        const deltaY = touch.clientY - lastPanPosition.current.y;
        container.scrollLeft -= deltaX;
        container.scrollTop -= deltaY;
        lastPanPosition.current = { x: touch.clientX, y: touch.clientY };
        e.preventDefault();
      }
    },
    [containerRef, minScale, maxScale, onScaleChange]
  );

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      activeTouches.current.delete(touch.identifier);
    }

    if (activeTouches.current.size < 2) {
      initialPinchDistance.current = null;
    }

    if (activeTouches.current.size === 0) {
      isPanningRef.current = false;
      setIsPanning(false);
      lastPanPosition.current = null;
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (currentTool !== "hand") return;
      const container = containerRef.current;
      if (!container) return;

      isPanningRef.current = true;
      setIsPanning(true);
      lastPanPosition.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },
    [containerRef, currentTool]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanningRef.current || !lastPanPosition.current) return;
      const container = containerRef.current;
      if (!container) return;

      const deltaX = e.clientX - lastPanPosition.current.x;
      const deltaY = e.clientY - lastPanPosition.current.y;
      container.scrollLeft -= deltaX;
      container.scrollTop -= deltaY;
      lastPanPosition.current = { x: e.clientX, y: e.clientY };
    },
    [containerRef]
  );

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    setIsPanning(false);
    lastPanPosition.current = null;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  ]);

  return { isPanning };
}
