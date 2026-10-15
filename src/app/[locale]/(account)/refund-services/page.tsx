import { Search, Shield, Zap, CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/server";
import RefundRequestForm from "../../purchase-refund/components/refund-request-form";

export default async function RefundServicesPage() {
  const t = await getTranslations("PurchaseRefund");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const steps = [
    {
      icon: Search,
      title: t("Process.steps.assessment.title"),
      description: t("Process.steps.assessment.description"),
    },
    {
      icon: Shield,
      title: t("Process.steps.strategy.title"),
      description: t("Process.steps.strategy.description"),
    },
    {
      icon: Zap,
      title: t("Process.steps.coordination.title"),
      description: t("Process.steps.coordination.description"),
    },
    {
      icon: CheckCircle,
      title: t("Process.steps.return.title"),
      description: t("Process.steps.return.description"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">{t("Account.title")}</h1>
        <p className="text-gray-400">{t("Account.subtitle")}</p>
        <p className="mt-3 text-sm text-gray-500">
          <Link href="/recovery-services" className="text-yellow-400 hover:text-yellow-300">
            {t("Account.stolenLink")}
          </Link>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
          {t("Process.title")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.title} className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center">
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
        <h2 className="mb-2 text-xl font-bold text-white">{t("Form.title")}</h2>
        <p className="mb-6 text-sm text-gray-400">{t("Form.description")}</p>
        <RefundRequestForm embedded defaultEmail={user?.email ?? undefined} />
      </div>
    </div>
  );
}
