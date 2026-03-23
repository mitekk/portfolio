import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { LayoutContext } from "../../context/layout";
import { TILE_GAP } from "../../constants";
import { TiledShape } from "../shape/shape";
import type { Shape, ShapeKeyTetrominoes } from "../../types";
import { generateTiledGrid } from "../../services/grid";
import { TetrominoTile } from "../tile";

interface TetrominoesGridProps {
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
  removeTiles?: boolean;
}

export const TetrominoesGrid: React.FC<TetrominoesGridProps> = ({
  onAnimationFinish,
  removeTiles = false,
}) => {
  const [animated, setAnimated] = useState(false);
  const { dims, gridSize, tileSize } = useContext(LayoutContext);

  const shapes = useMemo<Shape<ShapeKeyTetrominoes>[]>(() => {
    if (dims.cols === 0 || dims.rows === 0) return [];
    return generateTiledGrid(dims.rows, dims.cols);
  }, [dims.rows, dims.cols]);

  useEffect(() => {
    setAnimated(false);
    const timeout = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timeout);
  }, [shapes]);

  useEffect(() => {
    if (removeTiles) {
      setAnimated(false);
      const timeout = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [removeTiles]);

  const animationEndTimeout = useRef<number | null>(null);

  const handleAnimationEnd = () => {
    if (animationEndTimeout.current) {
      clearTimeout(animationEndTimeout.current);
    }
    animationEndTimeout.current = setTimeout(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    }, 150);
  };

  const isTouch = 'ontouchstart' in window;

  const gridRef = useRef<HTMLDivElement>(null);
  const [mouseGrid, setMouseGrid] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (isTouch) return;
    const move = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMouseGrid({ x, y });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isTouch]);

  return shapes.length ? (
    <div
      ref={gridRef}
      className="relative overflow-hidden"
      style={{
        width: gridSize?.width,
        height: gridSize?.height,
      }}
    >
      {shapes
        .sort((a, b) => a.points[0].x - b.points[0].x)
        .map((shape, idx) => {
          const finalTop = shape.points[0].x * (tileSize + TILE_GAP);
          const finalLeft = shape.points[0].y * (tileSize + TILE_GAP);

          let top;
          if (!removeTiles) {
            top = animated ? finalTop : -window.innerHeight * 2;
          } else {
            top = animated ? finalTop + window.innerHeight * 2 : finalTop;
          }

          const isHovered = !isTouch && (() => {
            const centerX = finalLeft + tileSize;
            const centerY = finalTop + tileSize;
            const dist = mouseGrid
              ? Math.hypot(mouseGrid.x - centerX, mouseGrid.y - centerY)
              : Infinity;
            return dist < tileSize * 4;
          })();
          const hoverScale = 1.2;

          return (
            <TiledShape
              key={`${shape.id}`}
              shape={shape}
              top={top}
              left={finalLeft}
              className={`shape-group${isHovered ? " hovered" : ""}`}
              styles={{
                transition: `top 0.75s cubic-bezier(0.25, 0.1, 0.25, 1) ${
                  (shapes.length - idx) * 0.01
                }s, transform 0.15s cubic-bezier(.4,0,.2,1)`,
                transform: isHovered ? `scale(${hoverScale})` : "scale(1)",
                filter: isHovered ? "grayscale(0.1) saturate(1.2)" : "",
              }}
              onAnimationEnd={handleAnimationEnd}
            >
              {shape.points.map(({ x, y }) => (
                <TetrominoTile
                  key={`${x}-${y}-${shape.key}`}
                  shape={shape.key}
                  style={{
                    left: (y - shape.points[0].y) * (tileSize + TILE_GAP),
                    top: (x - shape.points[0].x) * (tileSize + TILE_GAP),
                  }}
                />
              ))}
            </TiledShape>
          );
        })}
    </div>
  ) : null;
};
