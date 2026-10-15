import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";
import { getUserLoans } from "./actions";
import { ActiveLoans } from "./_components/active-loans";
import { MarketRates } from "./_components/market-rates";
import { LoanApplication } from "./_components/loan-application";

export default async function CryptoLoanPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const t = await getTranslations("AccountCryptoLoan");
  const supabase = await createClient();
  const loans = (await getUserLoans()) || [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: payoutRow } = user
    ? await supabase
        .from("web_loan_payouts")
        .select("payout_method, payout_details")
        .eq("user_id", user.id)
        .single()
    : { data: null };
  const userPayout = payoutRow
    ? { method: payoutRow.payout_method, details: payoutRow.payout_details as Record<string, string> | null }
    : null;
  const params = await searchParams;
  const isApplyMode = params.mode === "apply";

  const { data } = await supabase.from("loan_types").select("*").order("id", { ascending: true });
  const loanTypes = data || [];

  if (isApplyMode) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4 h-8 px-2 text-zinc-400 hover:bg-white/[0.04] hover:text-white">
          <Link href="/crypto-loan">{t("page.back_to_dashboard")}</Link>
        </Button>
        <LoanApplication loanTypes={loanTypes} />
      </div>
    );
  }

  const active = loans.filter((loan) => loan.status === "Active");
  const totalBorrowed = loans.reduce((sum, loan) => sum + Number(loan.borrow_amount || 0), 0);
  const rates = loanTypes
    .map((plan) => Number(plan.interest_rate))
    .filter((rate) => Number.isFinite(rate));
  const lowestRate = rates.length > 0 ? Math.min(...rates) : null;
  const healthValues = active
    .map((loan) => Number(loan.health_factor))
    .filter((value) => Number.isFinite(value));
  const health = healthValues.length > 0 ? Math.min(...healthValues) : null;

  const metrics = [
    ["borrowed", `$${totalBorrowed.toLocaleString()}`],
    ["positions", String(active.length)],
    ["rate", lowestRate === null ? "—" : `${lowestRate}%`],
    ["health", health === null ? "—" : health.toFixed(2)],
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className={adminGlass.eyebrow}>{t("desk.eyebrow")}</p>
          <h1 className={adminGlass.title}>{t("desk.title")}</h1>
          <p className={adminGlass.description}>{t("desk.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" className={`h-9 ${adminGlass.field}`} asChild>
            <Link href="/vault">{t("page.go_to_vault")}</Link>
          </Button>
          <Button type="button" size="sm" className="h-9 bg-white text-black hover:bg-zinc-200" asChild>
            <Link href="/crypto-loan?mode=apply">{t("desk.borrow")}</Link>
          </Button>
        </div>
      </header>

      <section className={`${adminGlass.surface} overflow-hidden`} aria-label={t("hero.total_borrowed")}>
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-4 lg:divide-y-0">
          {metrics.map(([key, value]) => (
            <div key={key} className="px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="text-[11px] font-medium tracking-wide text-zinc-500">
                {key === "borrowed"
                  ? t("hero.total_borrowed")
                  : key === "positions"
                    ? t("hero.active_loans")
                    : key === "rate"
                      ? t("desk.from")
                      : t("desk.health")}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-white sm:text-xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveLoans loans={loans} userPayout={userPayout} />
        </div>
        <div className="space-y-6">
          <MarketRates loanTypes={loanTypes} />
          <section className={`${adminGlass.surface} p-5`}>
            <h2 className="text-sm font-medium text-white">{t("page.collateral_title")}</h2>
            <p className="mt-1 text-sm text-zinc-500">{t("page.collateral_description")}</p>
            <Button type="button" variant="outline" size="sm" className={`mt-4 h-9 ${adminGlass.field}`} asChild>
              <Link href="/vault">{t("page.go_to_vault")}</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
