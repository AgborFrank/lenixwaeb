"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LoanStatusSelectProps {
  loanId: string;
  currentStatus: string;
}

const statuses = [
  { value: "pending", label: "Pending", className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  { value: "approved", label: "Approved", className: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "active", label: "Active", className: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  { value: "completed", label: "Completed", className: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "rejected", label: "Rejected", className: "bg-red-400/10 text-red-400 border-red-400/30" },
  { value: "defaulted", label: "Defaulted", className: "bg-red-400/10 text-red-400 border-red-400/30" },
];

export function LoanStatusSelect({ loanId, currentStatus }: LoanStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    const previousStatus = status;
    setStatus(newStatus);

    try {
      const res = await fetch("/api/admin/loans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loanId, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      toast.success("Loan status updated successfully");
    } catch (error) {
      setStatus(previousStatus);
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusConfig = statuses.find((s) => s.value === status) || statuses[0];

  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isUpdating}
        className={`appearance-none rounded-lg border px-3 py-1.5 pr-8 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50 disabled:opacity-50 ${currentStatusConfig.className}`}
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {isUpdating && (
        <Loader2 className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin" />
      )}
    </div>
  );
}
