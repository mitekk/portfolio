import {
  MAX_TILE,
  MAX_WIDTH,
  MIN_TILE,
  MIN_WIDTH,
  MOBILE_MIN_TILE,
  TILE_GAP,
} from "../constants";
import type { Dims } from "../context/layout";

export const MOBILE_MIN_WIDTH = 320;

export const calculateTileSize = (windowWidth: number): number => {
  const usableWidth = Math.min(windowWidth, MAX_WIDTH);

  if (usableWidth <= MOBILE_MIN_WIDTH) {
    return MOBILE_MIN_TILE;
  }

  if (usableWidth <= MIN_WIDTH) {
    const scale =
      (usableWidth - MOBILE_MIN_WIDTH) / (MIN_WIDTH - MOBILE_MIN_WIDTH);

    return Math.round(MOBILE_MIN_TILE + (MIN_TILE - MOBILE_MIN_TILE) * scale);
  }

  if (usableWidth >= MAX_WIDTH) {
    return MAX_TILE;
  }

  const scale = (usableWidth - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH);

  return Math.round(MIN_TILE + (MAX_TILE - MIN_TILE) * scale);
};

export const calculateDims = (
  windowWidth: number,
  windowHeight: number,
  tileSize: number
): Dims => {
  const cols = Math.ceil(
    (Math.min(windowWidth, MAX_WIDTH) + TILE_GAP) / (tileSize + TILE_GAP)
  );

  const rows = Math.ceil((windowHeight + TILE_GAP) / (tileSize + TILE_GAP));

  return {
    cols: Math.ceil(cols / 4) * 4,
    rows: Math.ceil(rows / 4) * 4,
  };
};
