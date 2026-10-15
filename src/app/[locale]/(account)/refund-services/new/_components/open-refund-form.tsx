"use client";

import { useState, type ReactNode } from "react";
import { Country } from "country-state-city";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { adminGlass } from "@/lib/admin-glass";
import { REFUND_ASSETS, REFUND_CHAINS } from "@/lib/refund/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpenRefundFormProps {
  defaultEmail?: string;
}

interface Draft {
  role: "buyer" | "seller";
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  counterparty: string;
  orderRef: string;
  payment: string;
  amount: string;
  currency: string;
  chain: string;
  summary: string;
  file: File | null;
}

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

export function OpenRefundForm({ defaultEmail }: OpenRefundFormProps) {
  const t = useTranslations("PurchaseRefund.Account.open");
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pending, setPending] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Draft>({
    role: "buyer",
    name: "",
    email: defaultEmail ?? "",
    phone: "",
    countryCode: "US:+1",
    counterparty: "",
    orderRef: "",
    payment: "",
    amount: "",
    currency: "USD",
    chain: "",
    summary: "",
    file: null,
  });

  const fieldClass = `h-9 ${adminGlass.field}`;

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate(current: 1 | 2) {
    const next: Record<string, string> = {};
    if (current === 1) {
      if (!draft.name.trim()) next.name = t("required");
      if (!draft.email.trim() || !/\S+@\S+\.\S+/.test(draft.email)) next.email = t("emailError");
      if (draft.payment.trim().length < 8) next.payment = t("proofError");
      if (!draft.amount.trim()) next.amount = t("required");
    }
    if (current === 2 && draft.summary.trim().length < 20) next.summary = t("summaryError");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    setPending(true);
    try {
      const body = new FormData();
      body.set("role", draft.role);
      body.set("name", draft.name.trim());
      body.set("email", draft.email.trim());
      body.set("phone_number", draft.phone.trim());
      body.set("country_phone_code", draft.countryCode);
      body.set("counterparty_name", draft.counterparty.trim());
      body.set("order_ref", draft.orderRef.trim());
      body.set("payment_tx_hash", draft.payment.trim());
      body.set("amount", draft.amount.trim());
      body.set("currency", draft.currency);
      if (draft.chain) body.set("blockchain", draft.chain);
      body.set("incident_summary", draft.summary.trim());
      if (draft.file) body.set("evidence", draft.file);

      const res = await fetch("/api/refund-request", {
        method: "POST",
        body,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : t("summaryError"));
        return;
      }
      setSubmittedId(typeof data.id === "string" ? data.id : "received");
      router.refresh();
    } catch {
      toast.error(t("summaryError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/refund-services"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ChevronLeft className="size-4" />
          {t("backToList")}
        </Link>
        <p className={`mt-4 ${adminGlass.eyebrow}`}>{t("eyebrow")}</p>
        <h1 className={`mt-1 ${adminGlass.title}`}>{t("title")}</h1>
        <p className={`mt-2 ${adminGlass.description}`}>{t("subtitle")}</p>
      </div>

      <section className={`${adminGlass.surface} overflow-hidden`}>
        {submittedId ? (
          <div className="px-5 py-12 text-center sm:px-8">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <Check className="size-4" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">{t("submittedTitle")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              {t("submittedBody", { id: submittedId.slice(0, 8) })}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Button type="button" className="bg-white text-black hover:bg-zinc-200" asChild>
                <Link href="/refund-services">{t("done")}</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={adminGlass.field}
                onClick={() => {
                  setSubmittedId(null);
                  setStep(1);
                }}
              >
                {t("another")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-300">{t(`steps.${step}`)}</p>
              <div className="flex gap-1" aria-hidden>
                {[1, 2, 3].map((id) => (
                  <span
                    key={id}
                    className={`h-0.5 w-8 rounded-full sm:w-12 ${id <= step ? "bg-white" : "bg-white/10"}`}
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="grid gap-5">
                <div>
                  <Label className="text-sm font-medium text-zinc-200">{t("role")}</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["buyer", "seller"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setField("role", value)}
                        className={
                          draft.role === value
                            ? "h-10 rounded-md border border-white/15 bg-white/[0.08] text-sm font-medium text-white"
                            : "h-10 rounded-md border border-white/10 bg-black/20 text-sm text-zinc-400 hover:bg-white/[0.04]"
                        }
                      >
                        {value === "buyer" ? t("roleBuyer") : t("roleSeller")}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label={t("name")} error={errors.name}>
                  <Input
                    value={draft.name}
                    onChange={(event) => setField("name", event.target.value)}
                    placeholder={t("namePlaceholder")}
                    className={fieldClass}
                    autoComplete="name"
                  />
                </Field>
                <Field label={t("email")} error={errors.email}>
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setField("email", event.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className={fieldClass}
                    autoComplete="email"
                  />
                </Field>
                <Field label={t("phone")}>
                  <div className="flex gap-2">
                    <Select
                      value={draft.countryCode.split(":")[0] || "US"}
                      onValueChange={(iso) => {
                        const country = countries.find((item) => item.isoCode === iso);
                        if (country) setField("countryCode", `${country.isoCode}:+${country.phonecode}`);
                      }}
                    >
                      <SelectTrigger className={`w-[7.5rem] shrink-0 ${fieldClass}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 border-white/10 bg-zinc-950 text-white">
                        {countries.map((country) => (
                          <SelectItem key={country.isoCode} value={country.isoCode}>
                            {country.isoCode} +{country.phonecode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={draft.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      inputMode="tel"
                      className={fieldClass}
                      autoComplete="tel"
                    />
                  </div>
                </Field>
                <Field label={t("counterparty")}>
                  <Input
                    value={draft.counterparty}
                    onChange={(event) => setField("counterparty", event.target.value)}
                    placeholder={t("counterpartyPlaceholder")}
                    className={fieldClass}
                  />
                </Field>
                <Field label={t("order")}>
                  <Input
                    value={draft.orderRef}
                    onChange={(event) => setField("orderRef", event.target.value)}
                    placeholder={t("orderPlaceholder")}
                    className={fieldClass}
                  />
                </Field>
                <Field label={t("payment")} error={errors.payment}>
                  <Input
                    value={draft.payment}
                    onChange={(event) => setField("payment", event.target.value)}
                    placeholder={t("paymentPlaceholder")}
                    className={`${fieldClass} font-mono text-xs`}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("amount")} error={errors.amount}>
                    <Input
                      value={draft.amount}
                      onChange={(event) => setField("amount", event.target.value)}
                      inputMode="decimal"
                      placeholder={t("amountPlaceholder")}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label={t("currency")}>
                    <Select value={draft.currency} onValueChange={(value) => setField("currency", value)}>
                      <SelectTrigger className={fieldClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-zinc-950 text-white">
                        {REFUND_ASSETS.map((asset) => (
                          <SelectItem key={asset} value={asset}>
                            {asset}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label={t("chain")}>
                  <Select
                    value={draft.chain || "none"}
                    onValueChange={(value) => setField("chain", value === "none" ? "" : value)}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-zinc-950 text-white">
                      <SelectItem value="none">{t("chainNone")}</SelectItem>
                      {REFUND_CHAINS.map((chain) => (
                        <SelectItem key={chain} value={chain}>
                          {chain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <Field label={t("summary")} error={errors.summary}>
                  <Textarea
                    value={draft.summary}
                    onChange={(event) => setField("summary", event.target.value)}
                    placeholder={t("summaryPlaceholder")}
                    rows={6}
                    className={`min-h-32 ${adminGlass.field}`}
                  />
                  <p className="text-xs tabular-nums text-zinc-500">
                    {t("chars", { count: draft.summary.trim().length })}
                  </p>
                </Field>
                <Field label={t("evidence")}>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-white/15 bg-black/20 px-3 py-3 text-sm text-zinc-400 hover:bg-white/[0.03]">
                    <span className="truncate">{draft.file ? draft.file.name : t("evidenceHint")}</span>
                    <span className="shrink-0 text-xs font-medium text-white">{t("upload")}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="sr-only"
                      onChange={(event) => setField("file", event.target.files?.[0] ?? null)}
                    />
                  </label>
                </Field>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {t.rich("privacy", {
                    link: (chunks) => (
                      <Link href="/privacy-policy" className="text-white underline-offset-4 hover:underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">{t("reviewHint")}</p>
                <dl className="grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2">
                  <ReviewItem label={t("role")} value={draft.role === "buyer" ? t("roleBuyer") : t("roleSeller")} />
                  <ReviewItem label={t("name")} value={draft.name} />
                  <ReviewItem label={t("email")} value={draft.email} />
                  <ReviewItem label={t("phone")} value={draft.phone || "—"} />
                  <ReviewItem label={t("counterparty")} value={draft.counterparty || "—"} />
                  <ReviewItem label={t("order")} value={draft.orderRef || "—"} />
                  <ReviewItem label={t("payment")} value={draft.payment} mono />
                  <ReviewItem label={t("amount")} value={`${draft.amount} ${draft.currency}`} />
                  <ReviewItem label={t("chain")} value={draft.chain || t("chainNone")} />
                  <ReviewItem label={t("evidence")} value={draft.file?.name || "—"} />
                  <div className="bg-zinc-950/80 px-4 py-3 sm:col-span-2">
                    <dt className="text-xs text-zinc-500">{t("summary")}</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm text-zinc-100">{draft.summary}</dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:justify-end">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className={adminGlass.field}
                  disabled={pending}
                  onClick={() => setStep((current) => (current === 3 ? 2 : 1))}
                >
                  {t("back")}
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  className="bg-white text-black hover:bg-zinc-200"
                  onClick={() => {
                    if (step === 1 && !validate(1)) return;
                    if (step === 2 && !validate(2)) return;
                    setStep((current) => (current === 1 ? 2 : 3));
                  }}
                >
                  {t("continue")}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-white text-black hover:bg-zinc-200"
                  disabled={pending}
                  onClick={submit}
                >
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {pending ? t("submitting") : t("submit")}
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-zinc-200">{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

function ReviewItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-zinc-950/80 px-4 py-3">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className={`mt-1 break-all text-sm text-zinc-100 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
