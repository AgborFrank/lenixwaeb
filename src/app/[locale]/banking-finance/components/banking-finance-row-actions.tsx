import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";

const APP_DOWNLOAD_URL = "https://shorturl.at/FVVpk";

export default async function BankingFinanceRowActions({ className = "" }: { className?: string }) {
  const t = await getTranslations("BankingFinance.Actions");

  return (
    <div className={`flex flex-wrap gap-3 mt-8 ${className}`}>
      <Link href="/signup" className={`${home.btnPrimary} h-11 px-6`}>
        {t("register")}
      </Link>
      <a
        href={APP_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${home.btnSecondary} h-11 px-6`}
      >
        {t("download")}
      </a>
    </div>
  );
}
