import { redirect } from "@/i18n/navigation";

export default async function AdminPage() {
  await redirect("/admin/dashboard");
}
