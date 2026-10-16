import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // ← أضف هذا السطر
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;