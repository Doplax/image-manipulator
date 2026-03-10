import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude sharp from client-side bundles
  serverExternalPackages: ["sharp"],

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
