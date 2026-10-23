import { useContext, useLayoutEffect, useMemo } from "react";
import { LayoutContext } from "../../context/layout";
import { TiledShape } from "../shape/shape";
import { WaveTile } from "../tile";
import { generateWavesShapes } from "../../services/grid/wave";
import { TILE_GAP } from "../../constants";
import type { Shape, ShapeKeyWave } from "../../types";

/**
 * Per-tile opacity in [0.5, 1). Hashed from the tile's coordinates rather than drawn at
 * random so two builds of the same page produce byte-identical prerendered HTML. Kept
 * local: stubbing `Math.random` globally would break the shuffle and tiling suites.
 */
function waveOpacity(x: number, y: number) {
  const hash = Math.imul(x * 374761393 + y * 668265263, 1274126177) >>> 0;
  return 0.5 + (hash % 1000) / 2000;
}

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
      // See the same contract in tetrominoes.grid.tsx.
      data-grid="decorative"
      aria-hidden="true"
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
                  opacity: waveOpacity(x, y),
                }}
              />
            ))}
          </TiledShape>
        );
      })}
    </div>
  ) : null;
};
