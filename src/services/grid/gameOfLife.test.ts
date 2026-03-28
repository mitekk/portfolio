import {
  createNextGenerationGrid,
  generateGameOfLifeGrid,
  generateGameOfLifeShapes,
} from "./gameOfLife";
import type { Grid, ShapeKeyGameOfLife } from "../../types";

const buildGrid = (
  matrix: Array<Array<"alive" | "dead">>,
): Grid<ShapeKeyGameOfLife> =>
  matrix.map((row, rowIndex) =>
    row.map((shape) => ({
      id: rowIndex + 1,
      shape,
    })),
  );

describe("createNextGenerationGrid", () => {
  test("dead cell with exactly 3 alive neighbors becomes alive", () => {
    const next = createNextGenerationGrid(
      buildGrid([
        ["alive", "alive", "dead"],
        ["dead", "dead", "dead"],
        ["dead", "alive", "dead"],
      ]),
    );

    expect(next[1][1]?.shape).toBe("alive");
  });

  test("alive cell with 2 neighbors stays alive", () => {
    const next = createNextGenerationGrid(
      buildGrid([
        ["alive", "alive", "dead"],
        ["alive", "alive", "dead"],
        ["dead", "dead", "dead"],
      ]),
    );

    expect(next[1][1]?.shape).toBe("alive");
  });

  test("alive cell with 3 neighbors stays alive", () => {
    const next = createNextGenerationGrid(
      buildGrid([
        ["alive", "alive", "dead"],
        ["dead", "alive", "dead"],
        ["dead", "alive", "dead"],
      ]),
    );

    expect(next[1][1]?.shape).toBe("alive");
  });

  test("alive cell with 1 neighbor dies from underpopulation", () => {
    const next = createNextGenerationGrid(
      buildGrid([
        ["alive", "dead", "dead"],
        ["dead", "alive", "dead"],
        ["dead", "dead", "dead"],
      ]),
    );

    expect(next[1][1]?.shape).toBe("dead");
  });

  test("alive cell with 4 neighbors dies from overpopulation", () => {
    const next = createNextGenerationGrid(
      buildGrid([
        ["alive", "alive", "alive"],
        ["alive", "alive", "dead"],
        ["dead", "alive", "dead"],
      ]),
    );

    expect(next[1][1]?.shape).toBe("dead");
  });

  test("corner cell with 3 alive neighbors evolves correctly", () => {
    const next = createNextGenerationGrid(
      buildGrid([
        ["dead", "alive", "dead"],
        ["alive", "alive", "dead"],
        ["dead", "dead", "dead"],
      ]),
    );

    expect(next[0][0]?.shape).toBe("alive");
  });
});

describe("generateGameOfLifeShapes", () => {
  test("returns one shape per cell with alive/dead key", () => {
    const grid = buildGrid([
      ["alive", "dead", "alive"],
      ["dead", "alive", "dead"],
    ]);

    const shapes = generateGameOfLifeShapes(grid);

    expect(shapes).toHaveLength(6);
    expect(
      shapes.every((shape) => shape.key === "alive" || shape.key === "dead"),
    ).toBe(true);
  });

  test("all shapes in the same row share the same id", () => {
    const grid = buildGrid([
      ["alive", "dead", "alive"],
      ["dead", "alive", "dead"],
    ]);

    const shapes = generateGameOfLifeShapes(grid);
    const firstRowIds = shapes
      .filter((shape) => shape.points[0].x === 0)
      .map((shape) => shape.id);
    const secondRowIds = shapes
      .filter((shape) => shape.points[0].x === 1)
      .map((shape) => shape.id);

    expect(new Set(firstRowIds).size).toBe(1);
    expect(new Set(secondRowIds).size).toBe(1);
    expect(firstRowIds[0]).not.toBe(secondRowIds[0]);
  });
});

describe("generateGameOfLifeGrid", () => {
  test("returns correct dimensions and only alive/dead shapes", () => {
    const rows = 3;
    const cols = 5;

    const grid = generateGameOfLifeGrid({ rows, cols });

    expect(grid).toHaveLength(rows);
    expect(grid.every((row) => row.length === cols)).toBe(true);

    for (const row of grid) {
      for (const cell of row) {
        expect(cell).not.toBeNull();
        expect(cell?.shape === "alive" || cell?.shape === "dead").toBe(true);
      }
    }
  });
});
