"use client";

import { ProfileSettings } from "./_components/profile-settings";

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <div className="mb-8 pb-6 border-b border-white/5">
         <h2 className="text-xl font-bold text-white">Profile Information</h2>
         <p className="text-sm text-zinc-500 mt-1">Update your photo and personal details.</p>
      </div>
      <ProfileSettings />
    </div>
  );
}
