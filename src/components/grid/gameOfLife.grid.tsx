import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { LayoutContext } from "../../context/layout";
import { TILE_GAP } from "../../constants";
import { TiledShape } from "../shape/shape";
import type { Grid, Shape, ShapeKeyGameOfLife } from "../../types";
import { generateGameOfLifeGrid } from "../../services/grid";
import { GameOfLifeTile } from "../tile";
import {
  createNextGenerationGrid,
  generateGameOfLifeShapes,
} from "../../services/grid/gameOfLife";

interface GameOfLifeGridProps {
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
  removeTiles?: boolean;
}

export const GameOfLifeGrid: React.FC<GameOfLifeGridProps> = ({
  removeTiles,
  onAnimationFinish = () => {},
}) => {
  const { dims, gridSize, tileSize } = useContext(LayoutContext);
  const [grid, setGrid] = useState<Grid<ShapeKeyGameOfLife>>(() =>
    generateGameOfLifeGrid({ rows: dims.rows, cols: dims.cols }),
  );
  const [animated, setAnimated] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const shapes = useMemo<Shape<ShapeKeyGameOfLife>[]>(() => {
    return generateGameOfLifeShapes(grid);
  }, [grid]);

  useEffect(() => {
    if (dims.cols === 0 || dims.rows === 0) return;

    setGrid(
      generateGameOfLifeGrid({
        rows: dims.rows,
        cols: dims.cols,
      }),
    );
  }, [dims.rows, dims.cols]);

  useEffect(() => {
    if (!grid) return;

    const interval = setInterval(() => {
      if (removeTiles) return;
      setGrid((g) => createNextGenerationGrid(g));
    }, 1000);

    return () => clearInterval(interval);
  }, [grid, removeTiles]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      setMouse({ x: relativeX, y: relativeY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    setAnimated(false);
    const timeout = setTimeout(() => {
      setAnimated(true);
      onAnimationFinish();
    }, 50);
    return () => clearTimeout(timeout);
  }, [shapes, onAnimationFinish]);

  return shapes.length ? (
    <div
      ref={containerRef}
      className="relative overflow-hidden filter saturate-150"
      style={{
        width: gridSize?.width,
        height: gridSize?.height,
      }}
    >
      {shapes.map((shape, idx) => {
        const finalTop = shape.points[0].x * (tileSize + TILE_GAP);
        const finalLeft = shape.points[0].y * (tileSize + TILE_GAP);

        const centerX = finalLeft + tileSize / 2;
        const centerY = finalTop + tileSize / 2;
        const dist = Math.hypot(mouse.x - centerX, mouse.y - centerY);
        const isHovered = dist < tileSize / 2;

        if (isHovered && shape.key !== "alive") {
          shape.key = "alive";
          setTimeout(() => {
            setGrid((g) => {
              g[shape.points[0].x][shape.points[0].y] = {
                id: shape.id,
                shape: "alive",
              };
              return g;
            });
          }, 0);
        }

        return (
          <TiledShape
            key={`${shape.id}-${idx}`}
            shape={shape}
            top={finalTop}
            left={finalLeft}
            className={`shape-group`}
            styles={{
              opacity: removeTiles ? 0 : animated ? 1 : 0,
              transition: `opacity .75s ease-in-out`,
            }}
          >
            {shape.points.map(({ x, y }) => (
              <GameOfLifeTile
                key={`${x}-${y}-${shape.key}`}
                shape={shape.key}
                style={{
                  left: (y - shape.points[0].y) * (tileSize + TILE_GAP),
                  top: (x - shape.points[0].x) * (tileSize + TILE_GAP),
                  backgroundColor: isHovered ? "#ff6a896b" : "#b6d9bb",
                }}
              />
            ))}
          </TiledShape>
        );
      })}
    </div>
  ) : null;
};
