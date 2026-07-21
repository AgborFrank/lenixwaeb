import { Search, Shield, Zap, CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RecoveryRequestForm } from "./_components/recovery-request-form";

export default async function RecoveryServicesPage() {
  const t = await getTranslations("AccountRecoveryServices");

  const steps = [
    {
      icon: Search,
      title: t("process.assessment.title"),
      description: t("process.assessment.description"),
    },
    {
      icon: Shield,
      title: t("process.strategy.title"),
      description: t("process.strategy.description"),
    },
    {
      icon: Zap,
      title: t("process.recovery.title"),
      description: t("process.recovery.description"),
    },
    {
      icon: CheckCircle,
      title: t("process.return.title"),
      description: t("process.return.description"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">{t("page.title")}</h1>
        <p className="text-gray-400">{t("page.subtitle")}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
          {t("page.process_title")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 lg:mb-3">
                <step.icon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-0.5 text-xs text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl md:mb-0 md:p-8">
        <h2 className="mb-2 text-xl font-bold text-white">{t("page.form_title")}</h2>
        <p className="mb-6 text-sm text-gray-400">{t("page.form_subtitle")}</p>
        <RecoveryRequestForm />
      </div>
    </div>
  );
}
