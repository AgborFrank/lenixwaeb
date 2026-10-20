import { redirect } from "@/i18n/navigation";

/** @deprecated Use /admin/settings/financial and /admin/settings/platform */
export default async function LegacyGeneralSettingsPage() {
  await redirect("/admin/settings/financial");
}
