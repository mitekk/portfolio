import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { PageContext } from "../../context";
import { GAME_MODE_OPTIONS } from "../../constants";
import type { GameMode } from "../../types";
import "./header.css";

export const Header: React.FC<{
  onSelect?: (mode: GameMode) => void;
}> = ({ onSelect = () => {} }) => {
  const { gameMode } = useContext(PageContext);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [slider, setSlider] = useState({ width: 0, x: 0 });

  useLayoutEffect(() => {
    const idx = GAME_MODE_OPTIONS.indexOf(gameMode ?? GAME_MODE_OPTIONS[0]);
    const btn = btnRefs.current[idx];
    if (btn) {
      setSlider({ width: btn.offsetWidth, x: btn.offsetLeft });
    }
  }, [gameMode]);

  return (
    <header
      className={`absolute top-0 left-1/2 -translate-x-1/2 md:left-3/8 md:translate-x-0 z-[3] w-fit transition-all duration-500 h-12 opacity-90 select-none`}
    >
      {gameMode && (
        <div
          className={`flex items-center h-full px-3 md:px-5 rounded-b-lg bg-gray-800 text-white transition-all duration-500 shadow-lg text-base md:text-lg font-bold`}
        >
          <div className="relative flex p-1 h-full">
            <div
              className="absolute top-1 bottom-1 left-0 rounded-md bg-white/15 border border-white/20 transition-all duration-300 ease-in-out pointer-events-none"
              style={{
                width: slider.width,
                transform: `translateX(${slider.x}px)`,
              }}
            />
            {GAME_MODE_OPTIONS.map((mode, i) => (
              <button
                key={mode}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                onClick={() => onSelect(mode)}
                className={`toggle-btn relative z-10 text-3xl px-4 py-1 rounded-md font-bold transition-colors duration-300 cursor-pointer text-center outline-none focus:outline-none appearance-none ${
                  mode === gameMode ? "text-white" : "text-white/40"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
