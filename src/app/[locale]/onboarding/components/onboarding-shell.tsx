import Image from "next/image";
import { ChevronLeft, ShieldCheck, Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
      {/* Background imagery with controlled dark gradient overlay */}
      <div
        className={onboarding.bgImage}
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
        aria-hidden
      />
      <div className={onboarding.bgOverlay} aria-hidden />

      {/* Optical refraction ambient glow behind the glass card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-amber-500/[0.08] blur-[100px] z-[2]"
        aria-hidden
      />

      {/* Enterprise Header */}
      <header className={onboarding.header}>
        <div className={onboarding.headerInner}>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
            >
              <Image
                src="/assets/img/logo.png"
                alt={t("logoAlt")}
                width={120}
                height={30}
                className={onboarding.logo}
                priority
              />
            </Link>
            <span className="hidden sm:inline-block h-3.5 w-[1px] bg-white/15" aria-hidden />
            <span className="hidden sm:inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
              Intake Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <ShieldCheck className="h-3 w-3 text-emerald-400" aria-hidden />
              <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
              <span className="sm:hidden">Encrypted</span>
            </div>

            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors py-1 px-1.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={onboarding.main}>
        {backHref && (
          <Link href={backHref} className={onboarding.backLink}>
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            <span>{resolvedBackLabel}</span>
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

            {/* Enterprise Security Micro-Banner */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-zinc-500">
              <Lock className="h-3 w-3 text-zinc-500" aria-hidden />
              <span>{t("securityNote")}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4">
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

            <div className="flex items-center justify-center gap-2 pt-3 text-[11px] text-zinc-500">
              <Lock className="h-3 w-3 text-zinc-500" aria-hidden />
              <span>{t("securityNote")}</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

