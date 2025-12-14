'use client';

import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
