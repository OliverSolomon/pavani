import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Kept unoptimized so editors can paste arbitrary external image URLs (externalUrl fields)
    // without every host needing to be allow-listed.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
