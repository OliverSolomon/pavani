import { notFound } from "next/navigation";
import {
  POST_BY_SLUG_QUERY,
  COMMENTS_BY_POST_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import ArticleClient from "./ArticleClient";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, articleSchema, resolveMeta } from "@/lib/seo";
import { collectCitations, countWords, type PortableBlock } from "@/lib/article";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug } });
  if (!post) return { title: "Insights" };
  return resolveMeta({
    seo: post.seo,
    title: post.title,
    description: post.excerpt || `${post.title} — market insight from Pavani Realty Co.`,
    path: `/insights/${slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [{ data: post }, { data: settings }] = await Promise.all([
    sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  if (!post) notFound();

  const { data: comments } = await sanityFetch({
    query: COMMENTS_BY_POST_QUERY,
    params: { postId: post._id },
  });

  // Citations and length are read straight from the body so the structured
  // data always matches what is actually on the page.
  const blocks = (post.content ?? null) as PortableBlock[] | null;
  const { citations } = collectCitations(blocks);
  const wordCount = countWords(blocks);

  const jsonLd = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
      { name: post.title, path: `/insights/${slug}` },
    ]),
    articleSchema(post, { citations, wordCount }),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleClient post={post} comments={comments ?? []} settings={settings} />
    </>
  );
}
