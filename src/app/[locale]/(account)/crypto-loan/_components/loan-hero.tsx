"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Percent, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function LoanHero({
  totalBorrowed,
  activeLoansCount,
}: {
  totalBorrowed: number;
  activeLoansCount: number;
}) {
  const t = useTranslations("AccountCryptoLoan.hero");

  return (
    <div className="relative mx-auto my-3 mb-6 max-w-6xl overflow-hidden rounded-none border-b border-white/5 bg-zinc-900 sm:rounded-3xl sm:border">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {t("title_line1")} <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {t("title_line2")}
            </span>
          </h1>
          <p className="mb-8 max-w-lg text-lg text-zinc-400">{t("subtitle")}</p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-yellow-400 px-8 font-bold text-black shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all hover:bg-yellow-500 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
            >
              <Link href="/crypto-loan?mode=apply">
                {t("get_instant_loan")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/10 bg-black/20 px-8 text-white backdrop-blur-sm hover:bg-white/5"
            >
              <Link href="#learn-more">{t("how_it_works")}</Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label={t("active_loans")}
              value={activeLoansCount.toString()}
              icon={<Wallet className="h-5 w-5 text-blue-400" />}
            />
            <StatCard
              label={t("total_borrowed")}
              value={`$${totalBorrowed.toLocaleString()}`}
              icon={<ShieldCheck className="h-5 w-5 text-emerald-400" />}
            />
            <StatCard
              label={t("lowest_rate")}
              value="0.5%"
              icon={<Percent className="h-5 w-5 text-yellow-400" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex min-w-[140px] flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
      <div className="w-fit rounded-lg bg-white/5 p-2">{icon}</div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
