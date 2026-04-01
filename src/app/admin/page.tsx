import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/members";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  const role =
    profile && typeof profile.role === "string"
      ? profile.role.trim()
      : profile?.role;
  if (!profile || role !== "super_admin") {
    redirect("/");
  }

  return <AdminDashboard profile={profile} />;
}
