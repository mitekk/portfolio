import { templates } from "../../assets/templates";
import { BASE_SHAPES } from "../../constants";
import type {
  Grid,
  Cell,
  TemplatePlacement,
  ShapeKeyTetrominoes,
  ShapeRotation,
  Point,
  TemplateSize,
  Shape,
} from "../../types";

const createEmptyGrid = (
  rows: number,
  cols: number
): Grid<ShapeKeyTetrominoes> =>
  Array.from({ length: rows }, () =>
    Array<Cell<ShapeKeyTetrominoes> | null>(cols).fill(null)
  );

const findNextEmpty = (grid: Grid<ShapeKeyTetrominoes>): Point | null => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === null) return { x, y };
    }
  }
  return null;
};

const canPlaceChunk = (
  grid: Grid<ShapeKeyTetrominoes>,
  rowPosition: number,
  colPosition: number,
  size: number
): boolean => {
  const rows = grid.length;
  const cols = grid[0].length;
  if (rowPosition + size > rows || colPosition + size > cols) return false;
  for (let row = rowPosition; row < rowPosition + size; row++) {
    for (let col = colPosition; col < colPosition + size; col++) {
      if (grid[row][col] !== null) return false;
    }
  }
  return true;
};

const rotatePoint = (
  { x, y }: Point,
  rotation: ShapeRotation
): { x: number; y: number } => {
  switch (rotation % 4) {
    case 0:
      return { x, y };
    case 1:
      return { x: y, y: -x };
    case 2:
      return { x: -x, y: -y };
    case 3:
      return { x: -y, y: x };
    default:
      return { x, y };
  }
};

let nextShapeId = 1;

const applyTemplate = (
  grid: Grid<ShapeKeyTetrominoes>,
  rowPosition: number,
  colPosition: number,
  placement: TemplatePlacement[]
) =>
  placement.map(({ shape, rotation, anchor }) => {
    const shapeId = nextShapeId++;

    const baseOffsets = BASE_SHAPES[shape as ShapeKeyTetrominoes];
    const rotatedOffsets = baseOffsets.map((basePoint) =>
      rotatePoint(basePoint, rotation)
    );
    const minX = Math.min(...rotatedOffsets.map((basePoint) => basePoint.x));
    const minY = Math.min(...rotatedOffsets.map((basePoint) => basePoint.y));

    const shapePoints: Point[] = [];
    rotatedOffsets.forEach((basePoint) => {
      const normX = rowPosition + anchor.x + (basePoint.x - minX);
      const normY = colPosition + anchor.y + (basePoint.y - minY);

      if (
        normX >= 0 &&
        normX < grid.length &&
        normY >= 0 &&
        normY < grid[0].length
      ) {
        shapePoints.push({ x: normX, y: normY });
        grid[normX][normY] = {
          id: shapeId,
          shape: shape,
        };
      }
    });

    return {
      id: shapeId,
      key: shape,
      points: shapePoints,
    };
  });

const lastIndexBySize: Partial<Record<TemplateSize, number>> = {};

const chooseTemplate = (size: TemplateSize): TemplatePlacement[] => {
  const tilingTemplate = templates[size];
  if (!tilingTemplate || tilingTemplate.length === 0) {
    throw new Error(`No templates available for chunk size ${size}`);
  }
  let templateIndex: number;
  const prev = lastIndexBySize[size];
  do {
    templateIndex = Math.floor(Math.random() * tilingTemplate.length);
  } while (tilingTemplate.length > 1 && templateIndex === prev);
  lastIndexBySize[size] = templateIndex;
  return tilingTemplate[templateIndex];
};

export function generateTiledGrid(
  rows: number,
  cols: number
): Shape<ShapeKeyTetrominoes>[] {
  nextShapeId = 1;
  const grid = createEmptyGrid(rows, cols);
  const sizes: Array<TemplateSize> = [16, 8, 4];
  const gridShapes: Shape<ShapeKeyTetrominoes>[] = [];

  let next: Point | null;
  while ((next = findNextEmpty(grid))) {
    const { x: rowPosition, y: colPosition } = next;
    let placed = false;
    for (const size of sizes) {
      if (canPlaceChunk(grid, rowPosition, colPosition, size)) {
        const template = chooseTemplate(size);
        gridShapes.push(
          ...applyTemplate(grid, rowPosition, colPosition, template)
        );
        placed = true;
        break;
      }
    }
    if (!placed) {
      throw new Error(
        `Unable to place chunk at (${rowPosition},${colPosition})`
      );
    }
  }

  return gridShapes;
}
