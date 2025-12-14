'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [hasSession, setHasSession] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (isMounted) {
        setHasSession(Boolean(session));
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (isMounted) {
        setHasSession(Boolean(session));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto w-full max-w-6xl px-6 pt-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-6 hidden md:inline-flex"
          aria-label="Toggle sidebar"
          aria-pressed={!isSidebarCollapsed}
          onClick={() => setIsSidebarCollapsed((previous) => !previous)}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        <div className="mt-6 flex w-full flex-col gap-6 pb-10 md:flex-row md:gap-8">
          <AppSidebar
            hasSession={hasSession}
            isMobileNavOpen={isMobileNavOpen}
            onMobileNavOpenChange={setIsMobileNavOpen}
            isCollapsed={isSidebarCollapsed}
          />
          <main className="flex-1 pb-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
