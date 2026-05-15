import type { NextConfig } from "next";

const appRoot = process.cwd();

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
};

export default nextConfig;
