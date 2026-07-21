import { getTranslations } from "next-intl/server";
import { onboarding } from "@/lib/onboarding-styles";
import type { OnboardingFlow } from "./onboarding-progress";

interface OnboardingAsideProps {
  flow: OnboardingFlow;
}

export async function OnboardingAside({ flow }: OnboardingAsideProps) {
  if (flow === "selection" || flow === "banking") return null;

  const t = await getTranslations("Onboarding.Aside");
  const tShell = await getTranslations("Onboarding.Shell");

  return (
    <aside className={onboarding.aside} aria-label={tShell("asideAria")}>
      <div className={onboarding.asideCard}>
        <p className={onboarding.asideTitle}>{t(`${flow}.title`)}</p>
        <p className={onboarding.asideText}>{t(`${flow}.body`)}</p>
        <ul className={onboarding.asideList}>
          {[t(`${flow}.bullet1`), t(`${flow}.bullet2`), t(`${flow}.bullet3`)].map((item) => (
            <li key={item} className={onboarding.asideListItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
