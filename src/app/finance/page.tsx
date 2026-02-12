import type { Metadata } from "next";
import { FinanceContent } from "./components/finance-content";

export const metadata: Metadata = {
  title: "Lenix Finance – Secure Crypto-to-Fiat & Lending Protocol",
  description: "Securely bridge crypto assets with local payment networks. Lenix Finance empowers crypto holders with professional lending, vault, and payments infrastructure.",
  keywords: ["Crypto Finance", "Crypto Lending", "Stablecoin Payments", "Blockchain Banking", "LNX Protocol"],
};

export default function LenixFinancePage() {
  return <FinanceContent />;
}

