import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAdminByEmail,
  verifyPassword,
  createAdminSession,
  updateLastLogin,
  logAdminLogin,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/server/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    // Rate limiting
    if (!checkRateLimit(`admin-login:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Find admin by email
    const admin = await getAdminByEmail(email);

    if (!admin) {
      // Log failed attempt (no admin found - use a placeholder ID)
      await logAdminLogin("unknown", ip, userAgent, false);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, admin.password_hash);

    if (!isValid) {
      await logAdminLogin(admin.id, ip, userAgent, false);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if admin is active
    if (!admin.is_active) {
      await logAdminLogin(admin.id, ip, userAgent, false);

      if (admin.role === "pending") {
        return NextResponse.json(
          { error: "Your account is pending approval. Please wait for an administrator to approve your access." },
          { status: 403 },
        );
      }

      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact an administrator." },
        { status: 403 },
      );
    }

    // Create session
    await createAdminSession({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions || [],
    });

    // Update last login and log success
    await updateLastLogin(admin.id);
    await logAdminLogin(admin.id, ip, userAgent, true);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 },
    );
  }
}
