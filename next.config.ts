import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Required for better-sqlite3 (native module)
  serverExternalPackages: ["better-sqlite3"],
  // Resolve JSON imports
  experimental: {},
};

export default nextConfig;
