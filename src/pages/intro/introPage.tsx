import { useContext, useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Prompter } from "../../components/prompter/prompter";
import { PromptLines } from "../../assets/prompts";
import { Avatar, Button } from "../../components/UI";
import { LayoutContext } from "../../context/layout";
import { RoadTripGrid, TetrominoesGrid } from "../../components/grid";
import { Header } from "../../components/header/header";
import { PageContext } from "../../context";
import { GAME_MODE_OPTIONS } from "../../constants";
import type { GameMode } from "../../types";
import "./introPage.css";
import avatarImg from "../../assets/profile/avatar.png";

export const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const [dropFinished, setDropFinished] = useState(false);
  const [promptFinished, setPromptFinished] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const { dims, gridSize } = useContext(LayoutContext);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedMode, setSelectedMode] = useState<GameMode>(
    GAME_MODE_OPTIONS[0]
  );

  const defaultGridProps = {
    onAnimationStart: () => {
      setDropFinished(false);
      setIntroFinished(false);
    },
    onAnimationFinish: () => {
      setDropFinished(true);
    },
    removeTiles: introFinished,
  };

  const gridByType: { [key in GameMode]: () => ReactElement } = {
    "Road Trip": () => <RoadTripGrid {...defaultGridProps} />,
    Tetris: () => <TetrominoesGrid {...defaultGridProps} />,
  };

  useEffect(() => {
    if (reloadTrigger > 0) {
      setSelectedMode(
        GAME_MODE_OPTIONS[reloadTrigger % GAME_MODE_OPTIONS.length]
      );
    }
  }, [reloadTrigger]);

  return (
    <PageContext.Provider
      value={{
        gameMode: selectedMode,
      }}
    >
      <Header
        onModeChange={setSelectedMode}
        onReload={() => {
          setReloadTrigger((prev) => prev + 1);
        }}
      />
      {gridByType[selectedMode]()}
      {dropFinished && !introFinished && (
        <div
          style={{
            width: `${gridSize?.width}px`,
            height: `${gridSize?.height}px`,
          }}
          className={`z-[2] flex flex-col justify-center items-center absolute top-0 left-0 m-0 mx-auto intro-overlay${
            introFinished ? " intro-animate-out" : ""
          }`}
        >
          <div className="flex flex-col md:flex-row items-center">
            {promptFinished && (
              <div className="flex flex-col h-full avatar-animate-in">
                <Avatar
                  src={avatarImg}
                  className="flex items-center flex-1 saturate-100 w-28 h-28 md:w-75 md:h-75"
                />
                <div className="hidden md:block md:min-h-24"></div>
              </div>
            )}
            <div
              className={`intro-text flex flex-col justify-center items-center${
                promptFinished ? " prompt-animate-in" : ""
              }`}
            >
              <Prompter
                prompt={{ lines: PromptLines.intro }}
                onAnimationStart={() => setPromptFinished(false)}
                onAnimationFinish={() => setPromptFinished(true)}
              />
              {promptFinished && (
                <div className="intro-action self-center md:self-start mt-5 button-animate-in">
                  <Button
                    onClick={() => {
                      setIntroFinished(true);
                      setTimeout(
                        () => {
                          navigate("/theBuzz");
                        },
                        selectedMode === "Tetris"
                          ? dims.cols * dims.cols * 2
                          : 750
                      );
                    }}
                  >
                    Get to know me
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContext.Provider>
  );
};
