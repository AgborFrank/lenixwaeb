import { NextResponse } from "next/server";
import { getAdminSession, getAdminById } from "@/lib/admin-auth";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 },
      );
    }

    // Get fresh admin data from database
    const admin = await getAdminById(session.id);

    if (!admin || !admin.is_active) {
      return NextResponse.json(
        { authenticated: false, error: "Session invalid" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error("Admin session error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Session check failed" },
      { status: 500 },
    );
  }
}
