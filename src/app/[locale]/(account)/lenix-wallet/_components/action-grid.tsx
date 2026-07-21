"use client";

import { ArrowDownToLine, ArrowUpRight, CreditCard, Repeat } from "lucide-react";
import { useTranslations } from "next-intl";
import { wallet } from "@/lib/wallet-styles";

interface ActionGridProps {
  onSend?: () => void;
  onReceive?: () => void;
  onBuy?: () => void;
  onSwap?: () => void;
}

export function ActionGrid({ onSend, onReceive, onBuy, onSwap }: ActionGridProps) {
  const t = useTranslations("AccountLenixWallet.actions");

  return (
    <div className="flex gap-2 sm:gap-3">
      <ActionButton icon={ArrowUpRight} label={t("send")} onClick={onSend} />
      <ActionButton icon={ArrowDownToLine} label={t("receive")} onClick={onReceive} />
      <ActionButton icon={CreditCard} label={t("buy")} onClick={onBuy} />
      <ActionButton icon={Repeat} label={t("swap")} onClick={onSwap} />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={wallet.actionBtn}>
      <Icon className={wallet.actionIcon} />
      <span className={wallet.actionLabel}>{label}</span>
    </button>
  );
}
