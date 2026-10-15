"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Save,
  Shield,
  Hash,
  Store,
} from "lucide-react";
import { toast } from "sonner";

interface RefundEvent {
  id: string;
  event_type: string;
  actor: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

interface RefundRequest {
  id: string;
  role: string;
  full_name: string;
  email: string;
  phone: string | null;
  country_phone_code: string | null;
  counterparty_name: string | null;
  order_ref: string | null;
  payment_tx_hash: string;
  amount: string;
  asset: string;
  chain: string | null;
  incident_summary: string;
  evidence_url: string | null;
  evidence_filename: string | null;
  status: string;
  lifecycle: string;
  refund_mode: string | null;
  admin_notes: string | null;
  created_at: string;
}

const statuses = [
  { value: "pending", label: "Pending Review", icon: Clock, className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  { value: "in_progress", label: "In Progress", icon: AlertCircle, className: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  { value: "completed", label: "Completed", icon: CheckCircle2, className: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "rejected", label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400 border-red-400/30" },
];

export default function RefundDetailPage() {
  const params = useParams();
  const requestId = params.requestId as string;
  const [data, setData] = useState<RefundRequest | null>(null);
  const [events, setEvents] = useState<RefundEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  async function fetchRequest() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/refunds/${requestId}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        setEvents(result.events ?? []);
        setStatus(result.data.status);
        setAdminNotes(result.data.admin_notes || "");
      } else {
        toast.error(result.error || "Failed to load request");
      }
    } catch {
      toast.error("Failed to load request");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  async function handleStatusUpdate() {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/refunds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status, admin_notes: adminNotes }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Case updated");
        fetchRequest();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Shield className="h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-zinc-400">Refund request not found</p>
        <Link href="/admin/refunds" className="mt-4 text-sm text-yellow-400 hover:underline">
          Back to purchase refunds
        </Link>
      </div>
    );
  }

  const currentStatusConfig = statuses.find((item) => item.value === data.status) || statuses[0];
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/refunds"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{data.full_name}</h1>
          <p className="mt-1 text-zinc-400">
            Purchase refund #{data.id.slice(0, 8)} · {data.role}
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${currentStatusConfig.className}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="font-medium">{currentStatusConfig.label}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Contact</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-sm">
                <User className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div>
                  <dt className="text-zinc-500">Name</dt>
                  <dd className="text-white">{data.full_name}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Mail className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div>
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="text-white">{data.email}</dd>
                </div>
              </div>
              {data.phone && (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="mt-0.5 h-4 w-4 text-zinc-500" />
                  <div>
                    <dt className="text-zinc-500">Phone</dt>
                    <dd className="text-white">
                      {data.phone} {data.country_phone_code ? `(${data.country_phone_code})` : ""}
                    </dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm">
                <Store className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div>
                  <dt className="text-zinc-500">Counterparty</dt>
                  <dd className="text-white">{data.counterparty_name || "—"}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Claim</h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-zinc-500">Amount</dt>
                <dd className="text-white">
                  {data.amount} {data.asset}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Chain</dt>
                <dd className="text-white">{data.chain || "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Order</dt>
                <dd className="text-white">{data.order_ref || "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Lifecycle</dt>
                <dd className="capitalize text-white">{data.lifecycle.replaceAll("_", " ")}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-1 text-zinc-500">
                  <Hash className="h-3.5 w-3.5" /> Payment proof
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-zinc-300">{data.payment_tx_hash}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              <FileText className="h-4 w-4" />
              Incident
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{data.incident_summary}</p>
            {data.evidence_url && (
              <a
                href={data.evidence_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm text-yellow-400 hover:text-yellow-300"
              >
                {data.evidence_filename || "Open evidence"}
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Update case</h2>
            <label htmlFor="refund-status" className="mb-1.5 block text-xs text-zinc-500">
              Status
            </label>
            <select
              id="refund-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
            >
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <label htmlFor="refund-notes" className="mb-1.5 block text-xs text-zinc-500">
              Admin notes
            </label>
            <textarea
              id="refund-notes"
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              rows={5}
              className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
            />
            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-300 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
            <p className="mt-3 text-xs text-zinc-500">
              Do not issue a payout from this screen. Underwriting is a later slice.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Events</h2>
            {events.length === 0 ? (
              <p className="text-sm text-zinc-500">No events yet</p>
            ) : (
              <ol className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="border-l border-zinc-700 pl-3 text-sm">
                    <p className="text-white">{event.event_type}</p>
                    <p className="text-xs text-zinc-500">
                      {event.actor} · {new Date(event.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
