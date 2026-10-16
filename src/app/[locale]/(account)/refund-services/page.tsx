import { createClient } from "@/utils/supabase/server";
import { RefundDesk, type RefundCaseRow } from "./_components/refund-desk";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RefundServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("refund_requests")
        .select(`
          id,
          user_id,
          role,
          full_name,
          email,
          phone,
          country_phone_code,
          counterparty_name,
          order_ref,
          payment_tx_hash,
          amount,
          asset,
          chain,
          incident_summary,
          evidence_url,
          evidence_filename,
          status,
          lifecycle,
          refund_mode,
          payout_destination,
          admin_notes,
          tracking_number,
          carrier,
          created_at,
          updated_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: null };

  const cases: RefundCaseRow[] = (data ?? []).map((row) => ({
    id: row.id,
    status: row.status,
    lifecycle: row.lifecycle,
    amount: String(row.amount ?? ""),
    asset: row.asset,
    created_at: row.created_at,
    updated_at: row.updated_at,
    role: row.role,
    order_ref: row.order_ref,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    country_phone_code: row.country_phone_code,
    counterparty_name: row.counterparty_name,
    payment_tx_hash: row.payment_tx_hash,
    chain: row.chain,
    incident_summary: row.incident_summary,
    evidence_url: row.evidence_url,
    evidence_filename: row.evidence_filename,
    refund_mode: row.refund_mode,
    payout_destination: row.payout_destination,
    admin_notes: row.admin_notes,
    tracking_number: row.tracking_number,
    carrier: row.carrier,
  }));

  return <RefundDesk cases={cases} />;
}
