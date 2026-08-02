import { redirect } from "@/i18n/navigation";
import { getAdminSession, getAdminById } from "@/lib/admin-auth";
import { AdminSidebar } from "./_components/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getAdminSession();

  if (!session) {
    await redirect("/admin/login");
  }

  // Verify admin is still active
  const admin = await getAdminById(session.id);
  if (!admin || !admin.is_active) {
    await redirect("/admin/login?error=Session expired. Please log in again.");
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar
        admin={{
          id: session.id,
          email: session.email,
          username: session.username,
          role: session.role,
        }}
      />
      <main className="pt-14 lg:ml-64 lg:pt-0">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
