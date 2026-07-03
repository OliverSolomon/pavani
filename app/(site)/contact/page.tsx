import { SITE_SETTINGS_QUERY, CONTACT_PAGE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact | Pavani Premium Real Estate",
  description: "Connect with Pavani's expert advisors. Schedule a private consultation or inquire about our exclusive listings.",
};

export default async function ContactPage() {
  try {
    const [{ data: siteSettings }, { data: content }] = await Promise.all([
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: CONTACT_PAGE_QUERY }),
    ]);
    return <ContactClient settings={siteSettings} content={content ?? null} />;
  } catch (err) {
    console.error("[Contact] Sanity fetch failed:", err);
    return <ContactClient settings={undefined} content={null} />;
  }
}
