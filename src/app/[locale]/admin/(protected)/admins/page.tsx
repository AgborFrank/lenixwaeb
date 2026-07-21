"use client";

import { useEffect, useState } from "react";
import {
  UserCog,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.admins) {
        setAdmins(data.admins);
      }
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(adminId: string) {
    setProcessingId(adminId);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, action: "approve" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve admin");
      }

      toast.success("Admin approved successfully");
      fetchAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve admin");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(adminId: string) {
    setProcessingId(adminId);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, action: "reject" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reject admin");
      }

      toast.success("Admin request rejected");
      fetchAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject admin");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDeactivate(adminId: string) {
    if (!confirm("Are you sure you want to deactivate this admin?")) return;

    setProcessingId(adminId);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, action: "deactivate" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to deactivate admin");
      }

      toast.success("Admin deactivated");
      fetchAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to deactivate admin");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReactivate(adminId: string) {
    setProcessingId(adminId);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, action: "reactivate" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reactivate admin");
      }

      toast.success("Admin reactivated");
      fetchAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reactivate admin");
    } finally {
      setProcessingId(null);
    }
  }

  const pendingAdmins = admins.filter((a) => a.role === "pending" || !a.is_active);
  const activeAdmins = admins.filter((a) => a.role !== "pending" && a.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Management</h1>
        <p className="mt-1 text-zinc-400">
          Manage administrator accounts and approvals
        </p>
      </div>

      {/* Pending Approvals */}
      {pendingAdmins.length > 0 && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-3 border-b border-yellow-500/20 px-5 py-4">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div>
              <h2 className="font-semibold text-white">Pending Approvals</h2>
              <p className="text-sm text-zinc-400">
                {pendingAdmins.length} request{pendingAdmins.length !== 1 ? "s" : ""} awaiting review
              </p>
            </div>
          </div>
          <div className="divide-y divide-yellow-500/20">
            {pendingAdmins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/10 text-sm font-bold text-yellow-400">
                    {admin.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white">{admin.username}</p>
                    <p className="text-sm text-zinc-400">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-2 text-xs text-zinc-500">
                    Applied {new Date(admin.created_at).toLocaleDateString()}
                  </span>
                  {admin.role === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(admin.id)}
                        disabled={processingId === admin.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-50"
                      >
                        {processingId === admin.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(admin.id)}
                        disabled={processingId === admin.id}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {processingId === admin.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReactivate(admin.id)}
                      disabled={processingId === admin.id}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/20 disabled:opacity-50"
                    >
                      {processingId === admin.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Admins */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Active Administrators</h2>
            <p className="text-sm text-zinc-400">
              {activeAdmins.length} active admin{activeAdmins.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Admin
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Last Login
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-500" />
                  </td>
                </tr>
              ) : activeAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <UserCog className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      No active administrators
                    </p>
                  </td>
                </tr>
              ) : (
                activeAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-zinc-800/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-300">
                          {admin.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {admin.username}
                          </p>
                          <p className="text-sm text-zinc-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          admin.role === "super_admin"
                            ? "bg-purple-400/10 text-purple-400"
                            : "bg-blue-400/10 text-blue-400"
                        }`}
                      >
                        {admin.role === "super_admin" ? (
                          <ShieldAlert className="h-3 w-3" />
                        ) : (
                          <ShieldCheck className="h-3 w-3" />
                        )}
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-400/10 px-2 py-0.5 text-xs font-medium text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-zinc-400">
                      {admin.last_login
                        ? new Date(admin.last_login).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {admin.role !== "super_admin" && (
                        <button
                          onClick={() => handleDeactivate(admin.id)}
                          disabled={processingId === admin.id}
                          className="text-sm text-zinc-500 hover:text-red-400 disabled:opacity-50"
                        >
                          {processingId === admin.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Deactivate"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
