import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    return config;
  },
  experimental: {
    turbo: {
      rules: {},
    },
  },
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v1.exercisedb.dev", 
      },
    ],
  },
};

export default nextConfig;
