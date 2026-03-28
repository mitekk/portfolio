import { generatePath, generateShapes, getPathData } from "./path";
import type { Point } from "../../types";

describe("generatePath", () => {
  test("path starts at top-left and ends at bottom-right", () => {
    const dims = { rows: 8, cols: 8 };
    const path = generatePath(dims);

    expect(path[0]).toEqual({ x: 0, y: 0 });
    expect(path.at(-1)).toEqual({ x: dims.rows - 1, y: dims.cols - 1 });
  });

  test("consecutive points are always adjacent", () => {
    const path = generatePath({ rows: 8, cols: 8 });

    for (let index = 0; index < path.length - 1; index++) {
      const current = path[index];
      const next = path[index + 1];
      const manhattan = Math.abs(current.x - next.x) + Math.abs(current.y - next.y);

      expect(manhattan).toBe(1);
    }
  });

  test("all points stay in bounds and are unique", () => {
    const dims = { rows: 8, cols: 8 };
    const path = generatePath(dims);
    const uniq = new Set(path.map((point) => `${point.x},${point.y}`));

    expect(uniq.size).toBe(path.length);

    for (const point of path) {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThan(dims.rows);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThan(dims.cols);
    }
  });
});

describe("generateShapes", () => {
  test("returns rows*cols shapes and marks path cells correctly", () => {
    const dims = { rows: 2, cols: 3 };
    const path: Point[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];

    const shapes = generateShapes(dims, path);
    const pathCells = new Set(path.map((point) => `${point.x},${point.y}`));
    const nonPathKeys = new Set(["mountain", "tree", "tree2", "rhino", "house", "empty"]);

    expect(shapes).toHaveLength(dims.rows * dims.cols);

    shapes.forEach((shape, index) => {
      expect(shape.id).toBe(index + 1);
      const point = shape.points[0];
      const isPathCell = pathCells.has(`${point.x},${point.y}`);

      if (isPathCell) {
        expect(shape.key).toBe("path");
      } else {
        expect(nonPathKeys.has(shape.key)).toBe(true);
      }
    });
  });
});

describe("getPathData", () => {
  test("returns empty string for fewer than two points", () => {
    expect(getPathData([], 20)).toBe("");
    expect(getPathData([{ x: 0, y: 0 }], 20)).toBe("");
  });

  test("returns move + one cubic segment for a two-point path", () => {
    const data = getPathData(
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
      20
    );

    expect(data.startsWith("M ")).toBe(true);
    expect(data.match(/ C /g)?.length).toBe(1);
  });

  test("returns cubic segments for a path with three or more points", () => {
    const data = getPathData(
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      20
    );

    expect(data.startsWith("M ")).toBe(true);
    expect(data.includes(" C ")).toBe(true);
  });
});
