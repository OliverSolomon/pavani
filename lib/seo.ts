/**
 * Central SEO configuration + JSON-LD (schema.org) builders.
 *
 * Set NEXT_PUBLIC_SITE_URL to the live production domain in Vercel so canonical
 * URLs, Open Graph tags and structured data all point at the right origin.
 */
import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pavani.re").replace(/\/+$/, "");
export const SITE_NAME = "Pavani Realty Co";
export const SITE_TAGLINE = "Luxury Real Estate in Kenya";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = "@pavanirealty";

export const DEFAULT_DESCRIPTION =
  "Pavani Realty Co is Kenya's authority in luxury real estate — exclusive apartments, villas and off-plan homes for sale across Nairobi's most prestigious neighbourhoods. Browse premium listings and book a private viewing.";

/** Primary keyword cluster targeting "luxury properties in Kenya" and its variants. */
export const DEFAULT_KEYWORDS = [
  "luxury properties in Kenya",
  "luxury real estate Kenya",
  "luxury homes for sale in Kenya",
  "luxury apartments Nairobi",
  "luxury villas Nairobi",
  "property for sale in Nairobi",
  "off-plan properties Nairobi",
  "high-end real estate Nairobi",
  "premium properties Kenya",
  "Westlands apartments for sale",
  "Kilimani apartments for sale",
  "Karen homes for sale",
  "Pavani Realty",
];

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* ─────────────────────────────── Structured data ─────────────────────────────── */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** RealEstateAgent (a LocalBusiness subtype) — powers local + brand SERP presence. */
export function organizationSchema(settings?: any) {
  const contact = settings?.contact || {};
  const socials = settings?.socials || {};
  const brand = settings?.brand || {};
  const sameAs = [
    socials.linkedin, socials.facebook, socials.instagram,
    socials.youtube, socials.tiktok, socials.twitter,
  ].filter(Boolean);

  return {
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "Pavani Realty",
    url: SITE_URL,
    logo: brand.logoPrimary || `${SITE_URL}/logo-crimson.svg`,
    image: OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address || "Westlands",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
    areaServed: { "@type": "Country", name: "Kenya" },
    priceRange: "$$$$",
    knowsAbout: [
      "Luxury Real Estate",
      "Property Investment",
      "Off-Plan Developments",
      "Prime Residential Property",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-KE",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/properties?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Property listing → Product + Offer so the price is eligible for rich results. */
export function propertyListingSchema(property: any) {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const amount = typeof property.price === "object" ? property.price?.amount : property.price;
  const currency = typeof property.price === "object" ? property.price?.currency : "USD";
  const districtName = typeof property.district === "object" ? property.district?.name : property.district;
  const beds = property.details?.split("|")[0]?.trim();
  const baths = property.details?.split("|")[1]?.trim();
  const images = [
    property.imageUrl,
    ...(property.media?.map((m: any) => m.url).filter(Boolean) || []),
  ].filter(Boolean).slice(0, 6);

  const additionalProperty = [
    beds && { "@type": "PropertyValue", name: "Bedrooms", value: beds },
    baths && { "@type": "PropertyValue", name: "Bathrooms", value: baths },
    property.size && { "@type": "PropertyValue", name: "Floor size", value: property.size },
    property.yearBuilt && { "@type": "PropertyValue", name: "Year built", value: property.yearBuilt },
    property.status && { "@type": "PropertyValue", name: "Status", value: property.status },
  ].filter(Boolean);

  return {
    "@type": "Product",
    name: property.title,
    description: property.shortDescription || `${property.title} — luxury property for sale in ${districtName || "Nairobi"}, Kenya.`,
    ...(images.length ? { image: images } : {}),
    url,
    sku: property._id,
    category: "Luxury Residential Property",
    brand: { "@type": "Organization", name: SITE_NAME },
    ...(additionalProperty.length ? { additionalProperty } : {}),
    ...(amount
      ? {
          offers: {
            "@type": "Offer",
            price: String(amount).replace(/[^0-9.]/g, "") || undefined,
            priceCurrency: (currency || "USD").toUpperCase(),
            availability: "https://schema.org/InStock",
            url,
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
  };
}

/** VideoObject for a property's YouTube tour → eligible for video rich results. */
export function videoSchema(property: any, youTubeId: string) {
  return {
    "@type": "VideoObject",
    name: `${property.title} — Video Tour`,
    description: property.shortDescription || `Video tour of ${property.title}.`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg`],
    uploadDate: property._createdAt || new Date().toISOString(),
    contentUrl: `https://www.youtube.com/watch?v=${youTubeId}`,
    embedUrl: `https://www.youtube.com/embed/${youTubeId}`,
  };
}

export function articleSchema(post: any) {
  const url = absoluteUrl(`/insights/${post.slug}`);
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
    url,
    ...(post.category ? { articleSection: post.category } : {}),
  };
}

export function itemListSchema(properties: any[]) {
  return {
    "@type": "ItemList",
    itemListElement: (properties || []).slice(0, 25).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/properties/${p.slug}`),
      name: p.title,
    })),
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** Visible + structured FAQ for the properties page (long-tail "luxury properties in Kenya" intent). */
export const PROPERTY_FAQS = [
  {
    q: "Where can I buy luxury properties in Kenya?",
    a: "Kenya's luxury property market is concentrated in Nairobi's prime neighbourhoods — Westlands, Kilimani, Karen, Muthaiga, Runda and Riverside. Pavani Realty Co curates exclusive apartments, villas and off-plan developments across these prestigious addresses.",
  },
  {
    q: "How much do luxury homes cost in Nairobi?",
    a: "Luxury apartments in Nairobi typically start from around KES 15 million, while premium villas and standalone homes in gated estates such as Karen and Runda can range from KES 60 million upwards, depending on size, finish and location.",
  },
  {
    q: "Can foreigners buy property in Kenya?",
    a: "Yes. Foreign nationals can own apartments and leasehold property in Kenya. Pavani Realty Co guides international buyers through due diligence, legal documentation and the full acquisition process.",
  },
  {
    q: "What are off-plan properties?",
    a: "Off-plan properties are homes bought before or during construction, usually at a lower entry price with flexible payment plans. They are one of the strongest routes to capital growth in Nairobi's luxury market.",
  },
];

/** Wraps schema.org nodes in a single @graph document. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/* ─────────────────────────── CMS-aware page metadata ─────────────────────────── */

interface SeoInput {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Builds a Next.js Metadata object, preferring editor-supplied Sanity `seo`
 * fields and falling back to the code-computed title/description/image.
 * When `metaTitle` is set the brand suffix is NOT appended (editor has full control).
 */
export function resolveMeta(opts: {
  seo?: SeoInput | null;
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const { seo, title, description, path, image, type = "website", publishedTime } = opts;
  const finalTitle = seo?.metaTitle || title;
  const finalDesc = seo?.metaDescription || description;
  const ogImg = seo?.ogImage || image || OG_IMAGE;

  const og: Record<string, unknown> = {
    title: seo?.metaTitle ? finalTitle : `${finalTitle} | ${SITE_NAME}`,
    description: finalDesc,
    url: absoluteUrl(path),
    type,
    images: [{ url: ogImg }],
  };
  if (publishedTime) og.publishedTime = publishedTime;

  const meta: Metadata = {
    title: seo?.metaTitle ? { absolute: seo.metaTitle } : title,
    description: finalDesc,
    alternates: { canonical: path },
    openGraph: og as Metadata["openGraph"],
    twitter: { card: "summary_large_image", title: finalTitle, description: finalDesc, images: [ogImg] },
  };
  if (seo?.keywords?.length) meta.keywords = seo.keywords;
  if (seo?.noIndex) meta.robots = { index: false, follow: true };
  return meta;
}
