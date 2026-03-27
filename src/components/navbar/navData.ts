import { cvIcon, emailIcon, githubIcon, linkedinIcon } from "../../assets/links";

const emailUrl = "mitekk@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/mitya-kurs-8b058452/";
const githubUrl = "https://github.com/mitekk";

export const sections = ["about", "experience", "toolbox"];

export const links = [
  {
    href: `mailto:${emailUrl}?subject=Hi%20Mitya&body=How%20are%20you%3F`,
    imgSrc: emailIcon,
    alt: "email",
    title: emailUrl,
  },
  {
    href: linkedinUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    imgSrc: linkedinIcon,
    alt: "linkedin",
    title: "LinkedIn",
  },
  {
    href: githubUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    imgSrc: githubIcon,
    alt: "github",
    title: "GitHub",
  },
  {
    href: "/Mitya_Kurs.pdf",
    target: "_blank",
    rel: "noopener noreferrer",
    imgSrc: cvIcon,
    alt: "CV",
    title: "Download CV",
  },
];
