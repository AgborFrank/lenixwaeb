import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminUserDirectory } from "@/lib/admin-user-directory";

export async function GET() {
  try {
    await requireAdmin();
    const users = await getAdminUserDirectory();
    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}
