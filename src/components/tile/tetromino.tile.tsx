import { useContext, type CSSProperties, type HTMLAttributes } from "react";
import { LayoutContext } from "../../context";
import type { ShapeKeyTetrominoes } from "../../types";

interface TetrominoTileProps extends HTMLAttributes<HTMLDivElement> {
  shape: ShapeKeyTetrominoes;
}

export const TetrominoTile = ({ style, shape }: TetrominoTileProps) => {
  const { tileSize } = useContext(LayoutContext);

  // The gradients and the piece colour live in grid.css, keyed off `tile-${shape}`.
  const tileStyle: CSSProperties = {
    width: tileSize,
    height: tileSize,
    position: "absolute",
    borderRadius: 3,
    ...style,
  };

  return <div className={`tile tile-${shape}`} style={tileStyle}></div>;
};
