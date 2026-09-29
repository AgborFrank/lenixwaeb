import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Giveaway.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Giveaway() {
  const t = await getTranslations("Giveaway");
  const winners = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
  const enterSteps = ["1", "2", "3", "4"] as const;
  const ruleItems = ["1", "2", "3", "4", "5", "6"] as const;
  const faqKeys = ["winners", "announce", "paid", "wallets"] as const;

  return (
    <>
      <Header />
      <section
        className="py-20 px-4 bg-black relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/img/competition.png')" }}
      >
        <div className="max-w-screen-xl mx-auto relative z-20">
          <div className="z-20">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight z-20">
                  {t("Hero.title1")}
                  <span className="text-yellow-400"> {t("Hero.titleHighlight")} </span>
                  {t("Hero.title2")}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl z-20">
                  {t("Hero.description")}
                </p>
                <div className="flex gap-3">
                  <a
                    href="#enter"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    {t("Hero.howToEnter")}
                  </a>
                  <a
                    href="#faqs"
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    {t("Hero.readFaqs")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-overview bg-black">
        <img className="top-left" src="/assets/img/header.svg" alt="" />
        <img className="bottom-left" src="/assets/img/bank-account.svg" alt="" />
        <img className="bottom-right" src="/assets/img/cross-border.svg" alt="" />
      </div>

      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white">{t("Prizes.title")}</h2>
          <p className="text-gray-300 mt-3 max-w-2xl">{t("Prizes.description")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {winners.map((n) => (
              <div
                key={n}
                className="border-0 border-gray-200 rounded-2xl p-6 bg-yellow-400 z-20 text-center"
              >
                <p className="text-gray-500">{t("Prizes.winner", { n })}</p>
                <p className="text-2xl font-semibold text-black mt-2">{t("Prizes.amount")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enter" className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white">{t("Enter.title")}</h2>
          <p className="text-gray-300 mt-3 max-w-2xl">{t("Enter.description")}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {enterSteps.map((step) => (
              <div key={step} className="rounded-2xl p-6 bg-white/5 border border-white/10">
                <p className="text-yellow-400 font-semibold">{t(`Enter.steps.${step}.label`)}</p>
                <h3 className="text-white text-xl mt-1">{t(`Enter.steps.${step}.title`)}</h3>
                <p className="text-gray-400 mt-2">{t(`Enter.steps.${step}.description`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="#rules"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              {t("Enter.reviewRules")}
            </a>
          </div>
        </div>
      </section>

      <section id="rules" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black">{t("Rules.title")}</h2>
          <ul className="mt-6 space-y-3 text-gray-700 list-disc pl-6">
            {ruleItems.map((item) => (
              <li key={item}>{t(`Rules.items.${item}`)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faqs" className="py-16 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t("Faq.title")}</h2>
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-2">
            <Accordion type="single" collapsible className="w-full">
              {faqKeys.map((key) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="text-white">
                    {t(`Faq.items.${key}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {t(`Faq.items.${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              {t("Faq.enterNow")}
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-6 text-center max-w-2xl mx-auto">
            {t("Faq.disclaimer")}
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
