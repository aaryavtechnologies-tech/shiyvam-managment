import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  serverActions: {
    bodySizeLimit: "10mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dmadyjivioztkrxeolyj.supabase.co",
      },
    ],
  },
};

export default nextConfig;
