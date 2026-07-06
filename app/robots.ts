import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// AI / LLM crawlers we explicitly welcome so Pavani content can surface and be
// cited in ChatGPT, Claude, Perplexity, Google AI Overviews and Apple Intelligence.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", // OpenAI
  "ClaudeBot", "anthropic-ai", "Claude-Web", // Anthropic
  "PerplexityBot", "PerplexityBot/1.0",      // Perplexity
  "Google-Extended",                          // Google Gemini / AI Overviews
  "Applebot-Extended",                        // Apple Intelligence
  "CCBot",                                    // Common Crawl (feeds many models)
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/studio", "/studio/", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Explicit allow for AI crawlers (a positive signal for generative-engine discoverability).
      { userAgent: AI_BOTS, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
