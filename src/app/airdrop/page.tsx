import type { Metadata } from "next";
import { AirdropContent } from "./components/airdrop-content";

export const metadata: Metadata = {
  title: "LNX Token Airdrop & Rewards | Lenix Protocol",
  description: "Participate in the Lenix Protocol airdrop and earn LNX tokens. Secure your spot in the future of blockchain forensics and asset recovery.",
  keywords: ["Crypto Airdrop", "LNX Token", "Free Crypto", "Lenix Rewards", "Blockchain Security Rewards"],
};

export default function AirdropPage() {
  return <AirdropContent />;
}

