import { client } from "@/sanity/lib/client";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";

/**
 * /llms.txt — the emerging standard (llmstxt.org) that gives LLMs (ChatGPT,
 * Claude, Perplexity, Gemini) a clean, link-rich map of the site so they can
 * understand and cite Pavani Realty accurately. Generated live from Sanity.
 */
const QUERY = `{
  "properties": *[_type=="property" && defined(slug.current)] | order(_createdAt desc) {
    "slug": slug.current, title, shortDescription, status, "district": district->name
  },
  "posts": *[_type=="post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current, title, excerpt
  }
}`;

const clean = (s?: string) => (s || "").replace(/\s+/g, " ").trim();

export async function GET() {
  let data: { properties?: any[]; posts?: any[] } = {};
  try {
    data = await client.fetch(QUERY);
  } catch (err) {
    console.error("[llms.txt] Sanity fetch failed:", err);
  }

  const L: string[] = [];
  L.push(`# ${SITE_NAME}`);
  L.push("");
  L.push(`> ${DEFAULT_DESCRIPTION}`);
  L.push("");
  L.push(
    `${SITE_NAME} is a luxury real estate agency based in Nairobi, Kenya, specialising in premium apartments, villas and off-plan developments across the country's most prestigious neighbourhoods — Westlands, Kilimani, Karen, Muthaiga, Runda and Riverside.`
  );
  L.push("");

  L.push("## Main pages");
  L.push(`- [Luxury Properties for Sale in Kenya](${SITE_URL}/properties): The full portfolio of luxury homes for sale.`);
  L.push(`- [Off-Plan Properties](${SITE_URL}/properties/off-plan): New developments available off-plan.`);
  L.push(`- [Ongoing Developments](${SITE_URL}/properties/on-going): Properties currently under construction.`);
  L.push(`- [Ready Properties](${SITE_URL}/properties/ready): Completed, move-in-ready homes.`);
  L.push(`- [About Pavani Realty Co](${SITE_URL}/about): The agency's story, leadership and values.`);
  L.push(`- [Insights & Market Journal](${SITE_URL}/insights): Kenya luxury real estate market commentary.`);
  L.push(`- [Contact](${SITE_URL}/contact): Enquire or book a private viewing.`);
  L.push("");

  if (data.properties?.length) {
    L.push("## Properties");
    for (const p of data.properties) {
      const meta = [p.district, p.status].filter(Boolean).join(", ");
      const desc = clean(p.shortDescription);
      L.push(`- [${p.title}](${SITE_URL}/properties/${p.slug})${desc ? `: ${desc}` : ""}${meta ? ` (${meta})` : ""}`);
    }
    L.push("");
  }

  if (data.posts?.length) {
    L.push("## Insights");
    for (const p of data.posts) {
      const ex = clean(p.excerpt);
      L.push(`- [${p.title}](${SITE_URL}/insights/${p.slug})${ex ? `: ${ex}` : ""}`);
    }
    L.push("");
  }

  L.push("## Contact");
  L.push(`- Website: ${SITE_URL}`);
  L.push(`- Full sitemap: ${SITE_URL}/sitemap.xml`);

  return new Response(L.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
