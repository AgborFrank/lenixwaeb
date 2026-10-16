import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, HandCoins, Landmark, Package, SearchCheck } from "lucide-react";
import { submitServiceSelection } from "./actions";
import { OnboardingShell } from "./components/onboarding-shell";
import { OnboardingActionBar } from "./components/onboarding-action-bar";
import { onboarding } from "@/lib/onboarding-styles";

const SERVICES = [
  { value: "recovery", icon: SearchCheck, tag: "Forensics" },
  { value: "refund", icon: Package, tag: "Disputes" },
  { value: "loan", icon: HandCoins, tag: "Collateral" },
  { value: "banking", icon: Landmark, tag: "Treasury" },
] as const;

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) await redirect("/login");

  const { data: onboardingRow } = await supabase
    .from("web_onboarding")
    .select("step_completed")
    .eq("user_id", user.id)
    .single();

  if (onboardingRow && onboardingRow.step_completed >= 2) {
    await redirect("/dashboard");
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
              {SERVICES.map(({ value, icon: Icon, tag }) => (
                <label key={value} className={onboarding.serviceOption}>
                  <input
                    type="radio"
                    name="serviceType"
                    value={value}
                    className="sr-only"
                    required
                  />
                  <div className="flex w-full items-center justify-between">
                    <span className={onboarding.serviceIcon} aria-hidden>
                      <Icon />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 group-has-[:checked]:border-amber-400/40 group-has-[:checked]:bg-amber-400/10 group-has-[:checked]:text-amber-300 transition-colors">
                        {tag}
                      </span>
                      <span className={onboarding.serviceIndicator} aria-hidden>
                        <span className={onboarding.serviceIndicatorDot} />
                      </span>
                    </div>
                  </div>
                  <div className={onboarding.serviceContent}>
                    <span className={onboarding.serviceTitle}>{t(`services.${value}.title`)}</span>
                    <span className={onboarding.serviceDescription}>
                      {t(`services.${value}.description`)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <OnboardingActionBar>
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-400">
              Estimated intake: ~2 min
            </span>
            <button type="submit" className={onboarding.btnPrimary}>
              <span>{t("continue")}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </OnboardingActionBar>
      </form>
    </OnboardingShell>
  );
}

