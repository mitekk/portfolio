import React, { Suspense, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { sections, links } from "../../components/navbar/navData";
import { WavesGrid } from "../../components/grid";
import { PageContext } from "../../context";
import { Navbar } from "../../components/navbar/navbar";
import { Avatar } from "../../components/UI";
import avatarImg from "../../assets/profile/avatar.webp";

export const BuzzPage: React.FC = () => {
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [activeLink, setActiveLink] = useState<string>();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const timer = window.setTimeout(() => setNavbarVisible(true), 10);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setActiveLink(pathname.split("/")[2]);
  }, [pathname]);
  return (
    <PageContext.Provider value={{}}>
      <>
        <WavesGrid className="relative overflow-hidden filter animate-fadein" />
        <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row overflow-hidden">
          {/* Mobile-only top header: avatar on left + section links */}
          <header className="fixed top-0 inset-x-0 z-20 flex md:hidden items-center px-4 gap-2 h-14 bg-nav text-text-nav">
            <Link to="/" aria-label="Go to intro page">
              <Avatar
                src={avatarImg}
                alt="Portrait of Mitya Kurs"
                width={500}
                height={500}
                loading="lazy"
                className="buzz-avatar flex items-center saturate-100 h-8 w-8 flex-shrink-0"
              />
            </Link>
            <div className="flex flex-1 justify-around items-center">
              {sections.map((section, index) => (
                <React.Fragment key={section}>
                  {index > 0 && (
                    <span className="text-text-muted select-none">|</span>
                  )}
                  <Link
                    to={`/theBuzz/${section}`}
                    className={`nav-link${activeLink === section ? " active" : ""}`}
                  >
                    {section}
                  </Link>
                </React.Fragment>
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
            className="flex-1 h-full min-w-0 min-h-0 mx-2 md:mx-5 overflow-y-auto overflow-x-hidden pt-16 pb-14 md:pt-0 md:pb-0"
          >
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </div>

          {/* Mobile-only footer: icons only */}
          <footer className="fixed bottom-0 inset-x-0 z-20 flex md:hidden justify-around items-center px-4 h-12 bg-nav">
            {links.map((link) => (
              <a
                key={link.alt}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                href={link.href}
                title={link.title}
                target={link.target}
                rel={link.rel}
              >
                <img
                  className="w-5 h-5"
                  src={link.imgSrc}
                  alt={link.alt}
                  draggable={false}
                />
              </a>
            ))}
          </footer>
        </div>
      </>
    </PageContext.Provider>
  );
};
