import { useContext, type CSSProperties, type HTMLAttributes } from "react";
import { LayoutContext } from "../../context";
import type { ShapeKeyTetrominoes } from "../../types";

interface TetrominoTileProps extends HTMLAttributes<HTMLDivElement> {
  shape: ShapeKeyTetrominoes;
}

export const TetrominoTile = ({ style, shape }: TetrominoTileProps) => {
  const { tileSize } = useContext(LayoutContext);

  const tileStyle: CSSProperties = {
    width: tileSize,
    height: tileSize,
    background: `
      linear-gradient(to right, rgba(255,255,255,0.18), rgba(255,255,255,0)) no-repeat top / 100% 10px,
      linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0)) no-repeat left / 10px 100%,
      linear-gradient(to left, rgba(0,0,0,0.10), rgba(0,0,0,0)) no-repeat bottom / 100% 10px,
      linear-gradient(to top, rgba(0,0,0,0.10), rgba(0,0,0,0)) no-repeat right / 10px 100%,
    var(--color-piece-${shape})
  `,
    position: "absolute",
    borderRadius: 3,
    ...style,
  };

  return <div className="tile" style={tileStyle}></div>;
};
