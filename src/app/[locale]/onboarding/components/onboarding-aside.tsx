import { getTranslations } from "next-intl/server";
import { ShieldCheck, Info } from "lucide-react";
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
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2.5">
          <Info className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          <p className={onboarding.asideTitle}>{t(`${flow}.title`)}</p>
        </div>
        <p className={onboarding.asideText}>{t(`${flow}.body`)}</p>
        <ul className={onboarding.asideList}>
          {[t(`${flow}.bullet1`), t(`${flow}.bullet2`), t(`${flow}.bullet3`)].map((item) => (
            <li key={item} className={onboarding.asideListItem}>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[10px] text-zinc-500">
          <ShieldCheck className="h-3 w-3 text-emerald-400" aria-hidden />
          <span>Case data encrypted at rest</span>
        </div>
      </div>
    </aside>
  );
}

