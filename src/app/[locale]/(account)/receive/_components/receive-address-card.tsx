"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Info, Loader2, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "../../lenix-wallet/_hooks/use-wallet";

const NETWORKS = [
  {
    id: "btc",
    key: "bitcoin",
    shortName: "BTC",
    icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  {
    id: "eth",
    key: "ethereum",
    shortName: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    id: "bsc",
    key: "bnb",
    shortName: "BNB",
    icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    id: "matic",
    key: "polygon",
    shortName: "MATIC",
    icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  },
  {
    id: "arb",
    key: "arbitrum",
    shortName: "ARB",
    icon: "https://assets.coingecko.com/coins/images/16547/small/arbitrum.png",
  },
  {
    id: "op",
    key: "optimism",
    shortName: "OP",
    icon: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  },
  {
    id: "avax",
    key: "avalanche",
    shortName: "AVAX",
    icon: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  },
] as const;

export function ReceiveAddressCard() {
  const t = useTranslations("AccountLenixWallet.receive_page");
  const { walletData, walletState } = useWallet();
  const [copied, setCopied] = useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = useState<(typeof NETWORKS)[number]["id"]>("eth");
  const [btcAddress, setBtcAddress] = useState("");

  const selectedNetwork = NETWORKS.find((network) => network.id === selectedNetworkId) ?? NETWORKS[1];
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

  async function handleCopy() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success(t("address_copied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    if (!address) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("share_title"),
          text: t("share_text", { network: networkName, address }),
        });
        return;
      } catch {
        return;
      }
    }
    await handleCopy();
  }

  if (walletState === "loading") {
    return (
      <section className={`${adminGlass.surface} flex min-h-48 items-center justify-center`} aria-busy="true">
        <Loader2 className="size-5 animate-spin text-zinc-400" />
      </section>
    );
  }

  if (walletState === "no_wallet") {
    return (
      <StatusPanel
        title={t("no_wallet_title")}
        body={t("no_wallet_description")}
        href="/lenix-wallet"
        action={t("go_to_wallet")}
      />
    );
  }

  if (walletState === "locked" || (selectedNetworkId !== "btc" && !address)) {
    return (
      <StatusPanel
        title={t("wallet_locked_title")}
        body={t("wallet_locked_description")}
        href="/lenix-wallet"
        action={t("unlock_wallet")}
      />
    );
  }

  return (
    <section className={`${adminGlass.surface} p-4 sm:p-5`}>
      <div className="space-y-3">
        <Select value={selectedNetworkId} onValueChange={(value) => setSelectedNetworkId(value as (typeof NETWORKS)[number]["id"])}>
          <SelectTrigger className={`h-9 w-full ${adminGlass.field}`} aria-label={t("select_network")}>
            <SelectValue placeholder={t("select_network")} />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-zinc-950 text-white">
            {NETWORKS.map((network) => (
              <SelectItem key={network.id} value={network.id} className="cursor-pointer py-2">
                <span className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarImage src={network.icon} alt="" />
                    <AvatarFallback>{network.shortName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{t(`networks.${network.key}.name`)}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="flex items-start gap-2 rounded-md border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs leading-relaxed text-orange-300">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>{networkWarning}</span>
        </p>
        {selectedNetworkId === "btc" && !btcAddress ? (
          <p className="text-xs text-zinc-500">{t("bitcoin_provisioning")}</p>
        ) : null}
      </div>

      {address ? (
        <>
          <div className="mx-auto my-5 w-44 rounded-lg bg-white p-2.5">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}&bgcolor=ffffff&color=000000&margin=0`}
              alt={t("qr_alt")}
              width={176}
              height={176}
              className="h-full w-full"
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex w-full items-start justify-between gap-3 rounded-md px-3 py-2.5 text-left ${adminGlass.field}`}
          >
            <span className="min-w-0">
              <span className="block text-[11px] text-zinc-500">{t("address_label", { network: selectedNetwork.shortName })}</span>
              <span className="mt-1 block break-all font-mono text-xs text-zinc-200">{address}</span>
            </span>
            {copied ? <Check className="mt-1 size-4 shrink-0 text-emerald-300" /> : <Copy className="mt-1 size-4 shrink-0 text-zinc-400" />}
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" className={`h-9 ${adminGlass.field}`} onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? t("copied") : t("copy")}
            </Button>
            <Button type="button" className="h-9 bg-white text-black hover:bg-zinc-200" onClick={handleShare}>
              <Share2 className="size-4" />
              {t("share")}
            </Button>
          </div>
        </>
      ) : null}
    </section>
  );
}

function StatusPanel({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href: "/lenix-wallet";
  action: string;
}) {
  return (
    <section className={`${adminGlass.surface} px-5 py-8 text-center`}>
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">{body}</p>
      <Button type="button" size="sm" className="mt-4 bg-white text-black hover:bg-zinc-200" asChild>
        <Link href={href}>{action}</Link>
      </Button>
    </section>
  );
}
