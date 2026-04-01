"use client";

import { useState } from "react";
import type { WorkbookHeaderUser } from "@/types/dashboard";
import { DashboardLayout } from "./DashboardLayout";

interface WorkbookDashboardProps {
  memberAreaHref: string;
  headerUser: WorkbookHeaderUser;
}

export function WorkbookDashboard({ memberAreaHref, headerUser }: WorkbookDashboardProps) {
  const [selectedId, setSelectedId] = useState("");

  return (
    <DashboardLayout
      selectedId={selectedId}
      onSelect={setSelectedId}
      memberAreaHref={memberAreaHref}
      headerUser={headerUser}
    />
  );
}
