import { onboarding } from "@/lib/onboarding-styles";

interface OnboardingActionBarProps {
  children: React.ReactNode;
}

export function OnboardingActionBar({ children }: OnboardingActionBarProps) {
  return (
    <>
      <div className="h-16 sm:hidden" aria-hidden />
      <div className={onboarding.cardFooterSticky}>{children}</div>
    </>
  );
}
