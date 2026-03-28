import { generateTiledGrid } from "./tiling";
import type { ShapeKeyTetrominoes } from "../../types";

const keys: ShapeKeyTetrominoes[] = ["I", "O", "T", "S", "Z", "J", "L"];

describe("generateTiledGrid", () => {
  test("16x16 grid is fully covered with no gaps", () => {
    const rows = 16;
    const cols = 16;

    const shapes = generateTiledGrid(rows, cols);
    const covered = new Set(shapes.flatMap((shape) => shape.points.map((point) => `${point.x},${point.y}`)));

    expect(covered.size).toBe(rows * cols);
  });

  test("every shape has a valid tetromino key", () => {
    const shapes = generateTiledGrid(16, 16);

    expect(shapes.every((shape) => keys.includes(shape.key))).toBe(true);
  });

  test("every point stays within grid bounds", () => {
    const rows = 16;
    const cols = 16;

    const shapes = generateTiledGrid(rows, cols);

    for (const shape of shapes) {
      for (const point of shape.points) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThan(rows);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThan(cols);
      }
    }
  });

  test("shape IDs are unique and start from 1", () => {
    const shapes = generateTiledGrid(16, 16);
    const ids = shapes.map((shape) => shape.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(Math.min(...ids)).toBe(1);
  });

  test("calling twice resets shape IDs", () => {
    const first = generateTiledGrid(16, 16);
    const second = generateTiledGrid(16, 16);

    expect(Math.min(...first.map((shape) => shape.id))).toBe(1);
    expect(Math.min(...second.map((shape) => shape.id))).toBe(1);
  });

  test("throws when residual region cannot fit any chunk for 5x5", () => {
    expect(() => generateTiledGrid(5, 5)).toThrowError(/Unable to place chunk at/);
  });

  test("throws when residual region cannot fit any chunk for 4x6", () => {
    expect(() => generateTiledGrid(4, 6)).toThrowError(/Unable to place chunk at/);
  });
});
