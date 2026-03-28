import { generateWavesShapes } from "./wave";

describe("generateWavesShapes", () => {
  test("returns exactly rows*cols wave shapes with sequential IDs", () => {
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

  test("covers every grid coordinate exactly once", () => {
    const rows = 3;
    const cols = 4;

    const shapes = generateWavesShapes({ rows, cols });
    const points = shapes.map((shape) => shape.points[0]);
    const unique = new Set(points.map((point) => `${point.x},${point.y}`));

    expect(unique.size).toBe(rows * cols);

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        expect(unique.has(`${x},${y}`)).toBe(true);
      }
    }
  });
});
