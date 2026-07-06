import { PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import PropertiesClient from "./PropertiesClient";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, itemListSchema, faqPageSchema, PROPERTY_FAQS } from "@/lib/seo";

export const metadata = {
  title: "Luxury Properties for Sale in Nairobi & Kenya",
  description:
    "Browse Pavani Realty Co's collection of luxury properties for sale in Kenya — premium apartments, villas and off-plan homes across Nairobi's most prestigious neighbourhoods.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage() {
  try {
    const [{ data: properties }, { data: siteSettings }] = await Promise.all([
      sanityFetch({ query: PROPERTIES_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY })
    ]);
    const jsonLd = graph(
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Properties", path: "/properties" },
      ]),
      itemListSchema(properties ?? []),
      faqPageSchema(PROPERTY_FAQS.map((f) => ({ q: f.q, a: f.a }))),
    );
    return (
      <>
        <JsonLd data={jsonLd} />
        <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
          <PropertiesClient initialProperties={properties ?? []} settings={siteSettings} />
        </Suspense>
      </>
    );
  } catch (err) {
    console.error("[Properties] Sanity fetch failed:", err);
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
        <PropertiesClient initialProperties={[]} settings={undefined} />
      </Suspense>
    );
  }
}
