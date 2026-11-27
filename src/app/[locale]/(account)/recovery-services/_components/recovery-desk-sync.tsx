"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export function RecoveryDeskSync() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}
