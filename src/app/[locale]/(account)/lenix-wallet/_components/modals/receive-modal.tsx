"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type NetworkId = "evm" | "bitcoin";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  evmAddress: string;
  bitcoinAddress?: string | null;
}

export function ReceiveModal({
  isOpen,
  onClose,
  evmAddress,
  bitcoinAddress,
}: ReceiveModalProps) {
  const t = useTranslations("AccountLenixWallet.receive_modal");
  const [copied, setCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>("evm");

  const networks = useMemo(
    () => [
      { id: "evm" as const, name: t("evm_networks"), chains: t("evm_chains") },
      { id: "bitcoin" as const, name: t("bitcoin"), chains: t("bitcoin_chains") },
    ],
    [t],
  );

  const currentNetwork = networks.find((n) => n.id === selectedNetwork)!;
  const displayAddress =
    selectedNetwork === "bitcoin" && bitcoinAddress ? bitcoinAddress : evmAddress;
  const hasBitcoin = !!bitcoinAddress;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden border-zinc-800 bg-zinc-950 p-0 text-white sm:max-w-sm">
        <DialogHeader className="border-b border-zinc-800 px-4 py-3 sm:px-5 sm:py-4">
          <DialogTitle className="text-base font-semibold">{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">{t("network")}</label>
            <Select
              value={selectedNetwork}
              onValueChange={(v) => setSelectedNetwork(v as NetworkId)}
            >
              <SelectTrigger className="h-10 w-full border-zinc-700 bg-zinc-900/50 text-sm text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900">
                {networks.map((network) => {
                  const disabled = network.id === "bitcoin" && !hasBitcoin;
                  return (
                    <SelectItem
                      key={network.id}
                      value={network.id}
                      disabled={disabled}
                      className="cursor-pointer text-white focus:bg-zinc-800 focus:text-white"
                    >
                      {network.name}
                      {disabled && (
                        <span className="ml-2 text-xs text-zinc-500">{t("not_set_up")}</span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl bg-white p-2.5 sm:p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(displayAddress)}&bgcolor=ffffff&color=000000&margin=0`}
                alt={t("qr_alt")}
                width={140}
                height={140}
                className="h-[140px] w-[140px] sm:h-[160px] sm:w-[160px]"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-1.5 text-center text-xs text-zinc-500">{currentNetwork.chains}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-left transition-colors hover:border-zinc-600"
            >
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-zinc-300 sm:text-xs">
                {displayAddress}
              </span>
              {copied ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4 shrink-0 text-zinc-500" />
              )}
            </button>
          </div>

          <p className="rounded-lg bg-yellow-500/10 px-3 py-2 text-center text-[11px] text-yellow-400/90 sm:text-xs">
            {selectedNetwork === "bitcoin" ? t("btc_warning") : t("evm_warning")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
