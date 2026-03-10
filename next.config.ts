import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude sharp from client-side bundles
  serverExternalPackages: ["sharp"],

  // Empty turbopack config to silence the Turbopack/webpack mismatch error
  // Turbopack handles WASM natively in Next.js 16
  turbopack: {},
};

export default nextConfig;
