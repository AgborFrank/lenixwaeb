"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { mainnet, polygon, bsc } from "@reown/appkit/networks";
import { formatBalance } from "@/lib/utils";

// Chain configuration for proper native token display
const CHAIN_CONFIG = {
  [mainnet.id]: { symbol: "ETH", name: "Ethereum" },
  [polygon.id]: { symbol: "MATIC", name: "Polygon" },
  [bsc.id]: { symbol: "BNB", name: "BSC" },
};

export default function CustomWalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  // Get the correct native token symbol for the current chain
  const chainConfig = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
  const nativeSymbol = chainConfig?.symbol || "ETH";

  if (!isConnected) {
    return <appkit-button />;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-300">
          {formatBalance(balance?.value || BigInt(0), balance?.decimals || 18)}{" "}
          {nativeSymbol}
        </span>
        <span className="text-xs text-gray-500">
          {chainConfig?.name || "Unknown Chain"}
        </span>
      </div>
      <appkit-button />
    </div>
  );
}
