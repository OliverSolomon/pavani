import { PROPERTY_DETAIL_QUERY, SITE_SETTINGS_QUERY, PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import PropertyDetailClient from "./PropertyDetailClient";
import PropertiesClient from "../PropertiesClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import {
  absoluteUrl, graph, breadcrumbSchema, propertyListingSchema, videoSchema,
  itemListSchema, faqPageSchema, PROPERTY_FAQS,
} from "@/lib/seo";

/* Status keywords are served as clean routes (/properties/off-plan …) rather than
   query params, for SEO. They take precedence over property slugs. */
const STATUSES: Record<string, string> = {
  "off-plan": "Off-Plan",
  "on-going": "On-Going",
  ready: "Ready",
};

function youTubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/))([\w-]{11})/);
  if (m?.[1]) return m[1];
  return /^[\w-]{11}$/.test(url) ? url : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const statusLabel = STATUSES[slug];
  if (statusLabel) {
    return {
      title: `${statusLabel} Luxury Properties for Sale in Kenya`,
      description: `Browse ${statusLabel.toLowerCase()} luxury properties, apartments and villas for sale across Nairobi and Kenya with Pavani Realty Co.`,
      alternates: { canonical: `/properties/${slug}` },
    };
  }
  try {
    const { data: property } = await sanityFetch({
      query: PROPERTY_DETAIL_QUERY,
      params: { slug },
    });
    if (!property) return { title: "Property Not Found" };
    const districtName = typeof property.district === "object" ? property.district?.name : property.district;
    const description =
      property.shortDescription ||
      `${property.title} — luxury property for sale in ${districtName || "Nairobi"}, Kenya. Book a private viewing with Pavani Realty Co.`;
    const canonical = `/properties/${slug}`;
    return {
      title: property.title,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${property.title} | Pavani Realty Co`,
        description,
        url: absoluteUrl(canonical),
        type: "website",
        ...(property.imageUrl ? { images: [{ url: property.imageUrl, alt: property.title }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${property.title} | Pavani Realty Co`,
        description,
        ...(property.imageUrl ? { images: [property.imageUrl] } : {}),
      },
    };
  } catch {
    return { title: "Property" };
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Status listing (e.g. /properties/off-plan) — render the filtered grid instead of a detail page.
  if (STATUSES[slug]) {
    const label = STATUSES[slug];
    try {
      const [{ data: properties }, { data: siteSettings }] = await Promise.all([
        sanityFetch({ query: PROPERTIES_QUERY }),
        sanityFetch({ query: SITE_SETTINGS_QUERY }),
      ]);
      const filtered = (properties || []).filter(
        (p: any) => (p.status || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug
      );
      const jsonLd = graph(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Properties", path: "/properties" },
          { name: `${label} Properties`, path: `/properties/${slug}` },
        ]),
        itemListSchema(filtered),
        faqPageSchema(PROPERTY_FAQS.map((f) => ({ q: f.q, a: f.a }))),
      );
      return (
        <>
          <JsonLd data={jsonLd} />
          <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
            <PropertiesClient initialProperties={properties ?? []} settings={siteSettings} initialStatus={slug} />
          </Suspense>
        </>
      );
    } catch (err) {
      console.error("[Properties/status] Sanity fetch failed:", err);
      return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
          <PropertiesClient initialProperties={[]} settings={undefined} initialStatus={slug} />
        </Suspense>
      );
    }
  }

  try {
    const [{ data: property }, { data: siteSettings }] = await Promise.all([
      sanityFetch({ query: PROPERTY_DETAIL_QUERY, params: { slug } }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);
    if (!property) notFound();

    const districtName = typeof property.district === "object" ? property.district?.name : property.district;
    const vid = youTubeId(property.videoTour);
    const jsonLd = graph(
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Properties", path: "/properties" },
        ...(districtName ? [{ name: districtName, path: `/properties?search=${encodeURIComponent(districtName)}` }] : []),
        { name: property.title, path: `/properties/${slug}` },
      ]),
      propertyListingSchema(property),
      ...(vid ? [videoSchema(property, vid)] : []),
    );

    return (
      <>
        <JsonLd data={jsonLd} />
        <PropertyDetailClient property={{ ...property, siteSettings }} />
      </>
    );
  } catch (err) {
    console.error("[PropertyPage] Sanity fetch failed:", err);
    notFound();
  }
}
