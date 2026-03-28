export type ShapeRotation = 0 | 1 | 2 | 3; // 0 = 0°, 1 = 90°, 2 = 180°, 3 = 270°

export type TemplateSize = 4 | 8 | 16 | 32;
export interface TemplatePlacement {
  shape: ShapeKeyTetrominoes;
  rotation: ShapeRotation;
  anchor: Point;
}
export type Template = TemplatePlacement[];

export type ShapeKeyWave = "wave";
export type ShapeKeyTetrominoes = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export interface Point {
  x: number;
  y: number;
}
export type Cell<T> = {
  shape: T;
  id: number;
} | null;

export type Shape<T> = {
  id: number;
  key: T;
  points: Point[];
};

export type Grid<T> = (Cell<T> | null)[][];

export type Prompt = {
  lines: PromptLine[];
};

export type PromptLine = {
  text: string;
  removeOnComplete?: boolean;
};

