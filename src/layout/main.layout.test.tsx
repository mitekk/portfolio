import { render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { MAX_TILE, MIN_TILE, MOBILE_MIN_TILE } from "../constants";
import { calculateDims, calculateTileSize } from "./mainLayoutMath";

describe("calculateTileSize", () => {
  test("returns MOBILE_MIN_TILE at width 320", () => {
    expect(calculateTileSize(320)).toBe(MOBILE_MIN_TILE);
  });

  test("returns an interpolated size between 20 and 50 at width 760", () => {
    const tileSize = calculateTileSize(760);

    expect(tileSize).toBeGreaterThanOrEqual(MOBILE_MIN_TILE);
    expect(tileSize).toBeLessThanOrEqual(MIN_TILE);
  });

  test("returns MIN_TILE at width 1200", () => {
    expect(calculateTileSize(1200)).toBe(MIN_TILE);
  });

  test("returns value above MIN_TILE once scale-up region progresses", () => {
    expect(calculateTileSize(1231)).toBeGreaterThan(MIN_TILE);
  });

  test("returns MAX_TILE at width 1800", () => {
    expect(calculateTileSize(1800)).toBe(MAX_TILE);
  });

  test("caps at MAX_TILE above 1800", () => {
    expect(calculateTileSize(3000)).toBe(MAX_TILE);
  });
});

describe("calculateDims", () => {
  test("rows and cols are multiples of 4", () => {
    const dims = calculateDims(1365, 777, 53);

    expect(dims.cols % 4).toBe(0);
    expect(dims.rows % 4).toBe(0);
  });
});

describe("MainLayout render gate", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock("./mainLayoutMath");
  });

  test("children are hidden when grid size is not computed", async () => {
    vi.doMock("./mainLayoutMath", async () => {
      const actual =
        await vi.importActual<typeof import("./mainLayoutMath")>(
          "./mainLayoutMath",
        );

      return {
        ...actual,
        calculateTileSize: vi.fn(() => 50),
        calculateDims: vi.fn(() => ({ rows: 0, cols: 0 })),
      };
    });

    const { MainLayout } = await import("./main.layout");

    render(
      <MainLayout>
        <div>child-content</div>
      </MainLayout>,
    );

    expect(screen.queryByText("child-content")).not.toBeInTheDocument();
  });

  test("children appear and layout context is available once grid size exists", async () => {
    vi.doMock("./mainLayoutMath", async () => {
      const actual =
        await vi.importActual<typeof import("./mainLayoutMath")>(
          "./mainLayoutMath",
        );

      return {
        ...actual,
        calculateTileSize: vi.fn(() => 50),
        calculateDims: vi.fn(() => ({ rows: 8, cols: 12 })),
      };
    });

    const { MainLayout } = await import("./main.layout");
    const { LayoutContext } = await import("../context/layout");

    const Consumer = () => {
      const { dims, tileSize, gridSize } = useContext(LayoutContext);

      return (
        <div>
          {`dims:${dims.rows}x${dims.cols};tile:${tileSize};grid:${gridSize ? `${gridSize.width}x${gridSize.height}` : "none"}`}
        </div>
      );
    };

    const { container } = render(
      <MainLayout>
        <Consumer />
      </MainLayout>,
    );

    await waitFor(() => {
      expect(screen.getByText(/dims:8x12;tile:50;grid:/)).toBeInTheDocument();
    });

    const shellHost = container.querySelector("main > div");
    expect(shellHost).toHaveStyle({ width: "100%", height: "100%" });
  });
});
