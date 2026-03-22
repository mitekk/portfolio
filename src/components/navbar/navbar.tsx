import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "../UI";
import avatarImg from "../../assets/profile/avatar.png";
import {
  cvIcon,
  emailIcon,
  githubIcon,
  linkedinIcon,
} from "../../assets/links";
import "./navbar.css";

const emailUrl = "mitekk@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/mitya-kurs-8b058452/";
const githubUrl = "https://github.com/mitekk";

const sections = ["about", "experience", "toolbox"];
const links = [
  {
    action: () =>
      (window.location.href = `mailto:${emailUrl}?subject=Hi%20Mitya&body=How%20are%20you%3F`),
    imgSrc: emailIcon,
    alt: "email",
    title: emailUrl,
  },
  {
    action: () => window.open(linkedinUrl, "_blank"),
    imgSrc: linkedinIcon,
    alt: "linkedin",
    title: "linkedin",
  },
  {
    action: () => window.open(githubUrl, "_blank"),
    imgSrc: githubIcon,
    alt: "github",
    title: "github",
  },
  {
    action: () => window.open("/Mitya_Kurs.pdf", "_blank"),
    imgSrc: cvIcon,
    alt: "CV",
    title: "download CV",
  },
];

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [activeLink, setActiveLink] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(pathname.split("/")[2]);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeLink) return;
      const currentIndex = sections.indexOf(activeLink);
      if (e.key === "ArrowDown") {
        const nextIndex = (currentIndex + 1) % sections.length;
        navigate(sections[nextIndex]);
      }
      if (e.key === "ArrowUp") {
        const prevIndex =
          (currentIndex - 1 + sections.length) % sections.length;
        navigate(sections[prevIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLink, navigate]);

  return (
    <nav className="flex justify-center items-center w-80 h-full p-8">
      <div
        className="flex flex-col justify-between w-full h-full bg-zinc-700  text-[#fafafa] rounded-xl p-8"
        style={{ userSelect: "none" }}
      >
        <div className="flex-5 py-2">
          <Avatar
            src={avatarImg}
            className="flex items-center flex-1 saturate-100 h-25 w-25"
          />
          <div className="flex flex-col">
            <span className="text-3xl">Mitya Kurs</span>
            <span>Fullstack Team Lead</span>
          </div>
        </div>
        <div className="flex-4 py-2">
          <ul className="nav-links flex flex-col h-full min-w-fit justify-around">
            {sections.map((section) => (
              <li key={section}>
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                  <div className="flex flex-row justify-center w-5">
                    {activeLink === section && (
                      <div className="pt-1 text-xs">➜</div>
                    )}
                  </div>
                  <Link to={section} className="nav-link">
                    {section}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-5 flex-col justify-end h-full py-2 gap-1">
          {links.map((link) => (
            <div
              key={link.alt}
              className="flex flex-row gap-2 cursor-pointer hover:text-[#bababa] transition-colors"
              onClick={link.action}
            >
              <div className="flex flex-row justify-center items-center w-5">
                <img
                  className="w-5 h-5"
                  src={link.imgSrc}
                  alt={link.alt}
                  draggable={false}
                />
              </div>
              <span>{link.title}</span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
