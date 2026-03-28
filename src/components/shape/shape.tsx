import type { Shape, ShapeKeyTetrominoes, ShapeKeyWave } from "../../types";

export const TiledShape: React.FC<{
  shape: Shape<ShapeKeyTetrominoes | ShapeKeyWave>;
  top: number;
  left: number;
  className?: string;
  styles?: React.CSSProperties;
  onAnimationEnd?: () => void;
  children?: React.ReactNode;
}> = ({
  shape,
  top,
  left,
  styles,
  className = "",
  onAnimationEnd,
  children,
}) => {
  return (
    <div
      key={shape.id}
      className={`tiled-shape ${className || ""}`}
      style={{
        position: "absolute",
        left,
        top,
        ...styles,
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === "top") {
          if (onAnimationEnd) onAnimationEnd();
        }
      }}
    >
      {children}
    </div>
  );
};
