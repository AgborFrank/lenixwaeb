"use client";

import { PreferencesSettings } from "../_components/preferences-settings";

export default function PreferencesPage() {
  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <div className="mb-8 pb-6 border-b border-white/5">
         <h2 className="text-xl font-bold text-white">System Preferences</h2>
         <p className="text-sm text-zinc-500 mt-1">Customize your interface and notification settings.</p>
      </div>
      <PreferencesSettings />
    </div>
  );
}
