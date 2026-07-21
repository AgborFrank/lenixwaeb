import { getTranslations } from "next-intl/server";
import Image from "next/image";

const STEPS = [
  { id: "account", image: "/assets/img/certy.webp", number: "01" },
  { id: "fund", image: "/assets/img/cross-border.svg", number: "02" },
  { id: "request", image: "/assets/img/trade-routes.jpg", number: "03" },
  { id: "track", image: "/assets/img/DetectFinancialCrime.webp", number: "04" },
] as const;

export default async function BankingFinanceProcess() {
  const t = await getTranslations("BankingFinance.Process");

  return (
    <section id="how-it-works" className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-12 text-center">{t("title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ id, image, number }) => (
            <article
              key={id}
              className="relative rounded-2xl bg-zinc-900 border border-white/5 backdrop-blur-sm overflow-hidden"
            >
              <div className="relative aspect-[16/10] border-b border-white/5 bg-black/40">
                <Image
                  src={image}
                  alt={t(`steps.${id}.title`)}
                  fill
                  className={image.endsWith(".svg") ? "object-contain p-6" : "object-cover"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative p-6">
                <span className="text-5xl font-bold text-white/5 absolute top-4 right-4 select-none">
                  {number}
                </span>
                <div className="w-2 h-2 rounded-full bg-yellow-400 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-3">{t(`steps.${id}.title`)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(`steps.${id}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
