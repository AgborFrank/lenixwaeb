import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { onboarding } from "@/lib/onboarding-styles";
import { OnboardingProgress, type OnboardingFlow } from "./onboarding-progress";
import { OnboardingAside } from "./onboarding-aside";

interface OnboardingShellProps {
  flow: OnboardingFlow;
  currentStep: number;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  layout?: "default" | "centered" | "details";
}

export async function OnboardingShell({
  flow,
  currentStep,
  title,
  description,
  backHref,
  backLabel,
  children,
  layout = "default",
}: OnboardingShellProps) {
  const t = await getTranslations("Onboarding.Shell");
  const isDetails = layout === "details";
  const useSingleColumn = layout === "centered" || isDetails;
  const resolvedBackLabel = backLabel ?? t("back");

  return (
    <div className={onboarding.page}>
      <div
        className={onboarding.bgImage}
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
        aria-hidden
      />
      <div className={onboarding.bgOverlay} aria-hidden />

      <header className={onboarding.header}>
        <div className={onboarding.headerInner}>
          <Link
            href="/"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50"
          >
            <Image
              src="/assets/img/logo.png"
              alt={t("logoAlt")}
              width={130}
              height={35}
              className={onboarding.logo}
              priority
            />
          </Link>
          <Link href="/dashboard" className={onboarding.skipLink}>
            {t("skip")}
          </Link>
        </div>
      </header>

      <main className={onboarding.main}>
        {backHref && (
          <Link href={backHref} className={onboarding.backLink}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {resolvedBackLabel}
          </Link>
        )}

        {useSingleColumn ? (
          <div className={cn(isDetails ? onboarding.workspaceDetails : onboarding.workspaceCentered)}>
            <OnboardingProgress flow={flow} currentStep={currentStep} centered />
            <article className={onboarding.card}>
              <header className={onboarding.cardHeader}>
                <h1 className={onboarding.title}>{title}</h1>
                <p className={onboarding.subtitle}>{description}</p>
              </header>
              {children}
            </article>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <OnboardingProgress flow={flow} currentStep={currentStep} />
            </div>
            <div className={onboarding.workspace}>
              <article className={onboarding.card}>
                <header className={onboarding.cardHeader}>
                  <h1 className={onboarding.title}>{title}</h1>
                  <p className={onboarding.subtitle}>{description}</p>
                </header>
                {children}
              </article>
              <OnboardingAside flow={flow} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
