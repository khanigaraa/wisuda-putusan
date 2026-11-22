import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Foto sudah dikompres manual. Optimizer dimatikan karena ia mengambil foto
  // dari folder public tanpa cookie akses, sehingga ikut terkunci oleh proxy.ts.
  images: { unoptimized: true },
  partialPrefetching: true,
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
