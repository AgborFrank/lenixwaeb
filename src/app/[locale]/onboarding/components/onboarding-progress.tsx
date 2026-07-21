"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type OnboardingFlow = "selection" | "recovery" | "loan" | "banking";

const FLOW_STEPS: Record<OnboardingFlow, number[]> = {
  selection: [1, 2, 3],
  recovery: [1, 2],
  loan: [1, 2, 3],
  banking: [1, 2],
};

interface OnboardingProgressProps {
  flow: OnboardingFlow;
  currentStep: number;
  centered?: boolean;
}

export function OnboardingProgress({ flow, currentStep, centered = false }: OnboardingProgressProps) {
  const t = useTranslations("Onboarding.Progress");
  const steps = FLOW_STEPS[flow];
  const label = t(`flows.${flow}.${currentStep}`);

  return (
    <div
      className={cn("space-y-2", centered && "text-center")}
      aria-label={t("stepOf", { current: currentStep, total: steps.length })}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-zinc-500",
          centered && "justify-center"
        )}
      >
        <span>{t("stepOf", { current: currentStep, total: steps.length })}</span>
        <span aria-hidden>·</span>
        <span className="text-zinc-300">{label}</span>
      </div>
      <div className={cn("flex gap-1", centered && "justify-center")}>
        {steps.map((stepId) => (
          <div
            key={stepId}
            className={cn(
              "h-0.5 w-12 rounded-full sm:w-16",
              stepId <= currentStep ? "bg-yellow-400" : "bg-white/10"
            )}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
