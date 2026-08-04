import { Helmet } from "react-helmet-async";

const BASE_URL = "https://ville-connectee.lovable.app";

interface StructuredDataProps {
  /** Route path, e.g. "/evenements" — used for the self-referencing canonical/og:url. */
  path: string;
  title: string;
  description: string;
  /** One or more JSON-LD objects to embed on the page. */
  schemas?: Record<string, unknown>[];
}

/**
 * Per-route head metadata (title, description, canonical, og:*) plus JSON-LD.
 */
export function StructuredData({ path, title, description, schemas = [] }: StructuredDataProps) {
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
