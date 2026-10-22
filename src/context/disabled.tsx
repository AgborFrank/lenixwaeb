"use client";

import type { ReactNode } from "react";

/**
 * Stand-in for AppKitProvider while NEXT_PUBLIC_ENABLE_WALLET is off.
 * next.config aliases `@/context` to this file so the Reown SDK is not bundled.
 */
export default function AppKitProvider({ children }: { children: ReactNode; cookies?: string | null }) {
  return children;
}
