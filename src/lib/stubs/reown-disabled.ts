/**
 * Build-time stand-in for Reown AppKit while NEXT_PUBLIC_ENABLE_WALLET is off.
 * Keeps modules that import the SDK from opening WalletConnect connections.
 */

type ChainStub = { id: number; name: string };

export const mainnet: ChainStub = { id: 1, name: "Ethereum" };
export const sepolia: ChainStub = { id: 11155111, name: "Sepolia" };
export const polygon: ChainStub = { id: 137, name: "Polygon" };
export const bsc: ChainStub = { id: 56, name: "BNB Smart Chain" };

export class WagmiAdapter {
  wagmiConfig: { chains: ChainStub[] };

  constructor(options?: { networks?: ChainStub[] }) {
    this.wagmiConfig = { chains: options?.networks ?? [] };
  }
}

export function createAppKit() {
  return {
    open: async () => undefined,
    close: async () => undefined,
  };
}

export function useAppKit() {
  return {
    open: async () => undefined,
    close: async () => undefined,
  };
}

export function useAppKitAccount() {
  return {
    address: undefined as string | undefined,
    isConnected: false,
    status: "disconnected" as const,
  };
}
