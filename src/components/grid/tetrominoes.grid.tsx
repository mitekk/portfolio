import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LayoutContext } from "../../context/layout";
import {
  DROP_DURATION_S,
  DROP_STAGGER_S,
  SETTLE_MS,
  TILE_GAP,
} from "../../constants";
import { TiledShape } from "../shape/shape";
import type { Shape, ShapeKeyTetrominoes } from "../../types";
import { generateTiledGrid } from "../../services/grid";
import { TetrominoTile } from "../tile";
import "./grid.css";

const HOVER_SCALE = 1.2;

/** Waits for the frame after the next, so the browser has painted the pre-drop
 * position before the transition to `translateY(0)` is applied. */
function afterNextPaint(callback: () => void) {
  let inner = 0;
  const outer = requestAnimationFrame(() => {
    inner = requestAnimationFrame(callback);
  });
  return () => {
    cancelAnimationFrame(outer);
    cancelAnimationFrame(inner);
  };
}

interface TetrominoShapeProps {
  shape: Shape<ShapeKeyTetrominoes>;
  finalTop: number;
  finalLeft: number;
  translateY: number;
  delay: number;
  isHovered: boolean;
  tileSize: number;
  skipAnimation: boolean;
  onDropEnd: () => void;
}

/**
 * Memoised on primitives, so a cursor move re-renders only the shapes whose hover state
 * actually changed instead of every shape in the grid.
 */
const TetrominoShape = memo(function TetrominoShape({
  shape,
  finalTop,
  finalLeft,
  translateY,
  delay,
  isHovered,
  tileSize,
  skipAnimation,
  onDropEnd,
}: TetrominoShapeProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: finalLeft,
        top: finalTop,
        transform: `translateY(${translateY}px)`,
        transition: skipAnimation
          ? "none"
          : `transform ${DROP_DURATION_S}s cubic-bezier(0.34, 0.9, 0.3, 1) ${delay}s`,
      }}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "transform") {
          onDropEnd();
        }
      }}
    >
      <TiledShape
        shape={shape}
        top={0}
        left={0}
        className={`shape-group${isHovered ? " hovered" : ""}`}
        styles={{
          transition: "transform 0.15s cubic-bezier(.4,0,.2,1)",
          transform: isHovered ? `scale(${HOVER_SCALE})` : "scale(1)",
          filter: isHovered ? "grayscale(0.1) saturate(1.2)" : "",
        }}
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
    </div>
  );
});

interface TetrominoesGridProps {
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
  removeTiles?: boolean;
  skipAnimation?: boolean;
}

export const TetrominoesGrid: React.FC<TetrominoesGridProps> = ({
  onAnimationFinish,
  removeTiles = false,
  skipAnimation = false,
}) => {
  // Settled on the very first render when skipping, not after an effect — otherwise the
  // tiles are painted off-screen once and jump into place.
  const [animated, setAnimated] = useState(skipAnimation);
  const { dims, gridSize, tileSize } = useContext(LayoutContext);

  const shapes = useMemo<Shape<ShapeKeyTetrominoes>[]>(() => {
    if (dims.cols === 0 || dims.rows === 0) return [];
    return generateTiledGrid(dims.rows, dims.cols).sort(
      (a, b) => a.points[0].x - b.points[0].x,
    );
  }, [dims.rows, dims.cols]);

  useEffect(() => {
    if (skipAnimation) return;
    setAnimated(false);
    return afterNextPaint(() => setAnimated(true));
  }, [shapes, skipAnimation]);

  useEffect(() => {
    if (skipAnimation || !removeTiles) return;
    setAnimated(false);
    return afterNextPaint(() => setAnimated(true));
  }, [removeTiles, skipAnimation]);

  const animationEndTimeout = useRef<number | null>(null);
  const onAnimationFinishRef = useRef(onAnimationFinish);
  onAnimationFinishRef.current = onAnimationFinish;

  // Stable, so the memoised shapes are not invalidated on every parent render.
  const handleAnimationEnd = useCallback(() => {
    if (animationEndTimeout.current) {
      clearTimeout(animationEndTimeout.current);
    }
    animationEndTimeout.current = window.setTimeout(() => {
      onAnimationFinishRef.current?.();
    }, SETTLE_MS);
  }, []);

  const isTouch = "ontouchstart" in window;

  const gridRef = useRef<HTMLDivElement>(null);
  const [mouseGrid, setMouseGrid] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    if (isTouch) return;

    let frame = 0;
    let latest: MouseEvent | null = null;

    const move = (event: MouseEvent) => {
      latest = event;
      if (frame) return;
      // One state update and one layout read per frame, not per event.
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!gridRef.current || !latest) return;
        const rect = gridRef.current.getBoundingClientRect();
        setMouseGrid({
          x: latest.clientX - rect.left,
          y: latest.clientY - rect.top,
        });
      });
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, [isTouch]);

  return shapes.length ? (
    <div
      ref={gridRef}
      className="tetromino-grid relative overflow-hidden"
      // Contract with scripts/prerender.cjs, which strips decorative grids from the
      // prerendered HTML: they are baked at react-snap's viewport, never match the
      // visitor's, and are discarded the moment React mounts.
      data-grid="decorative"
      aria-hidden="true"
      style={{
        width: gridSize?.width,
        height: gridSize?.height,
      }}
    >
      {shapes.map((shape, idx) => {
        const finalTop = shape.points[0].x * (tileSize + TILE_GAP);
        const finalLeft = shape.points[0].y * (tileSize + TILE_GAP);

        let translateY: number;
        if (!removeTiles) {
          translateY = animated ? 0 : -window.innerHeight * 2;
        } else {
          translateY = animated ? window.innerHeight * 2 : 0;
        }

        const centerX = finalLeft + tileSize;
        const centerY = finalTop + tileSize;
        const isHovered =
          !isTouch &&
          !!mouseGrid &&
          Math.hypot(mouseGrid.x - centerX, mouseGrid.y - centerY) <
            tileSize * 4;

        return (
          <TetrominoShape
            key={shape.id}
            shape={shape}
            finalTop={finalTop}
            finalLeft={finalLeft}
            translateY={translateY}
            delay={((shapes.length - idx) / shapes.length) * DROP_STAGGER_S}
            isHovered={isHovered}
            tileSize={tileSize}
            skipAnimation={skipAnimation}
            onDropEnd={handleAnimationEnd}
          />
        );
      })}
    </div>
  ) : null;
};
