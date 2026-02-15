import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@uwdsc/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tpkibsgwhostzcovlyjf.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
