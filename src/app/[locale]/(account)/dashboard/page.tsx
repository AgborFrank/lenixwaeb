import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { DashboardView } from "./_components/dashboard-view";

export default async function DashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("AccountDashboard");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!onboarding || (onboarding.step_completed ?? 0) < 2) {
    return redirect("/onboarding");
  }

  const serviceType = onboarding.service_type as string;
  const isRecovery = serviceType === "recovery";
  const isRefund = serviceType === "refund";
  const isBanking = serviceType === "banking";
  const statusKey = isRecovery
    ? "recovery"
    : isRefund
      ? "refund"
      : isBanking
        ? "banking"
        : "loan";

  const serviceTypeLabel = t.has(`service_types.${serviceType}`)
    ? t(`service_types.${serviceType}`)
    : serviceType;

  const labels = {
    statusTitle: t.has(`status.${statusKey}`) ? t(`status.${statusKey}`) : "Case Status",
    receivedTitle: t("timeline.received_title"),
    receivedDesc: t("timeline.received_desc"),
    reviewTitle: t("timeline.review_title"),
    reviewDesc: t("timeline.review_desc"),
    submittedDetails: t("submitted_details"),
    serviceType: t("service_type"),
    serviceTypeLabel,
    contactSupport: t("support.contact"),
    supportTitle: t("support.title"),
    supportDesc: t("support.description"),
  };

  return (
    <DashboardView
      userEmail={user.email || ""}
      onboarding={onboarding}
      labels={labels}
    />
  );
}
