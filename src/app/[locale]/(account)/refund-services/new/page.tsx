import { createClient } from "@/utils/supabase/server";
import { OpenRefundForm } from "./_components/open-refund-form";

export default async function OpenRefundPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <OpenRefundForm defaultEmail={user?.email ?? undefined} />;
}
