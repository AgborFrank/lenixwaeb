import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const walletConnectEnabled =
  process.env.NEXT_PUBLIC_ENABLE_WALLET === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_WALLET === "1";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow external images from crypto icon sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/Cryptofonts/cryptoicons@**/SVG/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/Cryptofonts/cryptoicons/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/**',
      },
    ],
  },
  // www is a second host that currently serves the same site. Send it to the apex
  // before next-intl runs. Path and query are preserved.
  // A Vercel Domains redirect would do this at the edge instead; left unset on purpose.
  async redirects() {
    const host = [{ type: "host" as const, value: "www.lenixprotocol.com" }];
    return [
      {
        source: "/",
        has: host,
        destination: "https://lenixprotocol.com/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: host,
        destination: "https://lenixprotocol.com/:path*",
        permanent: true,
      },
    ];
  },
  // Fix COOP check / WalletConnect popup: allow same-origin popups
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  // Expose WalletConnect / Reown project ID (same env name as drain)
  env: {
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
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
      const alias = { ...config.resolve.alias };
      // Keep the Reown / WalletConnect SDK out of the build unless the flag is on.
      // `@/context` would otherwise be traced from the locale layout and initialize AppKit.
      if (!walletConnectEnabled) {
        const disabledContext = path.resolve(process.cwd(), "src/context/disabled.tsx");
        const reownStub = path.resolve(process.cwd(), "src/lib/stubs/reown-disabled.ts");
        alias["@/context$"] = disabledContext;
        alias["@/context/index$"] = disabledContext;
        alias[path.resolve(process.cwd(), "src/context")] = disabledContext;
        alias[path.resolve(process.cwd(), "src/context/index.tsx")] = disabledContext;
        alias["@reown/appkit$"] = reownStub;
        alias["@reown/appkit/react$"] = reownStub;
        alias["@reown/appkit/networks$"] = reownStub;
        alias["@reown/appkit-adapter-wagmi$"] = reownStub;
      }
      config.resolve.alias = alias;
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

export default withNextIntl(nextConfig);
