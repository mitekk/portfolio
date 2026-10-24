import type { RouteSeo } from "./types";

export const SITE_URL = "https://profile.mitya.dev";
export const SITE_NAME = "Mitya Kurs Portfolio";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_ALT =
  "Mitya Kurs — Senior Engineering Leader & Hands-On Builder";
export const PROFILE_IMAGE = `${SITE_URL}/profile.png`;
export const CV_URL = `${SITE_URL}/Mitya_Kurs.pdf`;
export const DEFAULT_TWITTER_CARD: RouteSeo["twitterCard"] = "summary";

const toCanonical = (path: string): string => {
  if (path === "/") {
    return `${SITE_URL}/`;
  }

  return new URL(path.replace(/^\//, ""), `${SITE_URL}/`).toString();
};

export const routeSeo = {
  home: {
    title: "Mitya Kurs | Senior Full-Stack Developer & Team Lead",
    description:
      "Mitya Kurs is a senior full-stack developer and team lead with 14 years of experience shipping products, leading teams, and building scalable systems.",
    path: "/",
    canonical: toCanonical("/"),
    indexable: true,
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: "summary_large_image",
  },
  about: {
    title: "About Mitya Kurs | Senior Full-Stack Developer",
    description:
      "Read about Mitya Kurs: full-stack developer and technical lead focused on product outcomes, resilient architecture, and high-performing teams.",
    path: "/theBuzz/about",
    canonical: toCanonical("/theBuzz/about"),
    indexable: true,
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: "summary_large_image",
  },
  experience: {
    title: "Experience | Mitya Kurs",
    description:
      "Career timeline of Mitya Kurs across legal-tech, healthcare, and SaaS: senior full-stack development, technical leadership, and product delivery.",
    path: "/theBuzz/experience",
    canonical: toCanonical("/theBuzz/experience"),
    indexable: true,
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: "summary_large_image",
  },
  toolbox: {
    title: "Toolbox | Mitya Kurs",
    description:
      "Explore Mitya Kurs's engineering toolbox across frontend, backend, cloud infrastructure, databases, testing, CI/CD, and AI-assisted development.",
    path: "/theBuzz/toolbox",
    canonical: toCanonical("/theBuzz/toolbox"),
    indexable: true,
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: "summary_large_image",
  },
  cv: {
    title: "CV — Mitya Kurs, Senior Engineering Leader",
    description:
      "Download or view the CV of Mitya Kurs — senior engineering leader and hands-on full-stack builder with 14 years shipping production systems across legal-tech, healthcare, and SaaS.",
    path: "/cv",
    canonical: toCanonical("/cv"),
    indexable: true,
    ogImage: `${SITE_URL}/cv-og.png`,
    ogImageAlt: "CV — Mitya Kurs, Senior Engineering Leader",
    twitterCard: "summary_large_image",
  },
  notFound: {
    title: "404 Not Found | Mitya Kurs",
    description: "The requested page was not found on Mitya Kurs's portfolio.",
    path: "/404",
    canonical: toCanonical("/404"),
    indexable: false,
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: "summary",
  },
} satisfies Record<
  "home" | "about" | "experience" | "toolbox" | "cv" | "notFound",
  RouteSeo
>;

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mitya Kurs",
  url: `${SITE_URL}/`,
  image: PROFILE_IMAGE,
  jobTitle: "Senior Full-Stack Developer and Team Lead",
  sameAs: [
    "https://github.com/mitekk",
    "https://www.linkedin.com/in/mitya-kurs/",
  ],
  knowsAbout: [
    "Full-Stack Development",
    "Technical Leadership",
    "React",
    "Node.js",
    "AWS",
    "System Architecture",
    "AI-assisted software development",
  ],
  worksFor: {
    "@type": "Organization",
    name: "LawPDF",
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "14 years of software engineering experience",
  },
  mainEntityOfPage: `${SITE_URL}/`,
  subjectOf: CV_URL,
};

export const cvStructuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": `${SITE_URL}/cv#cv`,
  name: "CV — Mitya Kurs, Senior Engineering Leader",
  url: `${SITE_URL}/cv`,
  about: { "@id": `${SITE_URL}/#person` },
  author: { "@id": `${SITE_URL}/#person` },
  encodingFormat: "application/pdf",
  associatedMedia: {
    "@type": "MediaObject",
    contentUrl: CV_URL,
    encodingFormat: "application/pdf",
  },
  inLanguage: "en",
};

/**
 * A WebPage node for a route, whose `mainEntity` is a reference to the one
 * `#person` node defined above rather than a copy of it. Three pages describing
 * the same `@id` enrich a single entity; three pages each minting their own
 * Person would compete.
 *
 * `mainEntityExtras` lets a route attach claims to that person — employment
 * history on /theBuzz/experience — without restating name, image or sameAs.
 */
export const profilePageStructuredData = (
  route: RouteSeo,
  mainEntityExtras: Record<string, unknown> = {},
) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${route.canonical}#page`,
  url: route.canonical,
  name: route.title,
  description: route.description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  inLanguage: "en",
  mainEntity: { "@id": `${SITE_URL}/#person`, ...mainEntityExtras },
});

const crumbName = (path: string): string => {
  const segment = path.split("/").filter(Boolean).pop() ?? "";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

/**
 * Home → page. The intermediate /theBuzz segment is deliberately absent: nginx
 * 301s it to /theBuzz/about, so a crumb for it would point a crawler at a
 * redirect.
 */
export const breadcrumbStructuredData = (route: RouteSeo) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${route.canonical}#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: crumbName(route.path),
      item: route.canonical,
    },
  ],
});

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: {
    "@id": `${SITE_URL}/#person`,
  },
};
