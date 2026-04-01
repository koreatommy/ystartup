import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/members";
import { CoachDashboard } from "./CoachDashboard";

export default async function CoachPage() {
  const profile = await getCurrentProfile();

  const role =
    profile && typeof profile.role === "string"
      ? profile.role.trim()
      : profile?.role;
  if (!profile || role !== "coach") {
    redirect("/");
  }

  return <CoachDashboard profile={profile} />;
}
