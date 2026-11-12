import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";
import { ANDROID_APK_DOWNLOAD_PATH } from "@/lib/android-apk";

export default async function BankingFinanceRowActions({ className = "" }: { className?: string }) {
  const t = await getTranslations("BankingFinance.Actions");

  return (
    <div className={`flex flex-wrap gap-3 mt-8 ${className}`}>
      <Link href="/signup" className={`${home.btnPrimary} h-11 px-6`}>
        {t("register")}
      </Link>
      <a href={ANDROID_APK_DOWNLOAD_PATH} className={`${home.btnSecondary} h-11 px-6`}>
        {t("download")}
      </a>
    </div>
  );
}
