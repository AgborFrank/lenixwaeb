import { getTranslations } from "next-intl/server";
import { FileSearch, Scale, ShieldCheck } from "lucide-react";

const CARD_KEYS = ["tracing", "reports", "compliance"] as const;
const CARD_ICONS = [FileSearch, Scale, ShieldCheck] as const;

export default async function BlockchainForensicsCapabilities() {
  const t = await getTranslations("BlockchainForensics.Capabilities");

  return (
    <section className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">{t("title")}</h2>
          <p className="text-zinc-400">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARD_KEYS.map((key, i) => {
            const Icon = CARD_ICONS[i];
            return (
              <article
                key={key}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] backdrop-blur-sm transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center border border-white/10 mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t(`cards.${key}.title`)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(`cards.${key}.desc`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
