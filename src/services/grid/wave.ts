import type { Shape, ShapeKeyWave } from "../../types";

export type WaveDensity = "full" | "checkerboard";

interface WaveShapesProps {
  rows: number;
  cols: number;
  density?: WaveDensity;
}

export const generateWavesShapes = ({
  rows,
  cols,
  density = "full",
}: WaveShapesProps) => {
  const shapes: Shape<ShapeKeyWave>[] = [];
  let id = 0;
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (density === "checkerboard" && (x + y) % 2 !== 0) {
        continue;
      }

      shapes.push({
        id: ++id,
        key: "wave",
        points: [{ x, y }],
      });
    }
  }
  return shapes;
};
