import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ["cdn.sanity.io", "images.unsplash.com", "res.cloudinary.com"],
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
