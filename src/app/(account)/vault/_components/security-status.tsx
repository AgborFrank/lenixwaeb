"use client";

import { ShieldCheck, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { WalletState } from "@/app/(account)/lenix-wallet/_hooks/use-wallet";

interface SecurityStatusProps {
  walletState: WalletState;
  walletAddress?: string;
  transactions?: any[];
}

export function SecurityStatus({
  walletState,
  walletAddress,
  transactions = [],
}: SecurityStatusProps) {
  const hasWallet = walletState === "locked" || walletState === "unlocked";
  const securityScore = hasWallet ? 92 : 0;

  const recentActivity = transactions.slice(0, 5).map((tx) => {
    const symbol = tx.symbol || tx.token_symbol || "Token";
    const amount = tx.value
      ? (Number(tx.value) / Math.pow(10, tx.decimals || 18)).toFixed(4)
      : null;
    const time = tx.block_timestamp
      ? formatTimeAgo(new Date(tx.block_timestamp))
      : "Recently";
    const fromShort = tx.from_address ? `${tx.from_address.slice(0, 6)}...` : "";
    const toShort = tx.to_address ? `${tx.to_address.slice(0, 6)}...` : "";
    const desc = fromShort && toShort ? `${fromShort} → ${toShort}` : "Transaction";
    return {
      title: `${symbol} Transfer`,
      time,
      amount: amount ? `${amount} ${symbol}` : null,
      desc,
      status: "Completed",
    };
  });

  if (recentActivity.length === 0 && hasWallet) {
    recentActivity.push(
      { title: "Wallet Connected", time: "Just now", amount: null, desc: walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Vault", status: "Active" }
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Vault Security Health</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Security Score</span>
              <span className="text-white font-bold">{securityScore}/100</span>
            </div>
            <Progress value={securityScore} className="h-2 bg-zinc-800" />
          </div>

          <div className="grid gap-3">
            <SecurityItem
              icon={CheckCircle2}
              label="Wallet"
              status={hasWallet ? "Connected" : "Not connected"}
              color={hasWallet ? "text-emerald-400" : "text-zinc-500"}
            />
            <SecurityItem
              icon={CheckCircle2}
              label="Cold Storage"
              status="Active"
              color="text-emerald-400"
            />
            <SecurityItem
              icon={CheckCircle2}
              label="Encrypted Vault"
              status="Active"
              color="text-emerald-400"
            />
            <SecurityItem
              icon={walletState === "unlocked" ? CheckCircle2 : AlertTriangle}
              label="Session"
              status={walletState === "unlocked" ? "Unlocked" : walletState === "locked" ? "Locked" : "No wallet"}
              color={walletState === "unlocked" ? "text-emerald-400" : "text-yellow-400"}
              action={walletState === "locked" ? "Unlock" : undefined}
              actionHref={walletState === "locked" ? "/lenix-wallet" : undefined}
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <Button variant="link" className="text-xs text-zinc-500 hover:text-white p-0" asChild>
            <Link href="/lenix-wallet">View All</Link>
          </Button>
        </div>

        <div className="space-y-4 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-800" />

          {recentActivity.length === 0 ? (
            <p className="text-sm text-zinc-500 pl-6">No recent activity</p>
          ) : (
            recentActivity.map((item, i) => (
              <ActivityItem
                key={i}
                title={item.title}
                time={item.time}
                amount={item.amount}
                desc={item.desc}
                status={item.status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SecurityItem({
  icon: Icon,
  label,
  status,
  color,
  action,
  actionHref,
}: {
  icon: any;
  label: string;
  status: string;
  color: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-zinc-300">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium ${color}`}>{status}</span>
        {action && actionHref && (
          <Link
            href={actionHref}
            className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-400/20 transition-colors"
          >
            {action}
          </Link>
        )}
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  time,
  amount,
  desc,
  status,
}: {
  title: string;
  time: string;
  amount?: string | null;
  desc?: string;
  status: string;
}) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-900 border-2 border-zinc-700 ring-4 ring-zinc-950 z-10" />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-zinc-500">{time}</p>
        </div>
        <div className="text-right">
          {amount && <p className="text-sm font-bold text-white">{amount}</p>}
          {desc && <p className="text-xs text-zinc-400">{desc}</p>}
          <span className="text-[10px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 mt-1 inline-block">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}
