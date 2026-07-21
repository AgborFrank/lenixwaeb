"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { onboarding } from "@/lib/onboarding-styles";

interface OnboardingPendingSubmitButtonProps {
  label: string;
  pendingLabel: string;
  disabled?: boolean;
}

export function OnboardingPendingSubmitButton({
  label,
  pendingLabel,
  disabled = false,
}: OnboardingPendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={disabled || pending} className={onboarding.btnPrimary}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
