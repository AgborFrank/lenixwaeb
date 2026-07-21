import { getTranslations } from "next-intl/server";
import Image from "next/image";

const USE_CASE_KEYS = ["theft", "scams", "ransom", "insolvency"] as const;

export default async function BlockchainForensicsUseCases() {
  const t = await getTranslations("BlockchainForensics.UseCases");

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">{t("title")}</h2>
            <p className="text-zinc-400 mb-8">{t("description")}</p>

            <div className="space-y-4">
              {USE_CASE_KEYS.map((key) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <h3 className="font-semibold text-white">{t(`items.${key}.title`)}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mt-1">{t(`items.${key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-blue-500/20 rounded-2xl blur-2xl pointer-events-none" />
            <div className="relative rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl aspect-[4/3] bg-zinc-900">
              <Image
                src="/assets/img/investigate.webp"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
