import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@uwdsc/ui"],
  images: {
    // TODO: Remove `unoptimized` once Vercel Image Optimization quota is sorted
    // Temporary: serves images directly from the Supabase CDN / static assets to avoid the metered optimizer's 402.
    unoptimized: true,
  },
};

export default nextConfig;
