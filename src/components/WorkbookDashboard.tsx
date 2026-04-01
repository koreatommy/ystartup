"use client";

import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";

interface WorkbookDashboardProps {
  memberAreaHref: string;
}

export function WorkbookDashboard({ memberAreaHref }: WorkbookDashboardProps) {
  const [selectedId, setSelectedId] = useState("");

  return (
    <DashboardLayout
      selectedId={selectedId}
      onSelect={setSelectedId}
      memberAreaHref={memberAreaHref}
    />
  );
}
