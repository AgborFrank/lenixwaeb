import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Exclude problematic packages from server components bundling
  // This prevents test files from being imported
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  // Turbopack config (Next.js 16 default)
  turbopack: {},
  // Webpack config for non-Turbopack builds
  webpack: (config, { isServer }) => {
    // Exclude test directories from module resolution
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    // Ignore warnings for test files in node_modules
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/thread-stream\/test/,
      },
      {
        module: /node_modules\/.*\/test\//,
      },
      /Failed to parse source map/,
    ];

    return config;
  },
};

export default nextConfig;
