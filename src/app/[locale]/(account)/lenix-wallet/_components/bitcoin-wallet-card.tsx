"use client";

import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Image from "next/image";
import { useSettings } from "@/app/[locale]/(account)/_providers/settings-provider";
import { useWallet } from "../_hooks/use-wallet";
import { wallet } from "@/lib/wallet-styles";

export function BitcoinWalletCard() {
  const t = useTranslations("AccountLenixWallet.bitcoin_card");
  const { formatCurrency } = useSettings();
  const { walletState, bitcoinAddress, portfolio, provisionBitcoinWallet } = useWallet();
  const [password, setPassword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (walletState !== "unlocked") return null;

  const bitcoinToken = portfolio?.tokens.find(
    (token: any) => token.chainId === 0 && token.contract_ticker_symbol === "BTC"
  );
  const bitcoinAmount = bitcoinToken ? Number(bitcoinToken.balance || 0) / 100_000_000 : 0;
  const bitcoinUsdValue = Number(bitcoinToken?.quote || 0);

  const handleGenerate = async () => {
    if (password.length < 8) {
      toast.error(t("enter_password"));
      return;
    }
    setIsGenerating(true);
    try {
      await provisionBitcoinWallet(password);
      setPassword("");
      toast.success(t("wallet_created"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("create_failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!bitcoinAddress) return;
    await navigator.clipboard.writeText(bitcoinAddress);
    setCopied(true);
    toast.success(t("address_copied"));
    window.setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <section className={[wallet.balanceCard, "border-none rounded-3xl bg-linear-to-br from-[#82ffac] via-[#06ffa4] to-[#09ff9d] bg-[linear-gradient(180deg,#50FFC2_0%,#06ffa4_50%,#09ff9d_100%)]"].join(" ")}>
      <div>
        <p className={wallet.cardTitle}>{t("btc_balance")}</p>
        {bitcoinAddress ? (
          <div className="mt-2">
            <span className={wallet.balanceText}>
              <Image src="/assets/vectors/btc.webp" alt={t("bitcoin_alt")} width={30} height={30} />
              {bitcoinAmount.toFixed(8)}
            </span>
            <p className="mt-1 text-xs text-black sm:text-sm">{formatCurrency(bitcoinUsdValue)}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">{t("not_activated")}</p>
        )}
      </div>

      {!bitcoinAddress && (
        <div className="mt-5 rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
          <p className="text-sm text-zinc-300">{t("activate_prompt")}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              autoComplete="current-password"
              className={wallet.input}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || password.length < 8}
              className="h-10 shrink-0 rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 sm:h-11"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("creating")}
                </span>
              ) : (
                t("activate")
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-end justify-between pt-4">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-zinc-800 sm:text-xs">
            {t("bitcoin_network")}
          </p>
          <p className="mt-0.5 text-xs font-bold text-black sm:text-sm">{t("segwit")}</p>
        </div>
        {bitcoinAddress && (
          <button type="button" onClick={handleCopy} className={wallet.ghostBtn}>
            <span className="font-mono font-bold text-black">{truncateAddress(bitcoinAddress)}</span>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 text-black" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
