import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LoanPayoutForm } from "../loan-payout-form";
import { OnboardingShell } from "../../components/onboarding-shell";

export default async function LoanPayoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboardingRow } = await supabase
    .from("web_onboarding")
    .select("service_type, step_completed")
    .eq("user_id", user.id)
    .single();

  if (!onboardingRow || onboardingRow.service_type !== "loan") redirect("/onboarding");
  if (onboardingRow.step_completed >= 2) redirect("/dashboard");

  const params = await searchParams;
  const error = params.error;
  const t = await getTranslations("Onboarding.Details");

  return (
    <OnboardingShell
      flow="loan"
      currentStep={3}
      layout="details"
      title={t("payout.title")}
      description={t("payout.description")}
      backHref="/onboarding/details"
      backLabel={t("backToLoan")}
    >
      <LoanPayoutForm error={error} />
    </OnboardingShell>
  );
}
