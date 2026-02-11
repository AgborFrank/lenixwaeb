"use client";

import { SecuritySettings } from "../_components/security-settings";

export default function SecurityPage() {
  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <div className="mb-8 pb-6 border-b border-white/5">
         <h2 className="text-xl font-bold text-white">Security Settings</h2>
         <p className="text-sm text-zinc-500 mt-1">Manage your password and security preferences.</p>
      </div>
      <SecuritySettings />
    </div>
  );
}
