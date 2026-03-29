import type { Point, ShapeKeyTetrominoes } from "./types";

export const TILE_GAP = 3;
export const MOBILE_MIN_TILE = 20;
export const MIN_TILE = 50;
export const MAX_TILE = 70;
export const MIN_WIDTH = 1200;
export const MAX_WIDTH = 1800;

export const BASE_SHAPES: Record<ShapeKeyTetrominoes, Point[]> = {
  // I I I I
  // . . . .
  // . . . .
  // . . . .
  I: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  // O O . .
  // O O . .
  // . . . .
  // . . . .
  O: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  // . T . .
  // T T T .
  // . . . .
  // . . . .
  T: [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // . S S .
  // S S . .
  // . . . .
  // . . . .
  S: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  // Z Z . .
  // . Z Z .
  // . . . .
  // . . . .
  Z: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // J . . .
  // J J J .
  // . . . .
  // . . . .
  J: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // . . L .
  // L L L .
  // . . . .
  // . . . .
  L: [
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
};
