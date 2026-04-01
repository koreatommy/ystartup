import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/members";
import { WorkbookDashboard } from "@/components/WorkbookDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.status !== "approved") {
    redirect("/pending");
  }

  const roleRoutes: Record<string, string> = {
    super_admin: "/admin",
    coach: "/coach",
    student: "/student",
  };

  const role =
    typeof profile.role === "string" ? profile.role.trim() : String(profile.role);
  const memberAreaHref = roleRoutes[role] || "/login";

  return (
    <WorkbookDashboard
      memberAreaHref={memberAreaHref}
      headerUser={{
        name: profile.name,
        role: profile.role,
        email: profile.email,
      }}
    />
  );
}
