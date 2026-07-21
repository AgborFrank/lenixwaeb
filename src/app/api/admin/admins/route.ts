import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, hasPermission } from "@/lib/admin-auth";
import { createClient } from "@/utils/supabase/server";

const actionSchema = z.object({
  id: z.string().uuid("Invalid admin ID"),
  action: z.enum(["approve", "reject", "deactivate", "reactivate"]),
});

export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, email, role, is_active, created_at, last_login")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
    }

    return NextResponse.json({ admins: data || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin admins GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentAdmin = await requireAdmin();
    const supabase = await createClient();

    // Only super_admin or admins with manage_admins permission can manage other admins
    if (currentAdmin.role !== "super_admin" && !hasPermission(currentAdmin, "manage_admins")) {
      return NextResponse.json(
        { error: "You don't have permission to manage admins" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, action } = parsed.data;

    // Prevent self-modification for deactivation
    if (id === currentAdmin.id && action === "deactivate") {
      return NextResponse.json(
        { error: "You cannot deactivate your own account" },
        { status: 400 }
      );
    }

    // Get target admin
    const { data: targetAdmin } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", id)
      .single();

    if (!targetAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Prevent modification of super_admin by non-super_admin
    if (targetAdmin.role === "super_admin" && currentAdmin.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can modify other super admins" },
        { status: 403 }
      );
    }

    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case "approve":
        updateData.is_active = true;
        updateData.role = "admin";
        break;
      case "reject":
        // Delete the pending admin instead of updating
        const { error: deleteError } = await supabase
          .from("admin_users")
          .delete()
          .eq("id", id)
          .eq("role", "pending");

        if (deleteError) {
          console.error("Delete admin error:", deleteError);
          return NextResponse.json({ error: "Failed to reject admin" }, { status: 500 });
        }

        return NextResponse.json({ success: true, action: "rejected" });

      case "deactivate":
        updateData.is_active = false;
        break;
      case "reactivate":
        updateData.is_active = true;
        break;
    }

    const { error } = await supabase
      .from("admin_users")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Update admin error:", error);
      return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin admins PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
