import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude Node-only packages from client-side bundles
  serverExternalPackages: ["sharp", "cloudinary"],

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
