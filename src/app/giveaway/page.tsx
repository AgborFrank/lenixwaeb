import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "$250K Giveaway – Lenix Protocol",
  description:
    "Enter the Lenix Protocol $250,000 Giveaway. Ten winners receive $25,000 in LNX. Learn how to enter, prizes, rules, and FAQs.",
};

export default function Giveaway() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section
        className="py-20 px-4 bg-black relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/img/competition.png')" }}
      >
        <div className="max-w-screen-xl mx-auto relative z-20">
          <div className="z-20">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight z-20">
                  Enter Our Competition for a Chance to
                  <span className="text-yellow-400"> Win $250,000 </span>
                  Giveaway
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl z-20">
                  Ten winners each receive $25,000 worth of LNX. Complete tasks,
                  share, and boost your entries. Transparent rules, fair
                  selection, and on-chain distribution.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#enter"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    How to Enter
                  </a>
                  <a
                    href="#faqs"
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    Read FAQs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-overview bg-black">
        <img className="top-left" src="/assets/img/header.svg" alt="header" />
        <img
          className="bottom-left"
          src="/assets/img/bank-account.svg"
          alt="bank"
        />
        <img
          className="bottom-right"
          src="/assets/img/cross-border.svg"
          alt="border"
        />
      </div>

      {/* Prizes */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Prizes</h2>
          <p className="text-gray-300 mt-3 max-w-2xl">
            A total of $250,000 in LNX will be distributed to 10 winners. Each
            winner gets $25,000 worth of LNX.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                className="border-0 border-gray-200 rounded-2xl p-6 bg-yellow-400 z-20 text-center"
              >
                <p className="text-gray-500">Winner {n}</p>
                <p className="text-2xl font-semibold text-black mt-2">
                  $25,000 LNX
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Enter */}
      <section id="enter" className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            How to Enter
          </h2>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Complete the steps below. More tasks completed = more entries.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <p className="text-yellow-400 font-semibold">Step 1</p>
              <h3 className="text-white text-xl mt-1">Connect your wallet</h3>
              <p className="text-gray-400 mt-2">
                Use the Connect Wallet button in the header. Ensure you control
                the address.
              </p>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <p className="text-yellow-400 font-semibold">Step 2</p>
              <h3 className="text-white text-xl mt-1">
                Complete required tasks
              </h3>
              <p className="text-gray-400 mt-2">
                Join our channels, verify actions, and follow instructions on
                the campaign page.
              </p>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <p className="text-yellow-400 font-semibold">Step 3</p>
              <h3 className="text-white text-xl mt-1">
                Boost with bonus actions
              </h3>
              <p className="text-gray-400 mt-2">
                Share the campaign and invite friends to earn extra entries.
              </p>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <p className="text-yellow-400 font-semibold">Step 4</p>
              <h3 className="text-white text-xl mt-1">Verify and submit</h3>
              <p className="text-gray-400 mt-2">
                Confirm your participation and keep your wallet connected for
                prize distribution.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="#rules"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Review Rules
            </a>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Eligibility & Rules
          </h2>
          <ul className="mt-6 space-y-3 text-gray-700 list-disc pl-6">
            <li>
              One primary wallet address per participant. Multiple entries from
              the same person may be disqualified.
            </li>
            <li>
              Winners are selected fairly based on verifiable entries. We
              reserve the right to re-verify winners.
            </li>
            <li>
              Prizes are distributed in LNX on-chain to the connected wallet
              address only.
            </li>
            <li>
              Taxes, reporting, and local regulations are the responsibility of
              the winners.
            </li>
            <li>
              Void where prohibited. We may exclude jurisdictions to comply with
              local laws.
            </li>
            <li>
              Campaign timelines and details may change; updates will be
              announced on official channels.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-16 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white">FAQs</h2>
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger className="text-white">
                  How are winners selected?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Winners are chosen fairly from validated entries. Additional
                  bonus tasks increase your odds but don’t guarantee a win.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="text-white">
                  When will winners be announced?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Final announcement dates will be shared on our official
                  channels. Stay tuned for the timeline update.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="text-white">
                  How are prizes paid?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Prizes are distributed in LNX on-chain directly to the
                  connected wallet address. Ensure you maintain access to it.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="text-white">
                  Can I use multiple wallets?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  No. Only one primary wallet per participant is allowed.
                  Multiple entries from the same person may be disqualified.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href="#enter"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Enter Now
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-6 text-center max-w-2xl mx-auto">
            Not financial advice. Participation is subject to local laws and
            regulations. By entering, you agree to the rules above.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
