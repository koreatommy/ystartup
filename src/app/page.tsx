"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Home() {
  const [selectedId, setSelectedId] = useState("");

  return (
    <div className="h-full w-full">
      <DashboardLayout selectedId={selectedId} onSelect={setSelectedId} />
    </div>
  );
}
