"use client";

import { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Highlighter,
  Type,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Eraser,
  Undo,
  Redo,
  Palette,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnnotationType, ShapeType } from "@/types/annotation";
import type { ToolType } from "@/hooks/useAnnotations";

interface EditorToolbarProps {
  selectedTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedStrokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  selectedShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const COLORS = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFFFFF",
];

const STROKE_WIDTHS = [1, 2, 4, 8, 12];

interface ToolButtonProps {
  tool: ToolType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  selectedTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

function ToolButton({
  tool,
  icon: Icon,
  label,
  selectedTool,
  onToolChange,
}: ToolButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToolChange(tool)}
      className={`flex-col h-auto py-2 px-2 sm:px-3 gap-1 shrink-0 ${
        selectedTool === tool 
          ? "bg-[#5a5d60] text-white hover:bg-[#6a6d70]" 
          : "text-gray-300 hover:bg-[#4a4d50] hover:text-white"
      }`}
      title={label}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="text-[10px] sm:text-xs hidden md:inline whitespace-nowrap">{label}</span>
    </Button>
  );
}

export function EditorToolbar({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
  selectedStrokeWidth,
  onStrokeWidthChange,
  selectedShape,
  onShapeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: EditorToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeWidthPicker, setShowStrokeWidthPicker] = useState(false);
  const [showShapePicker, setShowShapePicker] = useState(false);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const strokeWidthPickerRef = useRef<HTMLDivElement>(null);
  const shapePickerRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside (use click so dropdown button click fires first)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (colorPickerRef.current && !colorPickerRef.current.contains(target)) {
        setShowColorPicker(false);
      }
      if (strokeWidthPickerRef.current && !strokeWidthPickerRef.current.contains(target)) {
        setShowStrokeWidthPicker(false);
      }
      if (shapePickerRef.current && !shapePickerRef.current.contains(target)) {
        setShowShapePicker(false);
      }
    };

    if (showColorPicker || showStrokeWidthPicker || showShapePicker) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showColorPicker, showStrokeWidthPicker, showShapePicker]);

  return (
    <div className="relative flex flex-col gap-2 p-2 bg-[#323639] border-b border-gray-700 md:flex-row md:items-center md:justify-center">
      <div className="flex items-center gap-1 flex-nowrap md:flex-wrap overflow-x-auto pb-1 md:pb-0 justify-center md:justify-center">
        <ToolButton tool="hand" icon={Hand} label="이동" selectedTool={selectedTool} onToolChange={onToolChange} />
        <ToolButton tool="pen" icon={Pencil} label="펜" selectedTool={selectedTool} onToolChange={onToolChange} />
        <ToolButton tool="highlighter" icon={Highlighter} label="형광펜" selectedTool={selectedTool} onToolChange={onToolChange} />
        <ToolButton tool="text" icon={Type} label="텍스트" selectedTool={selectedTool} onToolChange={onToolChange} />
        
        <div className="relative" ref={shapePickerRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onToolChange("shape");
              setShowShapePicker(!showShapePicker);
            }}
            className={`flex-col h-auto py-2 px-3 gap-1 ${
              selectedTool === "shape"
                ? "bg-[#5a5d60] text-white hover:bg-[#6a6d70]"
                : "text-gray-300 hover:bg-[#4a4d50] hover:text-white"
            }`}
            title="도형"
          >
            <Square className="h-5 w-5" />
            <span className="text-xs hidden sm:inline">도형</span>
          </Button>
          
          {showShapePicker && (
            <div className="fixed mt-1 bg-[#3a3d40] border border-gray-600 rounded-lg shadow-lg p-2 flex flex-col gap-1 z-[100]" style={{
              top: shapePickerRef.current?.getBoundingClientRect().bottom,
              left: shapePickerRef.current?.getBoundingClientRect().left,
            }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onShapeChange("rectangle");
                  setShowShapePicker(false);
                }}
                className={`gap-2 justify-start ${
                  selectedShape === "rectangle"
                    ? "bg-[#5a5d60] text-white"
                    : "text-gray-300 hover:bg-[#4a4d50] hover:text-white"
                }`}
              >
                <Square className="h-4 w-4" />
                사각형
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onShapeChange("ellipse");
                  setShowShapePicker(false);
                }}
                className={`gap-2 justify-start ${
                  selectedShape === "ellipse"
                    ? "bg-[#5a5d60] text-white"
                    : "text-gray-300 hover:bg-[#4a4d50] hover:text-white"
                }`}
              >
                <Circle className="h-4 w-4" />
                원
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onShapeChange("arrow");
                  setShowShapePicker(false);
                }}
                className={`gap-2 justify-start ${
                  selectedShape === "arrow"
                    ? "bg-[#5a5d60] text-white"
                    : "text-gray-300 hover:bg-[#4a4d50] hover:text-white"
                }`}
              >
                <ArrowRight className="h-4 w-4" />
                화살표
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onShapeChange("line");
                  setShowShapePicker(false);
                }}
                className={`gap-2 justify-start ${
                  selectedShape === "line"
                    ? "bg-[#5a5d60] text-white"
                    : "text-gray-300 hover:bg-[#4a4d50] hover:text-white"
                }`}
              >
                <Minus className="h-4 w-4" />
                선
              </Button>
            </div>
          )}
        </div>

        <ToolButton tool="eraser" icon={Eraser} label="지우개" selectedTool={selectedTool} onToolChange={onToolChange} />

        <div className="h-8 w-px bg-gray-300 mx-1" />

        <div className="relative" ref={colorPickerRef} data-testid="color-picker-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex-col h-auto py-2 px-3 gap-1 text-gray-300 hover:bg-[#4a4d50] hover:text-white"
            title="색상"
            data-testid="color-picker-trigger"
          >
            <div className="flex items-center gap-1">
              <Palette className="h-5 w-5" />
              <div
                className="w-4 h-4 rounded border border-gray-500"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
            <span className="text-xs hidden sm:inline">색상</span>
          </Button>

          {showColorPicker && (
            <div className="fixed mt-1 bg-[#3a3d40] border border-gray-600 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 z-[100]" style={{
              top: colorPickerRef.current?.getBoundingClientRect().bottom,
              left: colorPickerRef.current?.getBoundingClientRect().left,
            }}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded border-2 hover:border-white transition-colors"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#fff" : "#666",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    onColorChange(color);
                    setShowColorPicker(false);
                  }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={strokeWidthPickerRef} data-testid="stroke-width-picker-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowStrokeWidthPicker(!showStrokeWidthPicker)}
            className="flex-col h-auto py-2 px-3 gap-1 text-gray-300 hover:bg-[#4a4d50] hover:text-white"
            title="굵기"
            data-testid="stroke-width-picker-trigger"
          >
            <div className="flex items-center gap-1">
              <div
                className="rounded-full bg-white"
                style={{ width: selectedStrokeWidth * 2, height: selectedStrokeWidth * 2 }}
              />
            </div>
            <span className="text-xs hidden sm:inline">굵기</span>
          </Button>

          {showStrokeWidthPicker && (
            <div className="fixed mt-1 bg-[#3a3d40] border border-gray-600 rounded-lg shadow-lg p-2 flex flex-col gap-2 z-[100]" style={{
              top: strokeWidthPickerRef.current?.getBoundingClientRect().bottom,
              left: strokeWidthPickerRef.current?.getBoundingClientRect().left,
            }}>
              {STROKE_WIDTHS.map((width) => (
                <button
                  key={width}
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#4a4d50] rounded transition-colors text-gray-300 hover:text-white"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    onStrokeWidthChange(width);
                    setShowStrokeWidthPicker(false);
                  }}
                >
                  <div
                    className="rounded-full bg-white"
                    style={{ width: width * 2, height: width * 2 }}
                  />
                  <span className="text-sm">{width}px</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-col h-auto py-2 px-3 gap-1 text-gray-300 hover:bg-[#4a4d50] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
          title="실행취소"
        >
          <Undo className="h-5 w-5" />
          <span className="text-xs hidden sm:inline">실행취소</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-col h-auto py-2 px-3 gap-1 text-gray-300 hover:bg-[#4a4d50] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
          title="다시실행"
        >
          <Redo className="h-5 w-5" />
          <span className="text-xs hidden sm:inline">다시실행</span>
        </Button>
      </div>
    </div>
  );
}
