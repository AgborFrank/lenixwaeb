import { NextResponse } from "next/server";
import { getBankingOverviewForUser } from "@/lib/banking/overview";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const overview = await getBankingOverviewForUser(supabase, user.id, user.email ?? null);

    return NextResponse.json({ data: overview }, { status: 200 });
  } catch (error) {
    console.error("Banking overview error", error);
    return NextResponse.json({ error: "Unable to load banking overview" }, { status: 500 });
  }
}
