'use client';

import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
