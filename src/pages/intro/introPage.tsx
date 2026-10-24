import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Prompter } from "../../components/prompter/prompter";
import { PromptLines } from "../../assets/prompts";
import { Avatar, Button } from "../../components/UI";
import { LayoutContext } from "../../context/layout";
import { TetrominoesGrid } from "../../components/grid";
import { PageContext } from "../../context";
import { SeoHead } from "../../components/seo/seoHead";
import { useSkipIntro } from "../../hooks/useSkipIntro";
import {
  personStructuredData,
  routeSeo,
  websiteStructuredData,
} from "../../seo/config";
import "./introPage.css";
import { avatarSrc, avatarSrcSet } from "../../assets/profile";

// Mirrors the hero's own classes: w-28 / sm:w-32 / md:w-40 / lg:w-52.
const HERO_SIZES =
  "(min-width: 1024px) 208px, (min-width: 768px) 160px, (min-width: 640px) 128px, 112px";

export const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { skip, markPlayed } = useSkipIntro();
  // The existing hero gate is the only gate: starting it true is what "skip" means.
  const [dropFinished, setDropFinished] = useState(skip);
  const [promptFinished, setPromptFinished] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const { dims } = useContext(LayoutContext);

  useEffect(() => {
    // Only once it has really played: when `skip` is already true nothing ran, and
    // recording it would suppress the entry for a visitor who turns reduced motion off
    // later in the same session.
    if (dropFinished && !skip) markPlayed();
  }, [dropFinished, skip, markPlayed]);

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

  return (
    <PageContext.Provider value={{}}>
      <>
        <SeoHead
          meta={routeSeo.home}
          jsonLd={[personStructuredData, websiteStructuredData]}
        />
        <Helmet>
          {/* imagesrcset/imagesizes must mirror the <img> below: a preload that
              disagrees downloads one file and then the <img> downloads another. */}
          <link
            rel="preload"
            as="image"
            href={avatarSrc}
            imageSrcSet={avatarSrcSet}
            imageSizes={HERO_SIZES}
          />
        </Helmet>
        <h1
          className="intro-root"
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
        <TetrominoesGrid {...defaultGridProps} skipAnimation={skip} />
        {dropFinished && !introFinished && (
          <div
            className={`z-[2] flex flex-col justify-center items-center absolute inset-0 w-full h-full intro-overlay${
              introFinished ? " intro-animate-out" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-16">
              {promptFinished && (
                <div className="avatar-animate-in">
                  <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrcSet}
                    sizes={HERO_SIZES}
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
                  instant={skip}
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
                          skip ? 0 : dims.cols * dims.cols * 2,
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
