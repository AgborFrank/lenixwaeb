import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getUserLoans } from "./actions";
import { LoanHero } from "./_components/loan-hero";
import { ActiveLoans } from "./_components/active-loans";
import { MarketRates } from "./_components/market-rates";
import { LoanApplication } from "./_components/loan-application";
import { Button } from "@/components/ui/button";

export default async function CryptoLoanPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const t = await getTranslations("AccountCryptoLoan.page");
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

  const totalBorrowed = loans.reduce((acc, loan) => acc + Number(loan.borrow_amount), 0);
  const activeLoansCount = loans.filter((l) => l.status === "Active").length;

  if (isApplyMode) {
    return (
      <div className="min-h-screen animate-in fade-in bg-black/40 p-4 backdrop-blur-xl duration-300 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-zinc-400 hover:text-white">
              <Link href="/crypto-loan">&larr; {t("back_to_dashboard")}</Link>
            </Button>
          </div>
          <LoanApplication loanTypes={loanTypes} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <LoanHero totalBorrowed={totalBorrowed} activeLoansCount={activeLoansCount} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ActiveLoans loans={loans} userPayout={userPayout} />
          </div>

          <div className="space-y-6">
            <MarketRates loanTypes={loanTypes} />

            <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-transparent p-6">
              <h3 className="mb-2 font-bold text-white">{t("collateral_title")}</h3>
              <p className="mb-4 text-sm text-zinc-400">{t("collateral_description")}</p>
              <Button
                variant="outline"
                asChild
                className="w-full border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300"
              >
                <Link href="/vault">{t("go_to_vault")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
