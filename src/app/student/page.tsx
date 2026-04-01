import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/members";
import { StudentDashboard } from "./StudentDashboard";

export default async function StudentPage() {
  const profile = await getCurrentProfile();

  const role =
    profile && typeof profile.role === "string"
      ? profile.role.trim()
      : profile?.role;
  if (!profile || role !== "student") {
    redirect("/");
  }

  return <StudentDashboard profile={profile} />;
}
