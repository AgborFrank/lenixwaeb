"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSettings } from "@/app/(account)/_providers/settings-provider";

interface TokenListProps {
  tokens: any[];
  isLoading?: boolean;
  isMarketData?: boolean;
}

export function TokenList({ tokens, isLoading, isMarketData }: TokenListProps) {
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-32 bg-zinc-800 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-zinc-900 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white px-2">Wallet Assets</h3>
        <div className="p-8 text-center rounded-xl bg-zinc-900/40 border border-white/5">
          <p className="text-zinc-400">No assets found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-white">
          {isMarketData ? "Market Overview" : "Wallet Assets"}
        </h3>
        {!isMarketData && (
          <Badge
            variant="outline"
            className="border-zinc-800 bg-zinc-900/50 text-zinc-400 backdrop-blur"
          >
            {tokens.length} Assets
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {tokens.map((token, idx) => {
          // Handle both change string from popular and calculated change from real data
          let changePercent = 0;
          if (token.change) {
            changePercent = parseFloat(token.change);
          } else if (token.quote_rate_24h) {
            changePercent =
              ((token.quote_rate - token.quote_rate_24h) /
                token.quote_rate_24h) *
              100;
          }

          const isPositive = changePercent >= 0;
          const chainLabel =
            token.chainId === 1
              ? "ETH"
              : token.chainId === 56
                ? "BSC"
                : token.chainId === 137
                  ? "POLY"
                  : "EVM";

          return (
            <div
              key={`${token.contract_address}-${idx}`}
              className="group relative flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all cursor-pointer overflow-hidden"
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-center gap-4 z-10">
                <Avatar className="h-10 w-10 border border-white/10 bg-zinc-900">
                  <AvatarImage src={token.logo_url} alt={token.contract_name} />
                  <AvatarFallback>
                    {token.contract_ticker_symbol?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-base">
                      {token.contract_ticker_symbol}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-500 font-medium">
                      {token.chainId === 1
                        ? "Ethereum"
                        : token.chainId === 56
                          ? "BNB Smart Chain"
                          : token.chainId === 137
                            ? "Polygon"
                            : "EVM Chain"}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-opacity-10",
                        isPositive
                          ? "text-emerald-400 bg-emerald-400/10"
                          : "text-red-400 bg-red-400/10"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right z-10">
                <p className="font-bold text-white tabular-nums tracking-tight">
                  {formatCurrency(token.quote || 0)}
                </p>
                <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2">
                  {!isMarketData && (
                    <p className="text-sm text-zinc-400 tabular-nums">
                      {(
                        Number(token.balance) /
                        Math.pow(10, token.contract_decimals)
                      ).toFixed(4)}{" "}
                      {token.contract_ticker_symbol}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
