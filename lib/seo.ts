/* eslint-disable @typescript-eslint/no-explicit-any --
 * The schema.org builders below consume Sanity documents whose shape is
 * defined by GROQ projections rather than by TypeScript. Typing each builder
 * against a generated document type would couple this file to every query and
 * break whenever a projection changes, for no runtime benefit — these
 * functions only ever read optional fields and omit what is missing.
 */
/**
 * Central SEO configuration + JSON-LD (schema.org) builders.
 *
 * Set NEXT_PUBLIC_SITE_URL to the live production domain in Vercel so canonical
 * URLs, Open Graph tags and structured data all point at the right origin.
 */
import type { Metadata } from "next";

/**
 * The canonical origin for the whole site.
 *
 * This value ends up in every canonical tag, sitemap entry, Open Graph image
 * URL and JSON-LD @id. If it does not match the domain actually being served,
 * search engines treat the real pages as duplicates of a domain that does not
 * exist, and the site can drop out of the index entirely — so the fallback is
 * the live production domain, never a placeholder.
 *
 * Still set NEXT_PUBLIC_SITE_URL in Vercel; the fallback is a safety net.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://pavanirealtyco.com"
).replace(/\/+$/, "");
export const SITE_NAME = "Pavani Realty Co";
export const SITE_TAGLINE = "Luxury Real Estate in Kenya";
/**
 * Default social share image. Kept at exactly 1200x630 and as a compressed JPEG
 * (well under 300 KB) because WhatsApp silently drops link previews whose image
 * is over roughly 500 KB, and the declared og:image:width/height must match the
 * real file or some scrapers reject it.
 */
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = "Pavani Realty Co, luxury real estate in Kenya";
export const TWITTER_HANDLE = "@pavanirealty";

/** Brand crimson, used for the mobile browser toolbar and the web app manifest. */
export const THEME_COLOR = "#82000d";
export const BACKGROUND_COLOR = "#faf8f4";

/** Kept under ~155 characters so Google does not truncate it in results. */
export const DEFAULT_DESCRIPTION =
  "Pavani Realty Co is Kenya's luxury real estate authority: exclusive apartments, villas and off-plan homes across Nairobi's most prestigious neighbourhoods.";

/**
 * Makes any share image safe for WhatsApp, Facebook, LinkedIn and X.
 *
 * Images uploaded in Sanity are served at their original size (often several
 * megabytes), which is too heavy for WhatsApp previews. Sanity's image CDN can
 * resize on the fly, so those URLs are rewritten to a 1200x630 JPEG crop.
 * External URLs are passed through untouched; with no URL the default is used.
 */
export function ogImageUrl(url?: string | null): string {
  if (!url) return OG_IMAGE;
  if (!url.includes("cdn.sanity.io/images/")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(OG_IMAGE_WIDTH));
    u.searchParams.set("h", String(OG_IMAGE_HEIGHT));
    u.searchParams.set("fit", "crop");
    u.searchParams.set("fm", "jpg");
    u.searchParams.set("q", "80");
    return u.toString();
  } catch {
    return url;
  }
}

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

/**
 * RealEstateListing — the type search engines and AI assistants actually
 * associate with property. Emitted alongside the Product node above: Product
 * carries the price into shopping/rich results, RealEstateListing carries the
 * meaning ("this is a home for sale in Kilimani, Nairobi, Kenya").
 *
 * The address block is the part that wins location queries. Without an explicit
 * addressLocality / addressRegion / addressCountry, a page about a Karen villa
 * is just a page with the word "Karen" on it.
 */
export function realEstateListingSchema(property: any) {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const districtName =
    typeof property.district === "object" ? property.district?.name : property.district;
  const amount = typeof property.price === "object" ? property.price?.amount : property.price;
  const currency = typeof property.price === "object" ? property.price?.currency : "KES";
  const beds = property.details?.split("|")[0]?.trim();
  const baths = property.details?.split("|")[1]?.trim();

  // Coordinates come from the pasted Google Maps link where one exists.
  const coords = extractLatLng(property.googleMapsUrl);

  const amenityFeature = [
    ...(property.amenities ?? []),
    ...(property.otherAmenities ?? []),
  ]
    .slice(0, 30)
    .map((value: string) => ({
      "@type": "LocationFeatureSpecification",
      name: amenityDisplayName(value),
      value: true,
    }));

  return {
    "@type": "RealEstateListing",
    name: property.title,
    url,
    description:
      property.shortDescription ||
      `${property.title} — luxury property for sale in ${districtName || "Nairobi"}, Kenya.`,
    ...(property.imageUrl ? { image: [property.imageUrl] } : {}),
    datePosted: property._createdAt || undefined,
    ...(amount
      ? {
          offers: {
            "@type": "Offer",
            price: String(amount).replace(/[^0-9.]/g, "") || undefined,
            priceCurrency: (currency || "KES").toUpperCase(),
            availability: "https://schema.org/InStock",
            url,
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
    about: {
      "@type": "SingleFamilyResidence",
      name: property.title,
      ...(beds ? { numberOfBedrooms: parseInt(beds, 10) || undefined } : {}),
      ...(baths ? { numberOfBathroomsTotal: parseInt(baths, 10) || undefined } : {}),
      ...(property.size ? { floorSize: { "@type": "QuantitativeValue", name: property.size } } : {}),
      address: {
        "@type": "PostalAddress",
        ...(property.street ? { streetAddress: property.street } : {}),
        addressLocality: districtName || "Nairobi",
        addressRegion: property.county || "Nairobi County",
        addressCountry: "KE",
      },
      ...(coords
        ? { geo: { "@type": "GeoCoordinates", latitude: coords.lat, longitude: coords.lng } }
        : {}),
      ...(amenityFeature.length ? { amenityFeature } : {}),
    },
  };
}

/** Pulls @lat,lng out of a pasted Google Maps URL, if present. */
function extractLatLng(mapsUrl?: string): { lat: number; lng: number } | null {
  if (!mapsUrl) return null;
  const at = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };
  const q = mapsUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };
  return null;
}

/** Amenity slug → readable name, kept local to avoid a schema-layer import cycle. */
function amenityDisplayName(value: string): string {
  return value
    .replace(/^(security|utility|access|leisure|community|interior|outdoor|service)-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * RealEstateAgent — the local-business entity.
 *
 * This is what ties the brand to a place. Queries like "luxury property agents
 * in Nairobi" or "premium real estate Westlands" are local-intent queries, and
 * without a LocalBusiness node with an address and service area the site is not
 * a candidate for them at all.
 */
export function realEstateAgentSchema(settings?: any) {
  const contact = settings?.contact ?? {};
  return {
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#agent`,
    name: SITE_NAME,
    url: SITE_URL,
    image: OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    priceRange: "KES 15,000,000 – KES 500,000,000",
    currenciesAccepted: "KES, USD",
    address: {
      "@type": "PostalAddress",
      ...(contact.address ? { streetAddress: contact.address } : {}),
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE",
    },
    areaServed: [
      { "@type": "City", name: "Nairobi" },
      { "@type": "Country", name: "Kenya" },
      ...[
        "Westlands",
        "Kilimani",
        "Karen",
        "Muthaiga",
        "Runda",
        "Lavington",
        "Riverside",
        "Gigiri",
        "Parklands",
        "Spring Valley",
      ].map((name) => ({ "@type": "Place", name })),
    ],
    knowsAbout: DEFAULT_KEYWORDS,
    parentOrganization: { "@id": ORG_ID },
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

/**
 * BlogPosting for an insight article.
 *
 * Beyond basic indexing this is tuned for answer engines. Three things move the
 * needle on being cited by ChatGPT, Perplexity and AI Overviews:
 *  · `abstract` / `description` carrying the TL;DR — roughly 44% of LLM
 *    citations come from the opening portion of a page, so the summary is the
 *    passage most likely to be quoted
 *  · `citation` listing the sources the piece draws on, which is a direct
 *    verifiability signal
 *  · `speakable` marking which parts are safe to read aloud or extract
 *
 * @param opts.citations sources collected from inline citation marks
 * @param opts.wordCount computed from the body
 */
export function articleSchema(
  post: any,
  opts?: { citations?: { title: string; url?: string; publisher?: string }[]; wordCount?: number }
) {
  const url = absoluteUrl(`/insights/${post.slug}`);
  const takeaways = (post.keyTakeaways ?? []).filter(Boolean);
  const citations = (opts?.citations ?? []).filter((c) => c?.title);

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.tldr || post.excerpt || post.title,
    ...(post.tldr ? { abstract: post.tldr } : {}),
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
    url,
    inLanguage: "en-KE",
    isAccessibleForFree: true,
    ...(post.category ? { articleSection: post.category } : {}),
    ...(opts?.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(takeaways.length ? { keywords: takeaways.join(", ") } : {}),
    ...(citations.length
      ? {
          citation: citations.map((c) => ({
            "@type": "CreativeWork",
            name: c.title,
            ...(c.url ? { url: c.url } : {}),
            ...(c.publisher ? { publisher: { "@type": "Organization", name: c.publisher } } : {}),
          })),
        }
      : {}),
    // Tells assistants which parts of the page are the summary.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".summary-tldr-text", ".summary-takeaway-list", ".article-standfirst"],
    },
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
  const ogImg = ogImageUrl(seo?.ogImage || image);

  const og: Record<string, unknown> = {
    title: seo?.metaTitle ? finalTitle : `${finalTitle} | ${SITE_NAME}`,
    description: finalDesc,
    url: absoluteUrl(path),
    type,
    images: [{ url: ogImg, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: finalTitle }],
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
