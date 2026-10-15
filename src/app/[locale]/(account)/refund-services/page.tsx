import { createClient } from "@/utils/supabase/server";
import { RefundDesk, type RefundCaseRow } from "./_components/refund-desk";

export default async function RefundServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("refund_requests")
        .select("id, status, lifecycle, amount, asset, created_at, role, order_ref")
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
    role: row.role,
    order_ref: row.order_ref,
  }));

  return <RefundDesk cases={cases} />;
}
