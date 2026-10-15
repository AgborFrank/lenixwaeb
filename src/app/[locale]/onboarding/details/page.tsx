import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { RecoveryDetailsForm } from "./recovery-details-form";
import { LoanApplicationForm, type LoanType } from "./loan-application-form";
import { BankingDetailsForm } from "./banking-details-form";
import { RefundDetailsForm } from "./refund-details-form";
import { OnboardingShell } from "../components/onboarding-shell";

export default async function OnboardingDetailsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) await redirect("/login");

  const { data: onboardingRow } = await supabase
    .from("web_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!onboardingRow || !onboardingRow.service_type) {
    await redirect("/onboarding");
  }

  if (onboardingRow.step_completed >= 2) {
    await redirect("/dashboard");
  }

  const serviceType = onboardingRow.service_type as "recovery" | "refund" | "loan" | "banking";
  const isRecovery = serviceType === "recovery";
  const isRefund = serviceType === "refund";
  const isBanking = serviceType === "banking";

  let loanTypes: LoanType[] = [];
  if (!isRecovery && !isRefund && !isBanking) {
    const { data } = await supabase
      .from("loan_types")
      .select("id, name, ltv, interest_rate, min_collateral, max_collateral")
      .order("id", { ascending: true });
    loanTypes = (data as LoanType[]) ?? [];
  }

  const flow = isRecovery
    ? "recovery"
    : isRefund
      ? "refund"
      : isBanking
        ? "banking"
        : "loan";
  const t = await getTranslations("Onboarding.Details");
  const flowKey = isRecovery
    ? "recovery"
    : isRefund
      ? "refund"
      : isBanking
        ? "banking"
        : "loan";

  return (
    <OnboardingShell
      flow={flow}
      currentStep={2}
      layout="details"
      title={t(`${flowKey}.title`)}
      description={t(`${flowKey}.description`)}
      backHref="/onboarding"
      backLabel={t("backToSelection")}
    >
      {isRecovery ? (
        <RecoveryDetailsForm />
      ) : isRefund ? (
        <RefundDetailsForm defaultEmail={user.email ?? undefined} />
      ) : isBanking ? (
        <BankingDetailsForm />
      ) : (
        <LoanApplicationForm loanTypes={loanTypes} />
      )}
    </OnboardingShell>
  );
}
