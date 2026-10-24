import { render } from "@testing-library/react";
import { LayoutContext } from "../../context/layout";
import { WavesGrid } from "./waves.grid";

const layoutValue = {
  dims: { rows: 8, cols: 8 },
  tileSize: 50,
  gridSize: { width: 500, height: 400 },
};

const tileOpacities = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>(".tile")].map(
    (tile) => tile.style.opacity,
  );

const renderWaves = () =>
  render(
    <LayoutContext.Provider value={layoutValue}>
      <WavesGrid />
    </LayoutContext.Provider>,
  );

describe("WavesGrid", () => {
  test("paints the same tile opacities every render", () => {
    const first = tileOpacities(renderWaves().container);
    const second = tileOpacities(renderWaves().container);

    expect(first.length).toBeGreaterThan(0);
    expect(second).toEqual(first);
  });

  test("varies opacity across tiles rather than painting a flat sheet", () => {
    const opacities = tileOpacities(renderWaves().container);

    expect(new Set(opacities).size).toBeGreaterThan(3);
    for (const opacity of opacities) {
      expect(Number(opacity)).toBeGreaterThanOrEqual(0.5);
      expect(Number(opacity)).toBeLessThanOrEqual(1);
    }
  });
});
