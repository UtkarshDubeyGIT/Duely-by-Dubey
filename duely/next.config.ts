import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly anchor Turbopack's workspace root to this Next.js app directory.
    // Without this, Turbopack walks up and finds the monorepo's package-lock.json,
    // incorrectly treating it as the workspace root and mis-bundling Edge middleware.
    // process.cwd() is the directory from which `next build` is run (the duely/ dir).
    root: process.cwd(),
  },
};

export default nextConfig;
