'use client';

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
