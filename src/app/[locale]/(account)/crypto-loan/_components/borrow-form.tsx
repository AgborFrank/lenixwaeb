"use client";

import { useState } from "react";
import { ArrowDown, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useSettings } from "@/app/[locale]/(account)/_providers/settings-provider";

export function BorrowForm() {
  const t = useTranslations("AccountCryptoLoan.borrow_form");
  const [ltv, setLtv] = useState([50]);
  const [amount, setAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const { formatCurrency } = useSettings();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-zinc-900 p-6">
      <div className="mb-6">
        <h3 className="mb-1 text-xl font-semibold text-white">{t("title")}</h3>
        <p className="text-sm text-zinc-500">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="borrow" className="flex flex-1 flex-col">
        <TabsList className="mb-6 grid grid-cols-2 bg-zinc-950/50 p-1">
          <TabsTrigger value="borrow" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            {t("borrow_tab")}
          </TabsTrigger>
          <TabsTrigger value="repay" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            {t("repay_tab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="borrow" className="flex flex-1 flex-col space-y-6">
          <div className="flex flex-1 flex-col space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">{t("want_to_borrow")}</label>
                <div className="relative">
                  <Input
                    name="borrowAmount"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    className="h-12 border-zinc-800 bg-zinc-950/50 pl-4 pr-32 text-lg focus-visible:ring-yellow-500/20"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="absolute bottom-1 right-1 top-1 w-28">
                    <Select name="borrowAsset" defaultValue="USDT">
                      <SelectTrigger className="h-full border-0 bg-transparent hover:bg-zinc-900 focus:ring-0">
                        <SelectValue placeholder={t("asset_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDT">USDT</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">{t("my_collateral")}</label>
                <div className="relative">
                  <Input
                    name="collateralAmount"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    className="h-12 border-zinc-800 bg-zinc-950/50 pl-4 pr-32 text-lg focus-visible:ring-yellow-500/20"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    required
                  />
                  <div className="absolute bottom-1 right-1 top-1 w-28">
                    <Select name="collateralAsset" defaultValue="BTC">
                      <SelectTrigger className="h-full border-0 bg-transparent hover:bg-zinc-900 focus:ring-0">
                        <SelectValue placeholder={t("asset_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 py-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm">
                  <span className="text-zinc-400">{t("ltv")}:</span>{" "}
                  <span className="ml-1 font-bold text-white">{ltv[0]}%</span>
                </label>
                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                  {t("low_risk")}
                </span>
              </div>
              <Slider value={ltv} onValueChange={setLtv} max={85} step={1} className="cursor-pointer py-2" />
            </div>

            <div className="mt-auto space-y-3 rounded-xl border border-white/5 bg-zinc-950/30 p-4">
              <SummaryRow label={t("apy")} value="5.5%" highlight />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{t("total_repayment")}</span>
                <span className="text-lg font-bold text-white">{formatCurrency(Number(amount))}</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-yellow-500 font-medium text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400"
            >
              <Link href="/crypto-loan?mode=apply">{t("apply_new_loan")}</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="repay" className="space-y-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50">
            <Lock className="h-8 w-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white">{t("repay_title")}</h3>
          <p className="mx-auto max-w-xs text-sm text-zinc-500">{t("repay_description")}</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <div className="text-right">
        <span className={`font-medium ${highlight ? "text-emerald-400" : "text-zinc-200"}`}>{value}</span>
        {sublabel && <span className="ml-1 text-xs text-zinc-500">{sublabel}</span>}
      </div>
    </div>
  );
}
