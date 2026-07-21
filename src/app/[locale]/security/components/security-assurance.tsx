import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

export default async function SecurityAssurance() {
  const t = await getTranslations("Security");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("assurance.eyebrow")}
          title={t("assurance.title")}
          description={t("assurance.description")}
        />

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <article className={`${home.card} ${home.cardBody} flex flex-col items-start`}>
            <Image
              src="/assets/img/certiklogo.png"
              alt="CertiK"
              className="h-8 w-auto mb-6 brightness-0 invert opacity-90"
              width={128}
              height={32}
            />
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 flex-1">{t("audit.certik_text")}</p>
            <Link href="/about" className={home.textLink}>
              {t("audit.certik_link")} →
            </Link>
          </article>

          <article className={`${home.card} ${home.cardBody} flex flex-col items-start`}>
            <Image
              src="/assets/img/certy.webp"
              alt="ISO 27001"
              className="h-12 w-auto mb-6 opacity-90"
              width={96}
              height={48}
            />
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 flex-1">{t("iso.desc")}</p>
            <Link href="/about" className={home.textLink}>
              {t("assurance.iso_link")} →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
