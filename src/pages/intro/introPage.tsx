import { useContext, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Prompter } from "../../components/prompter/prompter";
import { PromptLines } from "../../assets/prompts";
import { Avatar, Button } from "../../components/UI";
import { LayoutContext } from "../../context/layout";
import { RoadTripGrid, TetrominoesGrid } from "../../components/grid";
import { Header } from "../../components/header/header";
import { PageContext } from "../../context";
import { GAME_MODE_OPTIONS } from "../../constants";
import type { GameMode } from "../../types";
import { SeoHead } from "../../components/seo/seoHead";
import {
  personStructuredData,
  routeSeo,
  websiteStructuredData,
} from "../../seo/config";
import "./introPage.css";
import avatarImg from "../../assets/profile/avatar.webp";

export const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const [dropFinished, setDropFinished] = useState(false);
  const [promptFinished, setPromptFinished] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const { dims } = useContext(LayoutContext);
  const [selectedMode, setSelectedMode] = useState<GameMode>(
    GAME_MODE_OPTIONS[0],
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
    Trip: () => <RoadTripGrid {...defaultGridProps} />,
    Tetris: () => <TetrominoesGrid {...defaultGridProps} />,
  };

  return (
    <PageContext.Provider
      value={{
        gameMode: selectedMode,
      }}
    >
      <>
        <SeoHead
          meta={routeSeo.home}
          jsonLd={[personStructuredData, websiteStructuredData]}
        />
        <Helmet>
          <link rel="preload" as="image" href={avatarImg} />
        </Helmet>
        <h1
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Mitya Kurs - Senior Full-Stack Developer and Team Lead
        </h1>
        <Header
          onSelect={(mode) => {
            setSelectedMode(mode);
          }}
        />
        {gridByType[selectedMode]()}
        {dropFinished && !introFinished && (
          <div
            className={`z-[2] flex flex-col justify-center items-center fixed inset-0 intro-overlay${
              introFinished ? " intro-animate-out" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-16">
              {promptFinished && (
                <div className="avatar-animate-in">
                  <Avatar
                    src={avatarImg}
                    alt="Portrait of Mitya Kurs"
                    width={500}
                    height={500}
                    loading="eager"
                    fetchPriority="high"
                    className="flex items-center saturate-100 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 !mr-0"
                  />
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
                  <div className="w-full intro-action self-center md:self-start mt-5 button-animate-in">
                    <Button
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl"
                      onClick={() => {
                        setIntroFinished(true);
                        setTimeout(
                          () => {
                            navigate("/theBuzz");
                          },
                          selectedMode === "Tetris"
                            ? dims.cols * dims.cols * 2
                            : 750,
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
      </>
    </PageContext.Provider>
  );
};
