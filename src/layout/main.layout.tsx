import { useCallback, useLayoutEffect, useState, type ReactNode } from "react";
import { LayoutContext } from "../context";
import type { Dims, GridSize } from "../context/layout";
import { MAX_WIDTH, TILE_GAP } from "../constants";
import { calculateDims, calculateTileSize } from "./mainLayoutMath";
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from '../components/UI/ThemeToggle';

interface MainLayoutProps {
  children: ReactNode;
}

function computeLayout(): {
  tileSize: number;
  dims: Dims;
  gridSize: GridSize | undefined;
} {
  const tileSize = calculateTileSize(window.innerWidth);
  const dims = calculateDims(window.innerWidth, window.innerHeight, tileSize);
  const gridSize: GridSize | undefined =
    dims.cols > 0 && dims.rows > 0
      ? {
          width: Math.min(
            dims.cols * tileSize + (dims.cols - 1) * TILE_GAP,
            MAX_WIDTH,
          ),
          height: dims.rows * tileSize + (dims.rows - 1) * TILE_GAP,
        }
      : undefined;
  return { tileSize, dims, gridSize };
}

export function MainLayout({ children }: MainLayoutProps) {
  const [{ tileSize, dims, gridSize }, setLayout] = useState(computeLayout);
  const { theme, toggle } = useTheme();

  const handleResize = useCallback(() => {
    setLayout(computeLayout());
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <LayoutContext.Provider value={{ dims, gridSize, tileSize }}>
      <main
        style={{
          maxWidth: `${MAX_WIDTH}px`,
          width: "100%",
          margin: "0 auto",
          overflow: "hidden",
        }}
        className="h-screen flex flex-col justify-center items-center bg-surround"
      >
        {gridSize && (
          <div
            style={{
              position: "relative",
              background: "var(--color-surface)",
              borderRadius: 3,
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        )}
        <ThemeToggle theme={theme} toggle={toggle} />
      </main>
    </LayoutContext.Provider>
  );
}
