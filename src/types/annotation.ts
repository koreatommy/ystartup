export type AnnotationType = "pen" | "highlighter" | "text" | "shape";
export type ShapeType = "rectangle" | "ellipse" | "arrow" | "line";

export interface BaseAnnotation {
  id: string;
  pageNumber: number;
  type: AnnotationType;
  color: string;
  opacity: number;
  createdAt: number;
}

export interface PenAnnotation extends BaseAnnotation {
  type: "pen" | "highlighter";
  points: { x: number; y: number }[];
  strokeWidth: number;
}

export interface TextAnnotation extends BaseAnnotation {
  type: "text";
  x: number;
  y: number;
  content: string;
  fontSize: number;
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: "shape";
  shapeType: ShapeType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeWidth: number;
  fill?: string;
}

export type Annotation = PenAnnotation | TextAnnotation | ShapeAnnotation;

export interface AnnotationState {
  annotations: Annotation[];
  currentPage: number;
  selectedTool: AnnotationType | "eraser" | null;
  selectedColor: string;
  selectedStrokeWidth: number;
  selectedShape?: ShapeType;
}
