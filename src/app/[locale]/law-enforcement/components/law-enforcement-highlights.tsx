import { getTranslations } from "next-intl/server";

const HIGHLIGHT_KEYS = ["follow", "data", "speed", "evidence"] as const;

export default async function LawEnforcementHighlights() {
  const t = await getTranslations("LawEnforcement.Highlights");

  return (
    <section id="features" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHT_KEYS.map((key) => (
            <article
              key={key}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-3">{t(`items.${key}.title`)}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{t(`items.${key}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
