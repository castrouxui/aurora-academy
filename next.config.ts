import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.lacapital.com.ar",
      },
      {
        protocol: "https",
        hostname: "www.clarin.com",
      },
      {
        protocol: "https",
        hostname: "www.puntal.com.ar",
      },
      {
        protocol: "https",
        hostname: "assets.baenegocios.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
