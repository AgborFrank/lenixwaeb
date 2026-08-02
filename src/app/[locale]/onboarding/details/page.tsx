import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { RecoveryDetailsForm } from "./recovery-details-form";
import { LoanApplicationForm, type LoanType } from "./loan-application-form";
import { BankingDetailsForm } from "./banking-details-form";
import { OnboardingShell } from "../components/onboarding-shell";

export default async function OnboardingDetailsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboardingRow } = await supabase
    .from("web_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!onboardingRow || !onboardingRow.service_type) {
    redirect("/onboarding");
  }

  if (onboardingRow.step_completed >= 2) {
    redirect("/dashboard");
  }

  const serviceType = onboardingRow.service_type as "recovery" | "loan" | "banking";
  const isRecovery = serviceType === "recovery";
  const isBanking = serviceType === "banking";

  let loanTypes: LoanType[] = [];
  if (!isRecovery && !isBanking) {
    const { data } = await supabase
      .from("loan_types")
      .select("id, name, ltv, interest_rate, min_collateral, max_collateral")
      .order("id", { ascending: true });
    loanTypes = (data as LoanType[]) ?? [];
  }

  const flow = isRecovery ? "recovery" : isBanking ? "banking" : "loan";
  const t = await getTranslations("Onboarding.Details");
  const flowKey = isRecovery ? "recovery" : isBanking ? "banking" : "loan";

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
      ) : isBanking ? (
        <BankingDetailsForm />
      ) : (
        <LoanApplicationForm loanTypes={loanTypes} />
      )}
    </OnboardingShell>
  );
}
