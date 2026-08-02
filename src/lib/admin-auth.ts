import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const BCRYPT_ROUNDS = 12;
const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  id: string;
  email: string;
  username: string;
  role: string;
  permissions: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  permissions: string[];
  created_at: string;
  last_login: string | null;
  wallet_address: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  // Reject placeholders / non-bcrypt values (e.g. "managed_by_supabase_auth")
  if (!hash || !hash.startsWith("$2")) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(admin: AdminSession): Promise<void> {
  const secret = getJwtSecret();

  const token = await new SignJWT({
    id: admin.id,
    email: admin.email,
    username: admin.username,
    role: admin.role,
    permissions: admin.permissions,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as string,
      email: payload.email as string,
      username: payload.username as string,
      role: payload.role as string,
      permissions: (payload.permissions as string[]) || [],
    };
  } catch {
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username, email, role, is_active, permissions, created_at, last_login, wallet_address")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as AdminUser;
}

export async function getAdminByEmail(email: string): Promise<(AdminUser & { password_hash: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username, email, password_hash, role, is_active, permissions, created_at, last_login, wallet_address")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !data) {
    return null;
  }

  return data as AdminUser & { password_hash: string };
}

export async function updateLastLogin(adminId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("admin_users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", adminId);
}

export async function logAdminLogin(
  adminId: string,
  ipAddress: string | null,
  userAgent: string | null,
  success: boolean,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("admin_login_history").insert({
    admin_id: adminId,
    ip_address: ipAddress,
    user_agent: userAgent,
    login_success: success,
    login_time: new Date().toISOString(),
  });
}

export function hasPermission(session: AdminSession, permission: string): boolean {
  if (session.role === "super_admin") {
    return true;
  }
  return session.permissions.includes(permission);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
