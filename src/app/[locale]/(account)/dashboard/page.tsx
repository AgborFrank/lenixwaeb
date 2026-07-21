import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ShieldCheck, LayoutDashboard } from "lucide-react";

const TELEGRAM_URL = "https://t.me/Verified_protocol";

function formatDetailLabel(
  t: Awaited<ReturnType<typeof getTranslations>>,
  key: string,
) {
  const fieldKey = `details_fields.${key}` as const;
  if (t.has(fieldKey)) {
    return t(fieldKey);
  }
  return key.replace(/_/g, " ");
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("AccountDashboard");
  const locale = await getLocale();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!onboarding || (onboarding.step_completed ?? 0) < 2) {
    redirect("/onboarding");
  }

  const serviceType = onboarding.service_type as string;
  const isRecovery = serviceType === "recovery";
  const isBanking = serviceType === "banking";
  const statusKey = isRecovery ? "recovery" : isBanking ? "banking" : "loan";
  const serviceTypeLabel = t.has(`service_types.${serviceType}`)
    ? t(`service_types.${serviceType}`)
    : serviceType;

  return (
    <div className="max-w-7xl mx-auto text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <LayoutDashboard className="w-32 h-32 text-white" />
            </div>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {t(`status.${statusKey}`)}
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                <div className="relative flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 z-10">
                    <ShieldCheck className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("timeline.received_title")}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {t("timeline.received_desc")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(onboarding.created_at).toLocaleDateString(locale)}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 z-10 border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400">
                      {t("timeline.review_title")}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("timeline.review_desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  {t("submitted_details")}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">{t("service_type")}</span>
                    <span className="text-white">{serviceTypeLabel}</span>
                  </div>
                  {onboarding.details &&
                    Object.entries(onboarding.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-500 block capitalize">
                          {formatDetailLabel(t, key)}
                        </span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-6 backdrop-blur-xl">
            <h3 className="font-bold text-yellow-400 mb-2">{t("support.title")}</h3>
            <p className="text-sm text-gray-400 mb-4">
              {t("support.description")}
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors text-sm text-center"
            >
              {t("support.contact")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
