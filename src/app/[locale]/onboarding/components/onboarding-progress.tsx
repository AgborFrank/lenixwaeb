"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type OnboardingFlow = "selection" | "recovery" | "refund" | "loan" | "banking";

const FLOW_STEPS: Record<OnboardingFlow, number[]> = {
  selection: [1, 2, 3],
  recovery: [1, 2],
  refund: [1, 2],
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

  return (
    <nav
      className={cn("w-full py-1", centered && "mx-auto max-w-lg")}
      aria-label={t("stepOf", { current: currentStep, total: steps.length })}
    >
      <ol className="flex items-center justify-between gap-2">
        {steps.map((stepId, index) => {
          const isDone = stepId < currentStep;
          const isCurrent = stepId === currentStep;
          const label = t(`flows.${flow}.${stepId}`);

          return (
            <li key={stepId} className="flex flex-1 items-center gap-2 last:flex-none">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-all",
                  isDone &&
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
                  isCurrent &&
                    "border-amber-400/60 bg-amber-400/15 text-white font-semibold shadow-[0_0_16px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30",
                  !isDone &&
                    !isCurrent &&
                    "border-white/[0.08] bg-white/[0.02] text-zinc-500"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-mono",
                    isDone && "bg-emerald-500 text-black font-bold",
                    isCurrent && "bg-amber-400 text-black font-bold",
                    !isDone && !isCurrent && "bg-white/[0.08] text-zinc-400"
                  )}
                >
                  {isDone ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : `0${stepId}`}
                </span>
                <span
                  className={cn(
                    "truncate text-[11px] sm:text-xs tracking-tight",
                    isCurrent ? "text-amber-200" : isDone ? "text-emerald-300" : "text-zinc-400"
                  )}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[1px] flex-1 rounded-full transition-all",
                    isDone
                      ? "bg-gradient-to-r from-emerald-500/50 to-amber-400/50"
                      : isCurrent
                        ? "bg-gradient-to-r from-amber-400/40 to-white/10"
                        : "bg-white/[0.08]"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

