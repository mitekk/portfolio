import React, { useContext } from "react";
import { Dropdown } from "../UI/dropdown";
import { PageContext } from "../../context";
import { GAME_MODE_OPTIONS } from "../../constants";
import type { GameMode } from "../../types";
import "./header.css";

export const Header: React.FC<{
  onModeChange?: (mode: GameMode) => void;
  onReload?: () => void;
}> = ({ onModeChange = () => {}, onReload = () => {} }) => {
  const { gameMode } = useContext(PageContext);

  return (
    <header
      className={`absolute top-0 left-1/2 -translate-x-1/2 md:left-3/8 md:translate-x-0 z-[3] w-fit transition-all duration-500 h-12 opacity-90 select-none`}
    >
      {gameMode && (
        <div
          className={`min-w-48 md:min-w-80 flex items-center h-full px-3 md:px-5 rounded-b-lg bg-gray-800 text-white transition-all duration-500 shadow-lg text-base md:text-lg font-bold`}
        >
          <div className={`flex-1 flex items-center opacity-90`}>
            <Dropdown
              className="flex-1"
              title={gameMode}
              selected={gameMode}
              options={GAME_MODE_OPTIONS}
              onSelect={(option) => onModeChange(option as GameMode)}
            />
            <div
              className="header-nav-text cursor-pointer px-4"
              onClick={onReload}
            >
              ▶▶
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
