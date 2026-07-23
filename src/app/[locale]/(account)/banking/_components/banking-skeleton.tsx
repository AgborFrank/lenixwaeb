"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function BankingSkeleton() {
  const t = useTranslations("AccountBanking.skeleton");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6 px-2 sm:px-0 pb-20" aria-busy="true" aria-label={t("loading")}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-40 sm:w-56 bg-zinc-800" />
          <Skeleton className="h-3 sm:h-4 w-56 sm:w-80 bg-zinc-900" />
        </div>
        <Skeleton className="h-9 sm:h-10 w-28 sm:w-40 bg-zinc-800" />
      </div>
      <Skeleton className="h-40 sm:h-48 w-full rounded-xl bg-zinc-900" />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 sm:h-28 rounded-xl bg-zinc-900" />
        ))}
      </div>
      <Skeleton className="h-64 sm:h-96 w-full rounded-xl bg-zinc-900" />
    </div>
  );
}
