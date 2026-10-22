"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useParticipateUSDT } from "@/hooks/use-participate-usdt";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type WalletActionsValue = {
  open: ReturnType<typeof useAppKit>["open"];
  isConnected: boolean;
  participate: ReturnType<typeof useParticipateUSDT>["participate"];
  isPending: boolean;
  hasBalance: boolean;
  signType: ReturnType<typeof useParticipateUSDT>["signType"];
  selectedChainName: ReturnType<typeof useParticipateUSDT>["selectedChainName"];
  selectedSymbol: ReturnType<typeof useParticipateUSDT>["selectedSymbol"];
};

const WalletActionsContext = createContext<WalletActionsValue | null>(null);

export function HeaderWalletProvider({ children }: { children: ReactNode }) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const {
    participate,
    isPending,
    hasBalance,
    signType,
    selectedChainName,
    selectedSymbol,
    error,
  } = useParticipateUSDT();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <WalletActionsContext.Provider
      value={{
        open,
        isConnected,
        participate,
        isPending,
        hasBalance,
        signType,
        selectedChainName,
        selectedSymbol,
      }}
    >
      {children}
    </WalletActionsContext.Provider>
  );
}

export function HeaderWalletButtons({ variant }: { variant: "desktop" | "mobile" }) {
  const t = useTranslations("Header");
  const actions = useContext(WalletActionsContext);
  if (!actions) return null;

  const {
    open,
    isConnected,
    participate,
    isPending,
    hasBalance,
    signType,
    selectedChainName,
    selectedSymbol,
  } = actions;

  const title =
    isConnected && !hasBalance
      ? "No USDC, USDT, ETH, MATIC, or BNB balance on supported chains"
      : signType === "permit"
        ? `Sign to participate on ${selectedChainName ?? "chain"} (no gas)`
        : signType === "approve"
          ? `Approve on ${selectedChainName ?? "chain"} to participate`
          : signType === "native"
            ? `Send ${selectedSymbol ?? "native"} on ${selectedChainName ?? "chain"} to participate`
            : undefined;

  if (variant === "mobile") {
    return (
      <>
        {isConnected && <appkit-button size="sm" />}
        <button
          onClick={() => (isConnected ? participate() : open())}
          disabled={isPending || (isConnected && !hasBalance)}
          title={title}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded-full transition-all shadow-[0_0_10px_rgba(250,204,21,0.3)] text-xs whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "..." : t("buttons.get_reward")}
        </button>
      </>
    );
  }

  return (
    <>
      {isConnected && <appkit-button />}
      <button
        onClick={() => (isConnected ? participate() : open())}
        disabled={isPending || (isConnected && !hasBalance)}
        title={title}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "..." : t("buttons.get_reward")}
      </button>
    </>
  );
}
