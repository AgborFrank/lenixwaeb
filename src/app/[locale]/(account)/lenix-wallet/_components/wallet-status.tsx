"use client";

import { CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { wallet } from "@/lib/wallet-styles";

export function WalletStatus() {
  const t = useTranslations("AccountLenixWallet.security");

  return (
    <div className={wallet.card}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white sm:text-base">{t("title")}</h3>
        </div>
        <span className={`${wallet.badge} ${wallet.badgeSuccess}`}>{t("protected")}</span>
      </div>

      <div className="mt-4 space-y-1">
        <StatusRow icon={CheckCircle2} label={t("recovery_phrase")} value={t("backed_up")} positive />
        <StatusRow icon={CheckCircle2} label={t("password")} value={t("active")} positive />
        <StatusRow
          icon={AlertCircle}
          label={t("withdrawal_limit")}
          value={t("not_set")}
          action={t("set")}
        />
      </div>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  positive,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  positive?: boolean;
  action?: string;
}) {
  return (
    <div className={wallet.listItem}>
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 ${positive ? "text-emerald-400" : "text-yellow-400"}`} />
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${positive ? "text-emerald-400" : "text-yellow-400"}`}>
          {value}
        </span>
        {action && (
          <button
            type="button"
            className="rounded bg-yellow-500/10 px-2 py-0.5 text-[11px] font-medium text-yellow-400 transition-colors hover:bg-yellow-500/20"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
