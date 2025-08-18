"use client";

import { wagmiAdapter, projectId } from "@/config";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, sepolia, polygon, bsc } from "@reown/appkit/networks";
import { appkitTheme } from "@/config/theme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "Lenix Protocol",
  description: "Cross-border payments powered by blockchain technology",
  url: "https://lenix.example",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, sepolia, polygon, bsc],
  metadata,
  features: {
    analytics: true,
  },
  themeMode: appkitTheme.themeMode,

  // Theme customization using centralized configuration
  themeVariables: {
    // Primary brand colors
    "--w3m-color-mix": appkitTheme.primaryColor,
    "--w3m-color-mix-strength": appkitTheme.primaryColorStrength,
    
  },
});

export default function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
