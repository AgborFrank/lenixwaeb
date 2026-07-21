import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";

export default async function SecurityHero() {
  const t = await getTranslations("Security.hero");

  return (
    <section className="bg-neutral-950 pt-28 pb-14 lg:pt-32 lg:pb-16">
      <div className={home.container}>
        <div className="max-w-3xl space-y-5">
          <p className={home.eyebrow}>{t("eyebrow")}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-[1.1]">
            {t("title1")}
            {t("title2")}
          </h1>
          <p className={`${home.lead} text-neutral-300 max-w-2xl`}>{t("subtitle")}</p>
        </div>
      </div>
    </section>
  );
}
