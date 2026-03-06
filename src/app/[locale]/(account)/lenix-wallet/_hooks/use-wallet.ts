"use client";

import { useWalletContext, WalletState, WalletData } from "@/app/[locale]/(account)/_providers/wallet-provider";

export type { WalletState, WalletData };

export function useWallet() {
    return useWalletContext();
}
