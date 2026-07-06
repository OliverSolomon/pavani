import { PROPERTY_DETAIL_QUERY, SITE_SETTINGS_QUERY, PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import PropertyDetailClient from "./PropertyDetailClient";
import PropertiesClient from "../PropertiesClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";

/* Status keywords are served as clean routes (/properties/off-plan …) rather than
   query params, for SEO. They take precedence over property slugs. */
const STATUSES: Record<string, string> = {
  "off-plan": "Off-Plan",
  "on-going": "On-Going",
  ready: "Ready",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const statusLabel = STATUSES[slug];
  if (statusLabel) {
    return {
      title: `${statusLabel} Properties | Pavani Realty Co`,
      description: `Browse ${statusLabel} luxury properties across Nairobi and beyond with Pavani Realty Co.`,
    };
  }
  try {
    const { data: property } = await sanityFetch({
      query: PROPERTY_DETAIL_QUERY,
      params: { slug },
    });
    if (!property) return { title: "Property Not Found" };
    return {
      title: `${property.title} | Pavani Realty Co`,
      description: property.shortDescription || `View details for ${property.title}`,
    };
  } catch {
    return { title: "Property | Pavani Realty Co" };
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Status listing (e.g. /properties/off-plan) — render the filtered grid instead of a detail page.
  if (STATUSES[slug]) {
    try {
      const [{ data: properties }, { data: siteSettings }] = await Promise.all([
        sanityFetch({ query: PROPERTIES_QUERY }),
        sanityFetch({ query: SITE_SETTINGS_QUERY }),
      ]);
      return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
          <PropertiesClient initialProperties={properties ?? []} settings={siteSettings} initialStatus={slug} />
        </Suspense>
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
    return <PropertyDetailClient property={{ ...property, siteSettings }} />;
  } catch (err) {
    console.error("[PropertyPage] Sanity fetch failed:", err);
    notFound();
  }
}
