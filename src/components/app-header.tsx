'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';

interface AppHeaderProps {
  showSessionControls?: boolean;
  hasSession?: boolean;
  isSidebarOpen?: boolean;
  onOpenMobileNav?: () => void;
  onToggleSidebar?: () => void;
}

export function AppHeader({
  showSessionControls = true,
  hasSession = false,
  isSidebarOpen = true,
  onOpenMobileNav,
  onToggleSidebar,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-sans text-sm uppercase tracking-[0.28em] text-foreground/70 transition-colors hover:text-foreground"
        >
          Refiner
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            aria-label="Toggle sidebar"
            aria-pressed={isSidebarOpen}
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={onOpenMobileNav}
          >
            <Menu className="h-4 w-4" />
          </Button>
          {showSessionControls && !hasSession && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden font-sans text-[0.7rem] uppercase tracking-[0.23em] text-foreground/70 hover:text-foreground md:inline-flex"
            >
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
