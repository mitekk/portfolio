import { Helmet } from "react-helmet-async";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "../../seo/config";
import type { RouteSeo } from "../../seo/types";

interface SeoHeadProps {
  meta: RouteSeo;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ meta, jsonLd }) => {
  const twitterCard = meta.twitterCard ?? DEFAULT_TWITTER_CARD;
  const robots = meta.indexable ? "index,follow" : "noindex,nofollow";
  const image = meta.ogImage ?? DEFAULT_OG_IMAGE;
  const imageAlt = meta.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT;
  const jsonLdBlocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={meta.canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {jsonLdBlocks.map((schema, index) => (
        <script key={`${meta.path}-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
