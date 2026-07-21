"use client";

import { Eye, EyeOff, Copy, Check, Lock, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/app/[locale]/(account)/_providers/settings-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { WalletData } from "../_hooks/use-wallet";
import { wallet } from "@/lib/wallet-styles";

interface WalletCardProps {
  walletData: WalletData | null;
  lockWallet: () => void;
  balance?: number;
}

export function WalletCard({ walletData, lockWallet, balance }: WalletCardProps) {
  const t = useTranslations("AccountLenixWallet.wallet_card");
  const { formatCurrency } = useSettings();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (walletData?.address) {
      navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      toast.success(t("address_copied"));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#ffdc50] via-[#F0B90B] to-[#f9dd88] p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-black/60">{t("total_balance")}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums tracking-tight text-black sm:text-3xl lg:text-4xl">
              {showBalance
                ? balance !== undefined
                  ? formatCurrency(balance)
                  : "$0.00"
                : "••••••"}
            </span>
            <button
              type="button"
              onClick={() => setShowBalance((v) => !v)}
              className="rounded p-1 text-black/50 transition-colors hover:bg-black/10 hover:text-black"
              aria-label={showBalance ? t("hide_balance") : t("show_balance")}
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-lg p-2 text-black/50 transition-colors hover:bg-black/10 hover:text-black"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-zinc-800 bg-zinc-900 text-white">
            <DropdownMenuItem
              onClick={lockWallet}
              className="cursor-pointer text-red-400 focus:bg-white/5 focus:text-red-400"
            >
              <Lock className="mr-2 h-4 w-4" />
              {t("lock_wallet")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-black/10 pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-black/50 sm:text-xs">
            {t("evm_networks")}
          </p>
          <p className="mt-0.5 text-xs text-black/70 sm:text-sm">{t("evm_chains")}</p>
        </div>
        {walletData?.address && (
          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black/10 px-2 py-1 text-xs text-black/80 transition-colors hover:bg-black/20 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            <span className="font-mono">{truncateAddress(walletData.address)}</span>
            {copied ? (
              <Check className="h-3 w-3 text-black" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
