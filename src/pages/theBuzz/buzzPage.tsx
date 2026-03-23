import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { WavesGrid } from "../../components/grid";
import { PageContext } from "../../context";
import { Navbar } from "../../components/navbar/navbar";

export const BuzzPage: React.FC = () => {
  const [gridLoaded, setGridLoaded] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (gridLoaded) {
      setTimeout(() => setNavbarVisible(true), 10);
    }
  }, [gridLoaded]);
  return (
    <PageContext.Provider value={{}}>
      <>
        <WavesGrid
          className="relative overflow-hidden filter animate-fadein"
          onAnimationFinish={() => setGridLoaded(true)}
        />
        {gridLoaded && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row">
            <div
              className={`transition-all duration-700 ease-out md:h-full ${
                navbarVisible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-20 opacity-0"
              }`}
            >
              <Navbar />
            </div>
            <div
              key={location.pathname}
              className="flex-1 min-h-0 transition-opacity duration-700 opacity-0 animate-fadein mx-2 md:mx-5 overflow-auto"
            >
              <Outlet />
            </div>
          </div>
        )}
      </>
    </PageContext.Provider>
  );
};
