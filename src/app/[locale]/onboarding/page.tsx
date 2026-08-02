import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { HandCoins, Landmark, SearchCheck } from "lucide-react";
import { submitServiceSelection } from "./actions";
import { OnboardingShell } from "./components/onboarding-shell";
import { OnboardingActionBar } from "./components/onboarding-action-bar";
import { onboarding } from "@/lib/onboarding-styles";

const SERVICES = [
  { value: "recovery", icon: SearchCheck },
  { value: "loan", icon: HandCoins },
  { value: "banking", icon: Landmark },
] as const;

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboardingRow } = await supabase
    .from("web_onboarding")
    .select("step_completed")
    .eq("user_id", user.id)
    .single();

  if (onboardingRow && onboardingRow.step_completed >= 2) {
    redirect("/dashboard");
  }

  const t = await getTranslations("Onboarding.Selection");

  return (
    <OnboardingShell
      flow="selection"
      currentStep={1}
      layout="centered"
      title={t("title")}
      description={t("description")}
    >
      <form action={submitServiceSelection}>
        <div className={onboarding.cardBody}>
          <fieldset>
            <legend className={onboarding.serviceLegend}>{t("legend")}</legend>
            <div className={onboarding.serviceList}>
              {SERVICES.map(({ value, icon: Icon }) => (
                <label key={value} className={onboarding.serviceOption}>
                  <input
                    type="radio"
                    name="serviceType"
                    value={value}
                    className="sr-only"
                    required
                  />
                  <span className={onboarding.serviceIcon} aria-hidden>
                    <Icon />
                  </span>
                  <span className={onboarding.serviceContent}>
                    <span className={onboarding.serviceTitle}>{t(`services.${value}.title`)}</span>
                    <span className={onboarding.serviceDescription}>
                      {t(`services.${value}.description`)}
                    </span>
                  </span>
                  <span className={onboarding.serviceIndicator} aria-hidden>
                    <span className={onboarding.serviceIndicatorDot} />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <OnboardingActionBar>
          <button type="submit" className={onboarding.btnPrimary}>
            {t("continue")}
          </button>
        </OnboardingActionBar>
      </form>
    </OnboardingShell>
  );
}
