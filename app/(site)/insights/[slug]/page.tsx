import { notFound } from "next/navigation";
import {
  POST_BY_SLUG_QUERY,
  COMMENTS_BY_POST_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import ArticleClient from "./ArticleClient";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, graph, breadcrumbSchema, articleSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug } });
  if (!post) return { title: "Insights" };
  const canonical = `/insights/${slug}`;
  const description = post.excerpt || `${post.title} — market insight from Pavani Realty Co.`;
  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${post.title} | Pavani Realty Co`,
      description,
      url: absoluteUrl(canonical),
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.coverImage ? { images: [{ url: post.coverImage, alt: post.title }] } : {}),
    },
  };
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

  const jsonLd = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
      { name: post.title, path: `/insights/${slug}` },
    ]),
    articleSchema(post),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleClient post={post} comments={comments ?? []} settings={settings} />
    </>
  );
}
