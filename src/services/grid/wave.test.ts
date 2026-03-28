import { generateWavesShapes } from "./wave";

describe("generateWavesShapes", () => {
  test("returns exactly rows*cols wave shapes with sequential IDs in full mode", () => {
    const rows = 4;
    const cols = 5;

    const shapes = generateWavesShapes({ rows, cols });

    expect(shapes).toHaveLength(rows * cols);

    shapes.forEach((shape, index) => {
      expect(shape.id).toBe(index + 1);
      expect(shape.key).toBe("wave");
      expect(shape.points).toHaveLength(1);
    });
  });

  test("covers every grid coordinate exactly once in full mode", () => {
    const rows = 3;
    const cols = 4;

    const shapes = generateWavesShapes({ rows, cols, density: "full" });
    const points = shapes.map((shape) => shape.points[0]);
    const unique = new Set(points.map((point) => `${point.x},${point.y}`));

    expect(unique.size).toBe(rows * cols);

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        expect(unique.has(`${x},${y}`)).toBe(true);
      }
    }
  });

  test("returns only checkerboard cells with sequential IDs", () => {
    const rows = 4;
    const cols = 5;

    const shapes = generateWavesShapes({ rows, cols, density: "checkerboard" });
    const expectedCount = Math.ceil((rows * cols) / 2);

    expect(shapes).toHaveLength(expectedCount);

    shapes.forEach((shape, index) => {
      expect(shape.id).toBe(index + 1);
      expect(shape.key).toBe("wave");
      expect(shape.points).toHaveLength(1);

      const point = shape.points[0];
      expect((point.x + point.y) % 2).toBe(0);
    });
  });

  test("checkerboard mode keeps unique coordinates and excludes odd-sum cells", () => {
    const rows = 3;
    const cols = 4;

    const shapes = generateWavesShapes({ rows, cols, density: "checkerboard" });
    const points = shapes.map((shape) => shape.points[0]);
    const unique = new Set(points.map((point) => `${point.x},${point.y}`));

    expect(unique.size).toBe(shapes.length);
    expect(unique.has("0,0")).toBe(true);
    expect(unique.has("0,1")).toBe(false);
    expect(unique.has("1,0")).toBe(false);
    expect(unique.has("1,1")).toBe(true);
  });
});
