"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Share2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "../../lenix-wallet/_hooks/use-wallet";
import Link from "next/link";
import { useTranslations } from "next-intl";

const NETWORKS = [
  {
    id: "btc",
    key: "bitcoin",
    shortName: "BTC",
    icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
  },
  {
    id: "eth",
    key: "ethereum",
    shortName: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
  },
  {
    id: "bsc",
    key: "bnb",
    shortName: "BNB",
    icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png"
  },
  {
    id: "matic",
    key: "polygon",
    shortName: "MATIC",
    icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png"
  },
  {
    id: "arb",
    key: "arbitrum",
    shortName: "ARB",
    icon: "https://assets.coingecko.com/coins/images/16547/small/arbitrum.png"
  },
  {
    id: "op",
    key: "optimism",
    shortName: "OP",
    icon: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png"
  },
  {
    id: "avax",
    key: "avalanche",
    shortName: "AVAX",
    icon: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png"
  }
];

export function ReceiveAddressCard() {
  const t = useTranslations("AccountLenixWallet.receive_page");
  const { walletData, walletState } = useWallet();
  const [copied, setCopied] = useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = useState("eth");
  const [btcAddress, setBtcAddress] = useState("");

  const selectedNetwork = NETWORKS.find((n) => n.id === selectedNetworkId) || NETWORKS[0];
  const networkName = t(`networks.${selectedNetwork.key}.name`);
  const networkWarning = t(`networks.${selectedNetwork.key}.warning`);

  useEffect(() => {
    if (walletState !== "unlocked") return;

    fetch("/api/btc/wallet", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load Bitcoin address");
        const body = await response.json();
        setBtcAddress(body.data?.address || "");
      })
      .catch(() => setBtcAddress(""));
  }, [walletState]);

  const address = selectedNetworkId === "btc" ? btcAddress : walletData?.address || "";

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success(t("address_copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!address) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("share_title"),
          text: t("share_text", { network: networkName, address }),
        });
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
       handleCopy();
    }
  };

  if (walletState === "loading") {
      return (
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-xl flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
          </div>
      );
  }

  if (walletState === "no_wallet") {
      return (
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-xl text-center">
            <h2 className="text-xl font-bold text-white mb-4">{t("no_wallet_title")}</h2>
            <p className="text-zinc-500 mb-6">{t("no_wallet_description")}</p>
            <Link href="/lenix-wallet">
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">{t("go_to_wallet")}</Button>
            </Link>
        </div>
      );
  }

  // If locked, we still show the address if we have it in walletData? 
  // Actually, useWallet (Context) might not have walletData if locked.
  // In our Provider, lockWallet sets walletData to null.
  // So if locked, we need to ask user to unlock.
  if (walletState === "locked" || !address) {
     return (
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-xl text-center">
            <h2 className="text-xl font-bold text-white mb-4">{t("wallet_locked_title")}</h2>
            <p className="text-zinc-500 mb-6">{t("wallet_locked_description")}</p>
            <Link href="/lenix-wallet">
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">{t("unlock_wallet")}</Button>
            </Link>
        </div>
     );
  }

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-xl text-center">
      <div className="mb-6">
         <h2 className="text-2xl font-bold text-white">{t("card_title")}</h2>
         <p className="text-zinc-500 text-sm mt-1">{t("card_description")}</p>
      </div>

      {/* Network Selector */}
      <div className="mb-8">
         <Select value={selectedNetworkId} onValueChange={setSelectedNetworkId}>
            <SelectTrigger className="w-full bg-zinc-950/50 border-zinc-800 text-white h-14">
               <SelectValue placeholder={t("select_network")} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
               {NETWORKS.map((network) => (
                   <SelectItem 
                      key={network.id} 
                      value={network.id} 
                      className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer py-3"
                   >
                       <div className="flex items-center gap-3">
                           <Avatar className="h-6 w-6">
                               <AvatarImage src={network.icon} />
                               <AvatarFallback>{network.shortName[0]}</AvatarFallback>
                           </Avatar>
                           <span className="text-sm font-medium">{t(`networks.${network.key}.name`)}</span>
                       </div>
                   </SelectItem>
               ))}
            </SelectContent>
         </Select>
         
         <div className="mt-3 flex items-start justify-center gap-2 text-xs text-orange-400 bg-orange-400/10 py-2 px-3 rounded-lg border border-orange-400/20 text-left md:text-center">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{networkWarning}</span>
         </div>
         {selectedNetworkId === "btc" && !btcAddress && (
           <p className="mt-2 text-xs text-zinc-500">{t("bitcoin_provisioning")}</p>
         )}
      </div>

      {/* QR Code */}
      <div className="relative mx-auto w-56 h-56 bg-white p-3 rounded-2xl mb-8 shadow-inner ring-4 ring-white/5">
         <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden relative">
            {/* Generate QR Code */}
            <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}&bgcolor=ffffff&color=000000&margin=0`}
                alt={t("qr_alt")}
                className="w-full h-full object-contain mix-blend-multiply"
                style={{ imageRendering: "pixelated" }}
            />
         </div>
         {/* Center Logo Overlay */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-1.5 rounded-full shadow-lg border border-gray-100">
               <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedNetwork.icon} />
               </Avatar>
            </div>
         </div>
      </div>

      {/* Address Display */}
      <div 
        className="group relative bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 mb-6 hover:border-zinc-700 transition-colors cursor-pointer" 
        onClick={handleCopy}
      >
         <p className="text-xs text-zinc-500 mb-1">{t("address_label", { network: selectedNetwork.shortName })}</p>
         <p className="font-mono text-sm text-zinc-300 break-all select-all">{address}</p>
         <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-800">
               {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <Button variant="outline" className="w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700" onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? t("copied") : t("copy")}
         </Button>
         <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            {t("share")}
         </Button>
      </div>
    </div>
  );
}
