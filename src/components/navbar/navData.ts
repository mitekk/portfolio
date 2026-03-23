import { cvIcon, emailIcon, githubIcon, linkedinIcon } from "../../assets/links";

const emailUrl = "mitekk@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/mitya-kurs-8b058452/";
const githubUrl = "https://github.com/mitekk";

export const sections = ["about", "experience", "toolbox"];

export const links = [
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
