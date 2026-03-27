import type { GameMode, Point, ShapeKeyTetrominoes } from "./types";

export const MOBILE_REDIRECT_PATH = "not-supported";

export const TILE_GAP = 3;
export const MOBILE_MIN_TILE = 20;
export const MIN_TILE = 50;
export const MAX_TILE = 70;
export const MIN_WIDTH = 1200;
export const MAX_WIDTH = 1800;

export const GAME_MODE_OPTIONS: GameMode[] = [
  "Tetris",
  "Trip",
  // "Game of Life",
];

export const COLORS: Record<ShapeKeyTetrominoes, string> = {
  I: "#b2ebf2", // Pastel cyan
  O: "#fff9b0", // Pastel yellow
  T: "#d1b3ff", // Pastel purple
  S: "#b6f5c9", // Pastel green
  Z: "#ffc1c1", // Pastel red
  J: "#b3d1ff", // Pastel blue
  L: "#ffe0b3", // Pastel orange
};

export const SOFT_COLORS: Record<ShapeKeyTetrominoes, string> = {
  I: "#e0f3f5", // Softened cyan
  O: "#fffae0", // Softened yellow
  T: "#e8dff5", // Softened purple
  S: "#def4e6", // Softened green
  Z: "#fce4e4", // Softened red
  J: "#dee9f8", // Softened blue
  L: "#fef1e3", // Softened orange
};

export const DARK_COLORS: Record<ShapeKeyTetrominoes, string> = {
  I: "#2bb7c6", // Deep cyan
  O: "#bba900", // Muted yellow-gold
  T: "#9256c9", // Muted purple
  S: "#2bb370", // Deep green
  Z: "#de5858", // Warm red
  J: "#568edb", // Deeper blue
  L: "#e7a04e", // Muted orange
};

export const SOFT_DARK_COLORS: Record<ShapeKeyTetrominoes, string> = {
  I: "#e4f6fa", // Very light cyan
  O: "#f9f6e0", // Very light gold/yellow
  T: "#ede7f6", // Very light purple
  S: "#e3f9ee", // Very light green
  Z: "#faeaea", // Very light red
  J: "#e7f1fb", // Very light blue
  L: "#fdf4e5", // Very light orange
};

export const RICH_COLORS: Record<ShapeKeyTetrominoes, string> = {
  I: "#00bcd4", // Rich cyan
  O: "#ffd600", // Vivid yellow
  T: "#9c27b0", // Vibrant purple
  S: "#00c853", // Rich green
  Z: "#e53935", // Rich red
  J: "#1976d2", // Strong blue
  L: "#ff9800", // Bright orange
};

export const SOFT_RICH_COLORS: Record<ShapeKeyTetrominoes, string> = {
  I: "#e0f7fa", // Very light cyan
  O: "#fffde7", // Very light yellow
  T: "#f3e5f5", // Very light purple
  S: "#e0f8ef", // Very light green
  Z: "#ffebee", // Very light red
  J: "#e3f2fd", // Very light blue
  L: "#fff3e0", // Very light orange
};

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
