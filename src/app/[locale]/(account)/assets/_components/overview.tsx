"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/app/[locale]/(account)/_providers/settings-provider";

interface OverviewProps {
  totalBalance: number;
  change24h: number;
  change24hValue: number;
  isLoading: boolean;
}

export function Overview({
  totalBalance,
  change24h,
  change24hValue,
  isLoading,
}: OverviewProps) {
  const { formatCurrency } = useSettings();
  if (isLoading) {
    return (
      <div className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-36 rounded-2xl bg-zinc-900/50 md:col-span-2"></div>
        <div className="h-36 rounded-2xl bg-zinc-900/50"></div>
      </div>
    );
  }

  const isPositive = change24h >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-900 to-black p-5 md:col-span-2">
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <Wallet className="h-24 w-24 rotate-12 text-white" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div>
            <p className="mb-1 text-sm font-medium text-zinc-400">Total Asset Value</p>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {formatCurrency(totalBalance)}
              <span
                className={`ml-3 rounded-md border px-1.5 py-0.5 text-sm font-medium ${
                  isPositive
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {change24h.toFixed(2)}%
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-8 bg-white text-black hover:bg-zinc-200">
              <ArrowDownLeft className="mr-1.5 h-3.5 w-3.5" />
              Deposit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-zinc-400">
            24h Profit/Loss
          </p>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
            <div>
              <p className="text-lg font-bold text-white">
                {isPositive ? "+" : ""}
                {formatCurrency(Math.abs(change24hValue))}
              </p>
              <p className="text-xs text-zinc-500">vs yesterday</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        <div>
          <p className="mb-1.5 text-xs font-medium text-zinc-400">
            30d Profit/Loss
          </p>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-zinc-600" />
            <div>
              <p className="text-lg font-bold text-zinc-500">--</p>
              <p className="text-xs text-zinc-600">Not enough data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
