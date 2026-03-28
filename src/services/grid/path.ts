import { TILE_GAP } from "../../constants";
import type { Dims } from "../../context/layout";
import type { Point, Shape, ShapeKeyPath } from "../../types";
import { shuffleArray } from "../shuffle";

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const isValid = (x: number, y: number, dims: Dims) =>
  x >= 0 && x < dims.rows && y >= 0 && y < dims.cols;

export const generatePath = (dims: Dims) => {
  const start = { x: 0, y: 0 };
  const end = { x: dims.rows - 1, y: dims.cols - 1 };
  const path: Point[] = [];
  const visited = new Set();
  function nextValid(x: number, y: number, prevDir?: [number, number]) {
    if (x === end.x && y === end.y) {
      path.push({ x, y });
      return true;
    }

    visited.add(`${x},${y}`);

    let dirs: number[][] = [];
    if (prevDir) {
      dirs = [
        prevDir,
        ...shuffleArray(
          directions.filter((d) => d[0] !== prevDir[0] || d[1] !== prevDir[1]),
        ),
      ];
    } else {
      dirs = shuffleArray<number[]>(directions);
    }

    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (isValid(nx, ny, dims) && !visited.has(`${nx},${ny}`)) {
        if (nextValid(nx, ny, prevDir ? undefined : [dx, dy])) {
          path.push({ x, y });
          return true;
        }
      }
    }
    return false;
  }
  nextValid(start.x, start.y);
  return path.reverse();
};

export const generateShapes = (
  dims: Dims,
  path: Point[],
): Shape<ShapeKeyPath>[] => {
  const shapes: Shape<ShapeKeyPath>[] = [];

  let id = 1;

  for (let x = 0; x < dims.rows; x++) {
    for (let y = 0; y < dims.cols; y++) {
      if (path.some((p) => p.x === x && p.y === y)) {
        shapes.push({ id: id++, key: "path", points: [{ x, y }] });
      } else if (Math.random() < 0.104) {
        shapes.push({ id: id++, key: "mountain", points: [{ x, y }] });
      } else if (Math.random() < 0.103) {
        shapes.push({ id: id++, key: "tree", points: [{ x, y }] });
      } else if (Math.random() < 0.102) {
        shapes.push({ id: id++, key: "tree2", points: [{ x, y }] });
      } else if (Math.random() < 0.101) {
        shapes.push({ id: id++, key: "rhino", points: [{ x, y }] });
      } else if (Math.random() < 0.1) {
        shapes.push({ id: id++, key: "house", points: [{ x, y }] });
      } else {
        shapes.push({ id: id++, key: "empty", points: [{ x, y }] });
      }
    }
  }
  return shapes;
};

function transformPoint(point: Point, tileSize: number) {
  const x = point.x * (tileSize + TILE_GAP) + tileSize / 2;
  const y = point.y * (tileSize + TILE_GAP) + tileSize / 2;
  return { px: y, py: x };
}

export const getPathData = (pathPoints: Point[], tileSize: number) => {
  if (pathPoints.length < 2) return "";

  const points = pathPoints.map((p) => transformPoint(p, tileSize));

  let d = `M ${points[0].px},${points[0].py}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];

    const c1 = {
      x: p1.px + (p2.px - p0.px) / 4,
      y: p1.py + (p2.py - p0.py) / 4,
    };
    const c2 = {
      x: p2.px - (p3.px - p1.px) / 4,
      y: p2.py - (p3.py - p1.py) / 4,
    };
    d += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.px},${p2.py}`;
  }
  return d;
};
