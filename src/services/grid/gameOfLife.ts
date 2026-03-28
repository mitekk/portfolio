import type { Dims } from "../../context/layout";
import type { Cell, Grid, Shape, ShapeKeyGameOfLife } from "../../types";

export const generateGameOfLifeGrid = (
  dims: Dims,
  aliveProbability = 0.5,
): Grid<ShapeKeyGameOfLife> => {
  const grid: Grid<ShapeKeyGameOfLife> = [];

  let id = 1;

  for (let x = 0; x < dims.rows; x++) {
    const gridRow: Cell<ShapeKeyGameOfLife>[] = [];

    for (let y = 0; y < dims.cols; y++) {
      if (Math.random() < aliveProbability) {
        gridRow.push({ id, shape: "alive" });
      } else {
        gridRow.push({ id, shape: "dead" });
      }
    }
    grid.push(gridRow);
    id += 1;
  }

  return grid;
};

export const generateGameOfLifeShapes = (
  grid: Grid<ShapeKeyGameOfLife>,
): Shape<ShapeKeyGameOfLife>[] => {
  const shapes: Shape<ShapeKeyGameOfLife>[] = [];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      shapes.push({
        id: grid[x][y]!.id,
        key: grid[x][y]!.shape,
        points: [{ x, y }],
      });
    }
  }

  return shapes;
};

export const createNextGenerationGrid = (
  grid: Grid<ShapeKeyGameOfLife>,
): Grid<ShapeKeyGameOfLife> => {
  const rows = grid.length;
  const cols = grid[0].length;
  const nextGrid: Grid<ShapeKeyGameOfLife> = [];

  for (let r = 0; r < rows; r++) {
    nextGrid[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];

      let aliveNeighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (grid[nr][nc]?.shape === "alive") aliveNeighbors++;
          }
        }
      }

      if (cell?.shape === "alive") {
        // Alive cell rules
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          nextGrid[r][c] = { ...cell, shape: "dead" };
        } else {
          nextGrid[r][c] = { ...cell, shape: "alive" };
        }
      } else if (cell?.shape === "dead") {
        if (aliveNeighbors === 3) {
          nextGrid[r][c] = { ...cell, shape: "alive" };
        } else {
          nextGrid[r][c] = { ...cell, shape: "dead" };
        }
      }
    }
  }

  return nextGrid;
};
