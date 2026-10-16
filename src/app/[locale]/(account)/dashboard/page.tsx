import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { DashboardView } from "./_components/dashboard-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const serviceType = (onboarding.service_type as string) || "recovery";
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

  // Check if there is a linked recovery or refund request with updated status
  let effectiveStatus = onboarding.status || "pending";
  let effectiveNotes = onboarding.admin_notes || null;
  let effectiveReviewedAt = onboarding.reviewed_at || null;

  if (isRecovery) {
    const { data: recReq } = await supabase
      .from("recovery_requests")
      .select("status, admin_notes, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recReq?.status) {
      // If recovery_requests has non-pending status or newer update, prefer it
      if (recReq.status !== "pending" || effectiveStatus === "pending") {
        effectiveStatus = recReq.status;
      }
      if (recReq.admin_notes) {
        effectiveNotes = recReq.admin_notes;
      }
    }
  } else if (isRefund) {
    const refundId = onboarding.details?.refund_request_id;
    let query = supabase
      .from("refund_requests")
      .select("status, admin_notes, updated_at");

    if (refundId) {
      query = query.eq("id", refundId);
    } else {
      query = query.eq("user_id", user.id).order("created_at", { ascending: false });
    }

    const { data: refReq } = await query.limit(1).maybeSingle();

    if (refReq?.status) {
      if (refReq.status !== "pending" || effectiveStatus === "pending") {
        effectiveStatus = refReq.status;
      }
      if (refReq.admin_notes) {
        effectiveNotes = refReq.admin_notes;
      }
    }
  }

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

  const mergedOnboarding = {
    ...onboarding,
    status: effectiveStatus,
    admin_notes: effectiveNotes,
    reviewed_at: effectiveReviewedAt,
  };

  return (
    <DashboardView
      userEmail={user.email || ""}
      onboarding={mergedOnboarding}
      labels={labels}
    />
  );
}
