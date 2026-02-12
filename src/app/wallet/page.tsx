import type { Metadata } from "next";
import { WalletContent } from "./components/wallet-content";

export const metadata: Metadata = {
  title: "Lenix Wallet – The Most Secure Vault for Your Assets",
  description: "Experience professional-grade security with the Lenix Wallet. Securely manage, store, and grow your crypto assets with advanced encryption and recovery protocols.",
  keywords: ["Crypto Wallet", "Secure Wallet", "Blockchain Vault", "LNX Wallet", "Asset Security"],
};

export default function LenixWalletPage() {
  return <WalletContent />;
}

