import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    return config;
  },
  experimental: {
    // 👇 disable Turbopack entirely
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
