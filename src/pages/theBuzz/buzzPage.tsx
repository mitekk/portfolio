import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { sections, links } from "../../components/navbar/navData";
import { WavesGrid } from "../../components/grid";
import { PageContext } from "../../context";
import { Navbar } from "../../components/navbar/navbar";
import { Avatar } from "../../components/UI";
import avatarImg from "../../assets/profile/avatar.png";

export const BuzzPage: React.FC = () => {
  const [gridLoaded, setGridLoaded] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [activeLink, setActiveLink] = useState<string>();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (gridLoaded) {
      setTimeout(() => setNavbarVisible(true), 10);
    }
  }, [gridLoaded]);

  useEffect(() => {
    setActiveLink(pathname.split("/")[2]);
  }, [pathname]);
  return (
    <PageContext.Provider value={{}}>
      <>
        <WavesGrid
          className="relative overflow-hidden filter animate-fadein"
          onAnimationFinish={() => setGridLoaded(true)}
        />
        {gridLoaded && (
          <div className="absolute inset-0 flex flex-col md:flex-row">
            {/* Mobile-only top header: avatar on left + section links */}
            <header className="flex md:hidden items-center px-4 py-2 gap-2 bg-zinc-700 text-[#fafafa]">
              <Avatar
                src={avatarImg}
                className="flex items-center saturate-100 h-8 w-8 flex-shrink-0"
              />
              <div className="flex flex-1 justify-around">
                {sections.map((section) => (
                  <Link
                    key={section}
                    to={`/theBuzz/${section}`}
                    className={`nav-link${activeLink === section ? " active" : ""}`}
                  >
                    {section}
                  </Link>
                ))}
              </div>
            </header>

            {/* Desktop-only sidebar with slide-in animation */}
            <div
              className={`hidden md:flex transition-all duration-700 ease-out md:h-full ${
                navbarVisible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-20 opacity-0"
              }`}
            >
              <Navbar />
            </div>

            {/* Content */}
            <div
              key={location.pathname}
              className="flex-1 min-h-0 transition-opacity duration-700 opacity-0 animate-fadein mx-2 md:mx-5 overflow-auto"
            >
              <Outlet />
            </div>

            {/* Mobile-only footer: icons only */}
            <footer className="flex md:hidden justify-around items-center px-4 py-2 bg-zinc-700">
              {links.map((link) => (
                <div
                  key={link.alt}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={link.action}
                  title={link.title}
                >
                  <img
                    className="w-5 h-5"
                    src={link.imgSrc}
                    alt={link.alt}
                    draggable={false}
                  />
                </div>
              ))}
            </footer>
          </div>
        )}
      </>
    </PageContext.Provider>
  );
};
