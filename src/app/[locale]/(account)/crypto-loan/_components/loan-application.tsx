"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CheckCircle2, Landmark, Building2, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { applyForLoan } from "../actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LoanType = {
  id: number;
  name: string;
  ltv: string | number;
  interest_rate: string | number;
  min_collateral: string | number;
  max_collateral: string | number;
};

const CARD_GRADIENTS = [
  "from-amber-500/15 via-yellow-500/10 to-orange-500/15 border-amber-400/20",
  "from-blue-500/15 via-cyan-500/10 to-sky-500/15 border-blue-400/20",
  "from-emerald-500/15 via-teal-500/10 to-green-500/15 border-emerald-400/20",
];

const DURATION_KEYS = ["6", "12", "24"] as const;

export function LoanApplication({ loanTypes }: { loanTypes: LoanType[] }) {
  const t = useTranslations("AccountCryptoLoan.application");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    loan_type_id: loanTypes[0]?.id?.toString() || "",
    loan_amount: "",
    collateral_asset: "BTC",
    duration: "12",
    payout_method: "crypto",
    phone_number: "",
    telegram_or_whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateForm = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });

    const result = await applyForLoan(payload);
    setIsSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/crypto-loan");
    router.refresh();
  };

  const phase = step === 1 ? t("phase_details") : t("phase_payout");

  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="mb-10 text-center">
        <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white">
          {t("step_label", { step, phase })}
        </span>
        <h1 className="mb-2 text-3xl font-bold text-white">
          {step === 1 ? t("title_details") : t("title_payout")}
        </h1>
        <p className="text-zinc-400">{step === 1 ? t("subtitle_details") : t("subtitle_payout")}</p>
      </div>

      <div className="rounded-3xl border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {step === 1 ? (
          <StepOne loanTypes={loanTypes} formData={formData} updateForm={updateForm} onNext={handleNext} />
        ) : (
          <StepTwo
            formData={formData}
            updateForm={updateForm}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <Dialog open={showSuccessModal} onOpenChange={(open) => !open && handleSuccessClose()}>
        <DialogContent className="max-w-sm border-white/10 bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-white">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              {t("success_title")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">{t("success_description")}</p>
          <Button onClick={handleSuccessClose} className="w-full bg-yellow-400 font-bold text-black hover:bg-yellow-500">
            {t("view_loans")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StepOne({ loanTypes, formData, updateForm, onNext }: any) {
  const t = useTranslations("AccountCryptoLoan.application");
  const tDuration = useTranslations("AccountCryptoLoan.duration");
  const tCollateral = useTranslations("AccountCryptoLoan.collateral_assets");

  return (
    <form onSubmit={onNext} className="space-y-6">
      <div className="space-y-3">
        <Label className="text-zinc-300">{t("select_loan_type")}</Label>
        <RadioGroup
          value={formData.loan_type_id}
          onValueChange={(v) => updateForm("loan_type_id", v)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {loanTypes.map((type: LoanType, i: number) => (
            <label
              key={type.id}
              className={cn(
                "relative flex cursor-pointer flex-col rounded-2xl border bg-gradient-to-br p-5 transition-all hover:scale-[1.02] hover:shadow-lg",
                CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                formData.loan_type_id === type.id.toString() ? "ring-2 ring-yellow-400/50" : "border-white/10",
              )}
            >
              <RadioGroupItem value={type.id.toString()} className="absolute right-4 top-4 border-white/30 text-yellow-400" />
              <span className="pr-8 text-lg font-bold text-white">{type.name}</span>
              <p className="mt-1 text-sm text-white/80">
                {t("loan_type_summary", { rate: type.interest_rate, ltv: type.ltv })}
              </p>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-300">{t("borrow_amount")}</Label>
          <Input
            type="number"
            value={formData.loan_amount}
            onChange={(e) => updateForm("loan_amount", e.target.value)}
            placeholder={t("borrow_amount_placeholder")}
            className="h-12 border-white/10 bg-zinc-950/50 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">{t("collateral_asset")}</Label>
          <Select value={formData.collateral_asset} onValueChange={(v) => updateForm("collateral_asset", v)}>
            <SelectTrigger className="h-12 border-white/10 bg-zinc-950/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-900">
              <SelectItem value="BTC">{tCollateral("BTC")} (BTC)</SelectItem>
              <SelectItem value="ETH">{tCollateral("ETH")} (ETH)</SelectItem>
              <SelectItem value="SOL">{tCollateral("SOL")} (SOL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-zinc-300">{t("duration")}</Label>
        <RadioGroup
          value={formData.duration}
          onValueChange={(v) => updateForm("duration", v)}
          className="grid grid-cols-3 gap-3"
        >
          {DURATION_KEYS.map((key) => (
            <label
              key={key}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 hover:bg-white/5",
                formData.duration === key
                  ? "border-yellow-400/50 bg-yellow-400/20 text-yellow-400"
                  : "bg-white/5 text-zinc-400",
              )}
            >
              <RadioGroupItem value={key} className="sr-only" />
              <span className="text-sm font-medium">{tDuration(key)}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" className="h-12 w-full bg-yellow-400 text-lg font-bold text-black hover:bg-yellow-500">
        {t("continue_payout")}
      </Button>
    </form>
  );
}

function StepTwo({ formData, updateForm, onSubmit, onBack, isSubmitting }: any) {
  const t = useTranslations("AccountCryptoLoan.application");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/30 p-6">
        <div>
          <h3 className="mb-1 text-sm font-semibold text-white">{t("contact_title")}</h3>
          <p className="text-xs text-zinc-500">{t("contact_subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-zinc-400">{t("phone_number")}</Label>
            <Input
              type="tel"
              placeholder={t("phone_placeholder")}
              className="border-white/10 bg-black/20 text-white"
              onChange={(e) => updateForm("phone_number", e.target.value)}
              value={formData.phone_number || ""}
            />
            <p className="text-[11px] text-zinc-500">{t("phone_hint")}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">{t("telegram_whatsapp")}</Label>
            <Input
              type="text"
              placeholder={t("telegram_placeholder")}
              className="border-white/10 bg-black/20 text-white"
              onChange={(e) => updateForm("telegram_or_whatsapp", e.target.value)}
              value={formData.telegram_or_whatsapp || ""}
            />
            <p className="text-[11px] text-zinc-500">{t("telegram_hint")}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">{t("funds_title")}</h3>
        <RadioGroup
          value={formData.payout_method}
          onValueChange={(v) => updateForm("payout_method", v)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <PayoutOption
            value="crypto"
            icon={Wallet}
            label={t("payout_crypto")}
            sub={t("payout_crypto_sub")}
            selected={formData.payout_method === "crypto"}
          />
          <PayoutOption
            value="wire_transfer"
            icon={Landmark}
            label={t("payout_wire")}
            sub={t("payout_wire_sub")}
            selected={formData.payout_method === "wire_transfer"}
          />
          <PayoutOption
            value="bank"
            icon={Building2}
            label={t("payout_bank")}
            sub={t("payout_bank_sub")}
            selected={formData.payout_method === "bank"}
          />
        </RadioGroup>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/30 p-6">
        {formData.payout_method === "crypto" && (
          <>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("wallet_address")}</Label>
              <Input
                required
                placeholder={t("wallet_placeholder")}
                className="border-white/10 bg-black/20 font-mono text-white"
                onChange={(e) => updateForm("wallet_address", e.target.value)}
                value={formData.wallet_address || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("network")}</Label>
              <Select value={formData.network || ""} onValueChange={(v) => updateForm("network", v)}>
                <SelectTrigger className="border-white/10 bg-black/20 text-white">
                  <SelectValue placeholder={t("select_network")} />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  <SelectItem value="ERC20">{t("network_erc20")}</SelectItem>
                  <SelectItem value="TRC20">{t("network_trc20")}</SelectItem>
                  <SelectItem value="BSC">{t("network_bsc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {formData.payout_method === "wire_transfer" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("bank_name")}</Label>
              <Input
                required
                placeholder={t("bank_name_placeholder")}
                className="border-white/10 bg-black/20 text-white"
                onChange={(e) => updateForm("bank_name", e.target.value)}
                value={formData.bank_name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("swift_bic")}</Label>
              <Input
                required
                placeholder={t("swift_placeholder")}
                className="border-white/10 bg-black/20 font-mono text-white"
                onChange={(e) => updateForm("swift_bic", e.target.value)}
                value={formData.swift_bic || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("account_number")}</Label>
              <Input
                required
                placeholder={t("account_number_placeholder")}
                className="border-white/10 bg-black/20 font-mono text-white"
                onChange={(e) => updateForm("account_number", e.target.value)}
                value={formData.account_number || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("account_holder")}</Label>
              <Input
                required
                placeholder={t("account_holder_placeholder")}
                className="border-white/10 bg-black/20 text-white"
                onChange={(e) => updateForm("account_name", e.target.value)}
                value={formData.account_name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("reference_optional")}</Label>
              <Input
                placeholder={t("reference_placeholder")}
                className="border-white/10 bg-black/20 text-white"
                onChange={(e) => updateForm("reference", e.target.value)}
                value={formData.reference || ""}
              />
            </div>
          </div>
        )}

        {formData.payout_method === "bank" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("bank_name")}</Label>
              <Input
                required
                placeholder={t("bank_name_alt_placeholder")}
                className="border-white/10 bg-black/20 text-white"
                onChange={(e) => updateForm("bank_name", e.target.value)}
                value={formData.bank_name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("routing_iban")}</Label>
              <Input
                required
                placeholder={t("routing_iban_placeholder")}
                className="border-white/10 bg-black/20 font-mono text-white"
                onChange={(e) => updateForm("routing_iban", e.target.value)}
                value={formData.routing_iban || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("account_number")}</Label>
              <Input
                required
                placeholder={t("account_number_placeholder")}
                className="border-white/10 bg-black/20 font-mono text-white"
                onChange={(e) => updateForm("account_number", e.target.value)}
                value={formData.account_number || ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">{t("account_holder")}</Label>
              <Input
                required
                placeholder={t("account_holder_placeholder")}
                className="border-white/10 bg-black/20 text-white"
                onChange={(e) => updateForm("account_holder", e.target.value)}
                value={formData.account_holder || ""}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 flex-1 border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 flex-[2] bg-yellow-400 text-lg font-bold text-black hover:bg-yellow-500"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}

function PayoutOption({ value, icon: Icon, label, sub, selected }: any) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 transition-all hover:bg-white/5",
        selected ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-white/10 bg-white/5 text-zinc-400",
      )}
    >
      <RadioGroupItem value={value} className="sr-only" />
      <Icon className={cn("mb-2 h-6 w-6", selected ? "text-yellow-400" : "text-zinc-500")} />
      <span className="text-center text-sm font-bold">{label}</span>
      <span className="text-[10px] opacity-70">{sub}</span>
      {selected && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-400" />}
    </label>
  );
}
