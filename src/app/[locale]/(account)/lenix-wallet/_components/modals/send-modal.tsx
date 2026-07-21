"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SendForm, type SendFormToken } from "../../../send/_components/send-form";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: any[];
}

function toSendFormTokens(tokens: any[]): SendFormToken[] {
  return tokens
    .filter((t: any) => Number(t.balance) > 0)
    .map((token: any): SendFormToken => {
      const decimals = Number(token.contract_decimals ?? 18);
      const chainId = Number(token.chainId ?? token.chain_id ?? 0);
      const symbol = token.contract_ticker_symbol || token.symbol || "—";
      const id = `${token.contract_address ?? symbol}-${chainId}-${token.native_token ? "native" : "erc20"}`;
      const name = token.contract_name || token.name || symbol;

      return {
        id,
        name,
        symbol,
        chainId,
        decimals,
        balance: token.balance ?? "0",
        spendableBalance: token.spendableBalance ?? undefined,
        priceUsd: token.quote_rate ?? undefined,
        quote: Number(token.quote ?? 0),
        logoUrl: token.logo_url,
        native: Boolean(token.native_token),
        contractAddress: token.native_token ? undefined : token.contract_address,
        isFrozen: Boolean(token.isFrozen),
        freezeReason: token.freezeReason ?? null,
        freezeFeeAmount: token.freezeFeeAmount ?? null,
      };
    });
}

export function SendModal({ isOpen, onClose, tokens }: SendModalProps) {
  const t = useTranslations("AccountLenixWallet.send_modal");
  const sendableTokens = useMemo(() => toSendFormTokens(tokens), [tokens]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("title")}</DialogTitle>
          <small className="text-zinc-500 text-xs md:text-sm">{t("description")}</small>
        </DialogHeader>

        <SendForm tokens={sendableTokens} onSuccess={() => onClose()} />
      </DialogContent>
    </Dialog>
  );
}
