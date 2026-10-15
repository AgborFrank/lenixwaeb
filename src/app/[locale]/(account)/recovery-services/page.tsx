import { createClient } from "@/utils/supabase/server";
import { RecoveryDesk, type RecoveryCaseRow } from "./_components/recovery-desk";

interface QuestionnaireData {
  kind?: string;
  amount?: string;
  currency?: string;
}

export default async function RecoveryServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("recovery_requests")
        .select("id, status, wallet_type, wallet_address, questionnaire_data, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: null };

  const cases: RecoveryCaseRow[] = (data ?? [])
    .filter((row) => {
      const details = row.questionnaire_data as QuestionnaireData | null;
      return details?.kind === "stolen_assets";
    })
    .map((row) => {
      const details = (row.questionnaire_data ?? {}) as QuestionnaireData;
      return {
        id: row.id,
        status: row.status ?? "pending",
        chain: row.wallet_type ?? "",
        trail: row.wallet_address ?? row.id.slice(0, 8),
        amount: details.amount ?? "",
        currency: details.currency ?? "",
        created_at: row.created_at ?? new Date().toISOString(),
      };
    });

  return <RecoveryDesk cases={cases} />;
}
