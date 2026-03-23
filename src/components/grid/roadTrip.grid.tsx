import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { LayoutContext } from "../../context";
import { generatePath, generateShapes, getPathData } from "../../services/grid";
import { TiledShape } from "../shape/shape";
import { RoadTripTile } from "../tile";
import { RoadPath } from "../roadPath";
import type { Point, Shape, ShapeKeyPath } from "../../types";
import { TILE_GAP } from "../../constants";
import "./roadTrip.grid.css";

interface RoadTripProps {
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
  removeTiles?: boolean;
}

export const RoadTripGrid: React.FC<RoadTripProps> = ({
  onAnimationFinish = () => {},
  removeTiles = false,
}) => {
  const animationEndTimeout = useRef<number | null>(null);
  const { dims, gridSize, tileSize } = useContext(LayoutContext);
  const [animated, setAnimated] = useState(false);
  const [gridAnimationFinished, setGridAnimationFinished] = useState(false);

  const pathPoints = useMemo<Point[]>(() => {
    if (dims.cols === 0 || dims.rows === 0) return [];
    return generatePath({
      rows: dims.rows,
      cols: dims.cols,
    });
  }, [dims.cols, dims.rows]);

  const shapes = useMemo<Shape<ShapeKeyPath>[]>(() => {
    if (dims.cols === 0 || dims.rows === 0) return [];
    return generateShapes(
      {
        rows: dims.rows,
        cols: dims.cols,
      },
      pathPoints
    );
  }, [dims.rows, dims.cols, pathPoints]);

  const pathData = useMemo<string>(() => {
    return getPathData(pathPoints, tileSize);
  }, [pathPoints, tileSize]);

  useEffect(() => {
    setAnimated(false);
    setGridAnimationFinished(false);
    const timeout = setTimeout(() => {
      setAnimated(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, [shapes]);

  useEffect(() => {
    if (removeTiles) {
      setAnimated(false);
      const timeout = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [removeTiles]);

  const handleGridAnimationEnd = () => {
    if (animationEndTimeout.current) {
      clearTimeout(animationEndTimeout.current);
    }
    animationEndTimeout.current = setTimeout(() => {
      setGridAnimationFinished(true);
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
    <div ref={gridRef} className="relative filter sepia brightness-150">
      <div
        style={{
          position: "relative",
          width: gridSize?.width,
          height: gridSize?.height,
          overflow: "hidden",
        }}
      >
        {shapes.map((shape, idx) => {
          const finalTop = shape.points[0].x * (tileSize + TILE_GAP);
          const finalLeft = shape.points[0].y * (tileSize + TILE_GAP);

          let top;
          if (!removeTiles) {
            top = animated ? finalTop : -tileSize;
          } else {
            top = animated ? finalTop + dims.cols * tileSize : finalTop;
          }

          const isHovered = !isTouch && (() => {
            const centerX = finalLeft + tileSize / 2;
            const centerY = finalTop + tileSize / 2;
            const dist = mouseGrid
              ? Math.hypot(mouseGrid.x - centerX, mouseGrid.y - centerY)
              : Infinity;
            return dist < tileSize * 4;
          })();
          const hoverScale = 0.95;

          return (
            <TiledShape
              key={`${shape.id}`}
              shape={shape}
              top={top}
              left={finalLeft}
              styles={{
                transition: `top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${
                  (shapes.length - idx) * 0.001
                }s, transform 0.5s cubic-bezier(.4,0,.2,1)`,
                transform: isHovered ? `scale(${hoverScale})` : "scale(1)",
              }}
              onAnimationEnd={handleGridAnimationEnd}
            >
              {shape.points.map(({ x, y }) => (
                <RoadTripTile
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
      <svg
        width={gridSize?.width}
        height={gridSize?.height}
        className="absolute top-0 left-0 z-[2] pointer-events-none"
      >
        {!removeTiles && (
          <RoadPath
            pathData={pathData}
            startAnimation={gridAnimationFinished}
            onAnimationFinish={() => onAnimationFinish()}
          />
        )}
      </svg>
    </div>
  ) : null;
};
