import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Update to the live custom domain when it goes live (keep in sync with layout metadataBase).
  const baseUrl = 'https://pavani.re';

  const routes = ['', '/properties', '/gallery', '/insights', '/about', '/contact'];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
}
