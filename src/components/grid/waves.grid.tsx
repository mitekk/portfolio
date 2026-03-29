import { useContext, useLayoutEffect, useMemo } from "react";
import { LayoutContext } from "../../context/layout";
import { TiledShape } from "../shape/shape";
import { WaveTile } from "../tile";
import { generateWavesShapes } from "../../services/grid/wave";
import { TILE_GAP } from "../../constants";
import type { Shape, ShapeKeyWave } from "../../types";

interface WavesProps {
  className?: string;
  onAnimationFinish?: () => void;
}

export const WavesGrid: React.FC<WavesProps> = ({
  onAnimationFinish = () => {},
  className,
}) => {
  const { dims, gridSize, tileSize } = useContext(LayoutContext);

  const shapes = useMemo<Shape<ShapeKeyWave>[]>(() => {
    if (dims.cols === 0 || dims.rows === 0) return [];

    const totalCells = dims.cols * dims.rows;
    const density =
      dims.cols <= 16 || totalCells > 500 ? "checkerboard" : "full";

    return generateWavesShapes({
      rows: dims.rows,
      cols: dims.cols,
      density,
    });
  }, [dims.rows, dims.cols]);

  useLayoutEffect(() => {
    if (shapes.length > 0) onAnimationFinish();
  }, [shapes, onAnimationFinish]);

  return shapes.length && gridSize ? (
    <div
      className={className}
      style={{
        width: gridSize.width,
        height: gridSize.height,
        backgroundColor: "var(--color-surface)",
      }}
    >
      {shapes.map((shape, idx) => {
        const finalTop = shape.points[0].x * (tileSize + TILE_GAP);
        const finalLeft = shape.points[0].y * (tileSize + TILE_GAP);

        return (
          <TiledShape
            key={`${shape.id}-${idx}`}
            shape={shape}
            top={finalTop}
            left={finalLeft}
            className={`shape-group`}
          >
            {shape.points.map(({ x, y }) => (
              <WaveTile
                key={`${x}-${y}-${shape.key}`}
                className="filter saturate-150"
                style={{
                  borderRadius: 5,
                  background: `radial-gradient(circle, transparent 10%, var(--color-wave) 100%)`,
                  opacity: Math.random() * 0.5 + 0.5,
                }}
              />
            ))}
          </TiledShape>
        );
      })}
    </div>
  ) : null;
};
