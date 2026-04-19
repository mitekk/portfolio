import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "../UI";
import avatarImg from "../../assets/profile/avatar.webp";
import "./navbar.css";
import { sections, links } from "./navData";

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeLink = pathname.split("/")[2];
  const activeLinkRef = useRef(activeLink);
  activeLinkRef.current = activeLink;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const link = activeLinkRef.current;
      if (!link) return;
      const idx = sections.indexOf(link);
      if (e.key === "ArrowDown")
        navigate(sections[(idx + 1) % sections.length]);
      if (e.key === "ArrowUp")
        navigate(sections[(idx - 1 + sections.length) % sections.length]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <nav className="flex justify-center items-center w-full md:w-80 h-auto md:h-full p-3 md:p-8">
      <div
        className="flex flex-row md:flex-col justify-between items-center md:items-stretch w-full md:h-full bg-nav text-text-nav rounded-xl p-4 md:p-8 gap-3 md:gap-1"
        style={{ userSelect: "none" }}
      >
        {/* Identity */}
        <div className="flex items-center gap-2 md:flex-col md:items-start md:py-2">
          <Link to="/" aria-label="Go to intro page">
            <Avatar
              src={avatarImg}
              alt="Portrait of Mitya Kurs"
              width={500}
              height={500}
              loading="lazy"
              className="flex items-center saturate-100 h-10 w-10 md:h-25 md:w-25"
            />
          </Link>
          <div className="flex flex-col">
            <span className="text-base md:text-3xl font-medium">
              Mitya Kurs
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 py-2">
          <ul className="nav-links flex flex-row md:flex-col gap-4 md:gap-2 md:h-full md:justify-center">
            {sections.map((section) => (
              <li key={section}>
                <div className="flex flex-row items-center gap-1 cursor-pointer">
                  <div className="hidden md:flex flex-row justify-center w-5">
                    {activeLink === section && (
                      <div className="pt-1 text-xs">➜</div>
                    )}
                  </div>
                  <Link
                    to={section}
                    className={`nav-link${activeLink === section ? " active" : ""}`}
                  >
                    {section}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Social links */}
        <div className="flex flex-row md:flex-col items-center md:items-start md:py-2 gap-3 md:gap-1 md:mt-auto">
          {links.map((link) => (
            <a
              key={link.alt}
              className="flex flex-row gap-2 cursor-pointer hover:text-text-muted transition-colors"
              href={link.href}
              title={link.title}
              target={link.target}
              rel={link.rel}
            >
              <div className="flex flex-row justify-center items-center w-5">
                <img
                  className="w-5 h-5"
                  src={link.imgSrc}
                  alt={link.alt}
                  draggable={false}
                />
              </div>
              <span className="hidden md:inline text-text-nav-accent">
                {link.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
