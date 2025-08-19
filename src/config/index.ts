import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia, polygon, bsc } from "@reown/appkit/networks";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const networks = [mainnet, sepolia, polygon, bsc];

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  networks,
  projectId
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