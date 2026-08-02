import { redirect } from "@/i18n/navigation";

export default async function SettingsPage() {
  await redirect("/admin/settings/general");
}
