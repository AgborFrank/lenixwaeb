"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function BankingSkeleton() {
  const t = useTranslations("AccountBanking.skeleton");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-20" aria-busy="true" aria-label={t("loading")}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 bg-zinc-800" />
          <Skeleton className="h-4 w-80 bg-zinc-900" />
        </div>
        <Skeleton className="h-10 w-40 bg-zinc-800" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl bg-zinc-900" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl bg-zinc-900" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-xl bg-zinc-900" />
    </div>
  );
}
