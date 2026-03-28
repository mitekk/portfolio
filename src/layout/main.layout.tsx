import {
  useCallback,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { LayoutContext } from "../context";
import type { Dims, GridSize } from "../context/layout";
import { MAX_WIDTH, TILE_GAP } from "../constants";
import { calculateDims, calculateTileSize } from "./mainLayoutMath";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [dims, setDims] = useState<Dims>({ rows: 0, cols: 0 });
  const [tileSize, setTileSize] = useState<number>(50);
  const [gridSize, setGridSize] = useState<GridSize>();

  const handleResize = useCallback(() => {
    setTileSize(calculateTileSize(window.innerWidth));
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useLayoutEffect(() => {
    setDims(calculateDims(window.innerWidth, window.innerHeight, tileSize));
  }, [tileSize]);

  useLayoutEffect(() => {
    if (dims.cols > 0 && dims.rows > 0) {
      setGridSize({
        width: Math.min(
          dims.cols * tileSize + (dims.cols - 1) * TILE_GAP,
          MAX_WIDTH
        ),
        height: dims.rows * tileSize + (dims.rows - 1) * TILE_GAP,
      });
    }
  }, [dims, tileSize]);

  return (
    <LayoutContext.Provider value={{ dims, gridSize, tileSize }}>
      <main
        style={{
          maxWidth: `${MAX_WIDTH}px`,
          width: "100%",
          margin: "0 auto",
          overflow: "hidden",
        }}
        className="h-screen flex flex-col justify-center items-center bg-[#4c4b4c]"
      >
        {gridSize && (
          <div
            style={{
              position: "relative",
              background: "lightgray",
              borderRadius: 3,
              width: gridSize.width,
              height: gridSize.height,
            }}
          >
            {children}
          </div>
        )}
      </main>
    </LayoutContext.Provider>
  );
}
