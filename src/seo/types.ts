export interface RouteSeo {
  title: string;
  description: string;
  path: string;
  canonical: string;
  indexable: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: "summary" | "summary_large_image";
}
