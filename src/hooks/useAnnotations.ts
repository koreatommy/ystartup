"use client";

import { useState, useCallback } from "react";
import type { Annotation, AnnotationType, ShapeType } from "@/types/annotation";

export type ToolType = AnnotationType | "eraser" | "hand" | null;

export interface UseAnnotationsResult {
  annotations: Annotation[];
  history: Annotation[][];
  historyIndex: number;
  selectedTool: ToolType;
  selectedColor: string;
  selectedStrokeWidth: number;
  selectedShape: ShapeType;
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (annotationId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setSelectedTool: (tool: ToolType) => void;
  setSelectedColor: (color: string) => void;
  setSelectedStrokeWidth: (width: number) => void;
  setSelectedShape: (shape: ShapeType) => void;
  getAnnotationsForPage: (pageNumber: number) => Annotation[];
  clearAnnotations: () => void;
  loadAnnotations: (annotations: Annotation[]) => void;
}

const MAX_HISTORY_SIZE = 50;

export function useAnnotations(): UseAnnotationsResult {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<ToolType>("pen");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(2);
  const [selectedShape, setSelectedShape] = useState<ShapeType>("rectangle");

  const addToHistory = useCallback((newAnnotations: Annotation[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...newAnnotations]);
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
      }
      
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [historyIndex]);

  const addAnnotation = useCallback((annotation: Annotation) => {
    const newAnnotations = [...annotations, annotation];
    setAnnotations(newAnnotations);
    addToHistory(newAnnotations);
  }, [annotations, addToHistory]);

  const removeAnnotation = useCallback((annotationId: string) => {
    const newAnnotations = annotations.filter((a) => a.id !== annotationId);
    setAnnotations(newAnnotations);
    addToHistory(newAnnotations);
  }, [annotations, addToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAnnotations(history[newIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAnnotations(history[newIndex]);
    }
  }, [historyIndex, history]);

  const getAnnotationsForPage = useCallback(
    (pageNumber: number) => {
      return annotations.filter((a) => a.pageNumber === pageNumber);
    },
    [annotations]
  );

  const clearAnnotations = useCallback(() => {
    setAnnotations([]);
    setHistory([[]]);
    setHistoryIndex(0);
  }, []);

  const loadAnnotations = useCallback((loadedAnnotations: Annotation[]) => {
    setAnnotations(loadedAnnotations);
    setHistory([loadedAnnotations]);
    setHistoryIndex(0);
  }, []);

  return {
    annotations,
    history,
    historyIndex,
    selectedTool,
    selectedColor,
    selectedStrokeWidth,
    selectedShape,
    addAnnotation,
    removeAnnotation,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setSelectedTool,
    setSelectedColor,
    setSelectedStrokeWidth,
    setSelectedShape,
    getAnnotationsForPage,
    clearAnnotations,
    loadAnnotations,
  };
}
