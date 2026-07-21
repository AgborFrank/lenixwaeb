import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, getAdminByEmail } from "@/lib/admin-auth";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit } from "@/lib/server/rate-limit";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip");

    // Rate limiting
    if (!checkRateLimit(`admin-register:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { username, email, password } = parsed.data;

    // Check if email already exists
    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Check if username already exists
    const supabase = await createClient();
    const { data: existingUsername } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin with pending status
    const { data: newAdmin, error: insertError } = await supabase
      .from("admin_users")
      .insert({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: "pending",
        is_active: false,
        permissions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id, username, email")
      .single();

    if (insertError) {
      console.error("Admin registration error:", insertError);
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted. Please wait for an administrator to approve your access.",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
