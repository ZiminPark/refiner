'use client';

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader showSessionControls={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
