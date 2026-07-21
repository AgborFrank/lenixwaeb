"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { ReceiveModal } from "./_components/modals/receive-modal";
import { SendModal } from "./_components/modals/send-modal";
import { ActionGrid } from "./_components/action-grid";
import { BitcoinWalletCard } from "./_components/bitcoin-wallet-card";
import { SetupWizard } from "./_components/setup/setup-wizard";
import { TokenList } from "./_components/token-list";
import { TransactionHistory } from "./_components/transaction-history";
import { WalletCard } from "./_components/wallet-card";
import { WalletStatus } from "./_components/wallet-status";
import { useWallet } from "./_hooks/use-wallet";
import { getPopularCoins } from "./actions";
import { wallet } from "@/lib/wallet-styles";

export default function LenixWalletPage() {
  const t = useTranslations("AccountLenixWallet");
  const {
    walletState,
    walletData,
    unlockWallet,
    lockWallet,
    portfolio,
    bitcoinAddress,
  } = useWallet();

  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [popularCoins, setPopularCoins] = useState<any[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [activeWalletCard, setActiveWalletCard] = useState(0);
  const walletCarouselRef = useRef<HTMLDivElement>(null);

  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const networks = useMemo(
    () => [
      { id: "all", name: t("networks.all") },
      { id: 1, name: t("networks.ethereum") },
      { id: 56, name: t("networks.bsc") },
      { id: 137, name: t("networks.polygon") },
      { id: 0, name: t("networks.bitcoin") },
    ],
    [t],
  );

  useEffect(() => {
    if (walletState === "unlocked" && portfolio && portfolio.tokens.length === 0) {
      getPopularCoins().then(setPopularCoins).catch(console.error);
    }
  }, [walletState, portfolio]);

  const showWalletCard = (index: number) => {
    const carousel = walletCarouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({ left: index * carousel.clientWidth, behavior: "smooth" });
    setActiveWalletCard(index);
  };

  useEffect(() => {
    if (walletState !== "unlocked") return;
    showWalletCard(selectedChain === "0" ? 1 : 0);
  }, [selectedChain, walletState]);

  const isLoadingData =
    walletState === "loading" || (walletState === "unlocked" && !portfolio);

  if (walletState === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
      </div>
    );
  }

  if (walletState === "no_wallet") {
    return (
      <div className={wallet.container}>
        <div className="mb-6">
          <h1 className={wallet.pageTitle}>{t("page.setup_title")}</h1>
          <p className={wallet.pageSubtitle}>{t("page.setup_subtitle")}</p>
        </div>
        <SetupWizard onComplete={() => window.location.reload()} />
      </div>
    );
  }

  if (walletState === "locked") {
    const handleUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsUnlocking(true);
      try {
        await unlockWallet(unlockPassword);
        toast.success(t("toast.wallet_unlocked"));
      } catch {
        toast.error(t("toast.incorrect_password"));
      } finally {
        setIsUnlocking(false);
      }
    };

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/10 rounded-3xl p-6">
          <div className="mb-8 text-center">
            <Image
              src="/assets/vectors/start-deposit-no.svg"
              alt={t("page.logo_alt")}
              className="mx-auto mb-4"
              width={56}
              height={56}
            />
            <h1 className={wallet.pageTitle}>{t("page.unlock_title")}</h1>
            <p className={wallet.pageSubtitle}>{t("page.unlock_subtitle")}</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              type="password"
              placeholder={t("page.password_placeholder")}
              className={wallet.input}
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={!unlockPassword || isUnlocking}
              className={wallet.primaryBtn}
            >
              {isUnlocking ? t("page.unlocking") : t("page.unlock")}
              {!isUnlocking && <ArrowRight className="ml-2 inline h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const chainId = selectedChain === "all" ? "all" : Number(selectedChain);
  const visibleTokens = portfolio?.tokens
    ? portfolio.tokens.filter((token) => chainId === "all" || token.chainId === chainId)
    : [];

  const displayTokens = visibleTokens.length > 0 ? visibleTokens : popularCoins;
  const isMarketData = visibleTokens.length === 0 && popularCoins.length > 0;

  const filteredDisplayTokens = isMarketData
    ? displayTokens.filter((token) => chainId === "all" || token.chainId === chainId)
    : displayTokens;

  return (
    <div className={wallet.container}>
      <div className="mb-5 flex flex-row items-center justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <h1 className={wallet.pageTitle}>{t("page.title")}</h1>
          <p className={wallet.pageSubtitle}>{t("page.subtitle")}</p>
        </div>

        <Select value={selectedChain} onValueChange={setSelectedChain}>
          <SelectTrigger className="h-9 w-[140px] shrink-0 border-zinc-700 bg-zinc-900/50 text-sm text-white sm:h-10 sm:w-[160px]">
            <SelectValue placeholder={t("page.network_placeholder")} className="text-xs" />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
            {networks.map((net) => (
              <SelectItem
                key={net.id}
                value={String(net.id)}
                className="cursor-pointer text-xs focus:bg-zinc-800 focus:text-white"
              >
                {net.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={wallet.grid}>
        <div className={wallet.mainCol}>
          <div className="relative">
            <div
              ref={walletCarouselRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const index = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
                setActiveWalletCard(Math.min(1, Math.max(0, index)));
              }}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="min-w-full snap-center">
                <WalletCard
                  walletData={walletData}
                  lockWallet={lockWallet}
                  balance={portfolio?.totalBalanceUsd}
                />
              </div>
              <div className="min-w-full snap-center">
                <BitcoinWalletCard />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showWalletCard(0)}
              disabled={activeWalletCard === 0}
              aria-label={t("page.show_evm_wallet")}
              className="absolute left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-white backdrop-blur transition-opacity hover:bg-zinc-800 disabled:opacity-0 sm:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => showWalletCard(1)}
              disabled={activeWalletCard === 1}
              aria-label={t("page.show_bitcoin_wallet")}
              className="absolute right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-white backdrop-blur transition-opacity hover:bg-zinc-800 disabled:opacity-0 sm:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="mt-3 flex justify-center gap-1.5">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => showWalletCard(i)}
                  aria-label={i === 0 ? t("page.evm_wallet") : t("page.bitcoin_wallet")}
                  className={`h-1.5 rounded-full transition-all ${
                    activeWalletCard === i
                      ? "w-5 bg-white"
                      : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>
          </div>

          <ActionGrid
            onSend={() => setIsSendOpen(true)}
            onReceive={() => setIsReceiveOpen(true)}
            onBuy={() => window.open("https://www.moonpay.com/buy/btc", "_blank")}
            onSwap={() => toast.info(t("actions.coming_soon"))}
          />

          <TokenList
            tokens={filteredDisplayTokens}
            isLoading={isLoadingData}
            isMarketData={isMarketData}
          />
        </div>

        <div className={wallet.sideCol}>
          <WalletStatus />

          <div className={wallet.card}>
            <TransactionHistory
              transactions={portfolio?.transactions || []}
              isLoading={isLoadingData}
            />
          </div>
        </div>
      </div>

      {walletData?.address && (
        <ReceiveModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
          evmAddress={walletData.address}
          bitcoinAddress={bitcoinAddress}
        />
      )}

      {portfolio && (
        <SendModal
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          tokens={portfolio.tokens}
        />
      )}
    </div>
  );
}
