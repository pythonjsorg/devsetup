import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served at pythonjs.org/devtools via Next.js Multi-Zones (see docs/multi-zone-setup.md).
  // basePath prefixes all routes + /_next assets with /devtools.
  basePath: '/devtools',
  images: {
    unoptimized: true,
  },
  // basePath is auto-applied to both source and destination here.
  async redirects() {
    return [
      { source: '/install/:tool', destination: '/tools/:tool', permanent: true },
    ];
  },
};

export default nextConfig;
