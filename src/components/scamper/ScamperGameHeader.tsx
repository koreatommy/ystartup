"use client";

import type { ReactNode } from "react";

interface ScamperGameHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

export function ScamperGameHeader({ title, onBack, right }: ScamperGameHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "#aaa",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ←
      </button>
      <h2 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>{title}</h2>
      {right}
    </div>
  );
}
