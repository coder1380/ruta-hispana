import type { NextConfig } from "next";

import('@opennextjs/cloudflare').then((adapter) =>
  adapter.initOpenNextCloudflareForDev()
);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
