'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [hasSession, setHasSession] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const desktopContentLeftOffset =
    'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))';
  const desktopSidebarLeftOffset = 'max(1rem, calc((100vw - 72rem) / 2 - 9rem))';

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
    <div
      className="min-h-screen bg-background"
      style={
        {
          '--shell-content-left-offset': desktopContentLeftOffset,
          '--shell-sidebar-left-offset': desktopSidebarLeftOffset,
        } as CSSProperties
      }
    >
      <AppSidebar
        hasSession={hasSession}
        isMobileNavOpen={isMobileNavOpen}
        onMobileNavOpenChange={setIsMobileNavOpen}
        isCollapsed={isSidebarCollapsed}
      />

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
          className="fixed left-[var(--shell-sidebar-left-offset)] top-6 z-50 hidden md:inline-flex"
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

        <main className="mt-6 pb-12">{children}</main>
      </div>
    </div>
  );
}
