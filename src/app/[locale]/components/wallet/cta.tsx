"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link as I18nLink } from "@/i18n/navigation";
import { home } from "@/lib/home-styles";

const DOWNLOAD_URL = "https://shorturl.at/FVVpk";

export default function WalletCTA() {
  const t = useTranslations("WalletPage.Cta");

  return (
    <section className="py-24 px-4 text-center">
      <div className={`${home.container} max-w-3xl`}>
        <h2 className={`${home.titleCenter} mb-4`}>{t("title")}</h2>
        <p className={`${home.leadCenter} mb-8`}>{t("subtitle")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={DOWNLOAD_URL} target="_blank" className={home.btnPrimary}>
            {t("btn_download")}
          </Link>
          <I18nLink href="/lenix-wallet" className={home.btnSecondary}>
            {t("btn_web")}
          </I18nLink>
        </div>
      </div>
    </section>
  );
}
