import { createClient } from "@/utils/supabase/server";
import { OpenRecoveryForm } from "./_components/open-recovery-form";

export default async function OpenRecoveryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <OpenRecoveryForm defaultEmail={user?.email ?? undefined} />;
}
