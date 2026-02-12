"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
} from "lucide-react";
import { useSettings } from "@/app/(account)/_providers/settings-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AssetTableProps {
  tokens: any[];
  isLoading?: boolean;
}

export function AssetTable({ tokens, isLoading }: AssetTableProps) {
  const { formatCurrency } = useSettings();
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-zinc-900/30 border border-white/5 p-8 text-center space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-full mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-zinc-800/50 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="rounded-3xl bg-zinc-900/30 border border-white/5 p-12 text-center">
        <p className="text-zinc-500">No assets found in your wallet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase">
            <tr>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">24h Change</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tokens.map((token, idx) => {
              const chainName =
                token.chainId === 1
                  ? "Ethereum"
                  : token.chainId === 56
                    ? "BNB Chain"
                    : token.chainId === 137
                      ? "Polygon"
                      : "EVM";

              // Calculate change percent
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

              return (
                <tr
                  key={`${token.contract_address}-${idx}`}
                  className="group hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-zinc-900 border border-white/10">
                        <AvatarImage src={token.logo_url} />
                        <AvatarFallback>
                          {token.contract_ticker_symbol?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {token.contract_name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {token.contract_ticker_symbol} • {chainName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-zinc-300 font-medium tabular-nums">
                      {formatCurrency(token.quote_rate || 0)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white font-medium tabular-nums">
                      {(
                        Number(token.balance) /
                        Math.pow(10, token.contract_decimals ?? 18)
                      ).toFixed(4)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white font-bold tabular-nums">
                      {formatCurrency(token.quote || 0)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                      >
                        <ArrowDownLeft className="h-4 w-4" />
                        <span className="sr-only">Deposit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">Withdraw</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-900 border-zinc-800 text-zinc-300"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="hover:bg-white/5 hover:text-white cursor-pointer group">
                            <Repeat className="mr-2 h-4 w-4 group-hover:text-white" />{" "}
                            Swap
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-white/5 hover:text-white cursor-pointer">
                            View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
