"use client";

import { wagmiAdapter, projectId } from "@/config";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, sepolia, polygon, bsc } from "@reown/appkit/networks";
import { appkitTheme } from "@/config/theme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

// Use the same projectId that was used to create wagmiAdapter (from config)
// This ensures consistency - the adapter already has the validated projectId
const appKitProjectId = projectId?.trim() || "";

// Debug logging (client-side)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("[AppKit Client] Project ID check:", {
    fromConfig: projectId ? `✓ ${projectId.substring(0, 10)}...` : "✗ empty",
    fromEnv: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
      ? `✓ ${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID.substring(
          0,
          10
        )}...`
      : "✗ missing",
    finalProjectId: appKitProjectId
      ? `✓ ${appKitProjectId.substring(0, 10)}...`
      : "✗ empty",
  });
}

// Validate projectId before creating AppKit (prevents APKT008)
if (!appKitProjectId || appKitProjectId === "") {
  const errorMsg = `Project ID is invalid or missing (APKT008). 
  
Config projectId: ${projectId || "undefined"}
Client env: ${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "undefined"}
  
Fix:
1. Ensure .env.local exists in project root
2. Add: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
3. Get project ID from https://dashboard.reown.com
4. Restart dev server (stop with Ctrl+C, then npm run dev)`;

  if (typeof window === "undefined") {
    // Server-side: throw immediately
    throw new Error(errorMsg);
  } else {
    // Client-side: log and show error
    console.error("[AppKit] " + errorMsg);
  }
}

const metadata = {
  name: "Lenix Protocol",
  description: "Cross-border payments powered by blockchain technology",
  url: "https://Lenix Protocol.example",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Only create AppKit if projectId is valid
// Use the same projectId that was used to create wagmiAdapter (ensures consistency)
if (!appKitProjectId || appKitProjectId === "") {
  const error = new Error(
    `[AppKit] Cannot create AppKit: projectId is empty. Check .env.local has NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID and restart dev server.`
  );
  console.error(error.message);
  if (typeof window === "undefined") {
    throw error;
  }
} else {
  try {
    // Use the same projectId that was used to create the wagmiAdapter
    // The adapter already has the projectId embedded, but AppKit also needs it
    createAppKit({
      adapters: [wagmiAdapter],
      projectId: appKitProjectId,
      networks: [polygon, mainnet, sepolia, bsc],
      metadata,
      features: {
        // Disable analytics in development to avoid allowlist errors
        analytics: process.env.NODE_ENV === "production",
      },
      themeMode: appkitTheme.themeMode,

      // Theme customization using centralized configuration
      themeVariables: {
        // Primary brand colors
        "--w3m-color-mix": appkitTheme.primaryColor,
        "--w3m-color-mix-strength": appkitTheme.primaryColorStrength,
      },
    });

    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log(
        `[AppKit] Successfully initialized with project ID: ${appKitProjectId.substring(
          0,
          10
        )}...`
      );
    }
  } catch (error: any) {
    console.error("[AppKit] Failed to create AppKit:", error);
    if (error?.code === "APKT008" || error?.message?.includes("project ID")) {
      console.error(
        `[AppKit] APKT008: Project ID "${appKitProjectId.substring(
          0,
          10
        )}..." was passed but Reown rejected it.`,
        "\nPossible causes:",
        "\n1. Project ID format is invalid",
        "\n2. Project ID doesn't exist in Reown dashboard",
        "\n3. Env var not inlined in client bundle (restart dev server)",
        "\n4. Project ID mismatch between adapter and AppKit",
        "\nCheck: https://dashboard.reown.com"
      );
    }
    // Don't throw in client - let the app render and show the error in UI
    if (typeof window === "undefined") {
      throw error;
    }
  }
}

export default function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies ? decodeURIComponent(cookies) : cookies
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
