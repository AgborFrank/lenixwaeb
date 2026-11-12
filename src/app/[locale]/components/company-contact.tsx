"use client";

import { createContext, useContext } from "react";
import { DEFAULT_PLATFORM_CONFIG } from "@/lib/platform-settings";

export interface CompanyContact {
  phone: string;
  address: string;
}

const CompanyContactContext = createContext<CompanyContact>({
  phone: DEFAULT_PLATFORM_CONFIG.company_phone,
  address: DEFAULT_PLATFORM_CONFIG.company_address,
});

export function CompanyContactProvider({
  value,
  children,
}: {
  value: CompanyContact;
  children: React.ReactNode;
}) {
  return (
    <CompanyContactContext.Provider value={value}>{children}</CompanyContactContext.Provider>
  );
}

export function useCompanyContact() {
  return useContext(CompanyContactContext);
}

export function addressLines(address: string) {
  return address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
