"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MemberSidebar, type MenuGroup } from "./MemberSidebar";
import { MemberHeader } from "./MemberHeader";
import type { Role } from "@/constants/member";
import type { Profile } from "@/types/member";

interface MemberLayoutProps {
  title: string;
  role: Role;
  menu: MenuGroup[];
  profile: Profile;
  defaultSelected: string;
  children: (selected: string, onSelect: (s: string) => void) => React.ReactNode;
}

export function MemberLayout({
  title,
  role,
  menu,
  profile,
  defaultSelected,
  children,
}: MemberLayoutProps) {
  const [selected, setSelected] = useState(defaultSelected);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <MemberSidebar
        title={title}
        role={role}
        menu={menu}
        selected={selected}
        onSelect={(item) => {
          setSelected(item);
          setMobileMenuOpen(false);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MemberHeader
          profile={profile}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 lg:px-8">
            {children(selected, setSelected)}
          </div>
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <MemberSidebar
            title={title}
            role={role}
            menu={menu}
            selected={selected}
            onSelect={(item) => {
              setSelected(item);
              setMobileMenuOpen(false);
            }}
            className="flex h-full bg-[var(--color-bg-base)] shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
