'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FeatureRequestPanel } from '@/features/feature-request/components/FeatureRequestPanel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Refine' },
  { href: '/history', label: 'History' },
  { href: '/settings', label: 'Settings' },
];

interface AppSidebarProps {
  hasSession?: boolean;
  isMobileNavOpen: boolean;
  onMobileNavOpenChange: (open: boolean) => void;
  isCollapsed?: boolean;
}

export function AppSidebar({
  hasSession = false,
  isMobileNavOpen,
  onMobileNavOpenChange,
  isCollapsed = false,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isFeatureRequestOpen, setIsFeatureRequestOpen] = useState(false);

  const mobileNavLinks = hasSession
    ? navLinks
    : [{ href: '/login', label: 'Log in' }, ...navLinks];
  const desktopNavLinks = hasSession
    ? navLinks
    : [{ href: '/login', label: 'Log in' }, ...navLinks];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navItemClass =
    'rounded-sm px-3 py-2 font-sans text-xs uppercase tracking-[0.25em] text-foreground/70 transition-colors hover:text-foreground';

  const renderNavLink = (href: string, label: string, onClick?: () => void) => (
    <Link
      key={href}
      href={href}
      onClick={onClick}
      className={cn(
        navItemClass,
        isActive(href) && 'bg-card/80 text-foreground',
      )}
    >
      {label}
    </Link>
  );

  const renderSheetLink = (href: string, label: string) => (
    <Button
      key={href}
      asChild
      variant="ghost"
      className={cn(
        'h-11 w-full justify-start',
        navItemClass,
        isActive(href) && 'text-foreground',
      )}
    >
      <Link href={href} onClick={() => onMobileNavOpenChange(false)}>
        {label}
      </Link>
    </Button>
  );

  const openFeatureRequests = () => {
    onMobileNavOpenChange(false);
    setIsFeatureRequestOpen(true);
  };

  return (
    <>
      <aside
        className={cn(
          'fixed left-[var(--shell-sidebar-left-offset)] top-24 bottom-6 z-40 hidden w-52 overflow-y-auto transition-[opacity,transform] duration-200 md:block',
          isCollapsed && 'pointer-events-none -translate-x-2 opacity-0',
        )}
        aria-hidden={isCollapsed}
      >
        <div className="space-y-6">
          <nav className="flex flex-col gap-2">
            {desktopNavLinks.map((link) => renderNavLink(link.href, link.label))}
            <button
              type="button"
              className={cn(navItemClass, 'text-left')}
              onClick={() => setIsFeatureRequestOpen(true)}
            >
              Requests
            </button>
          </nav>
        </div>
      </aside>

      <Sheet open={isMobileNavOpen} onOpenChange={onMobileNavOpenChange}>
        <SheetContent side="left" className="w-72 px-5 py-6">
          <SheetHeader>
            <SheetTitle className="font-sans text-sm uppercase tracking-[0.23em] text-foreground/80">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-2">
            {mobileNavLinks.map((link) => renderSheetLink(link.href, link.label))}
            <Button
              type="button"
              variant="ghost"
              className={cn('h-11 w-full justify-start', navItemClass)}
              onClick={openFeatureRequests}
            >
              Requests
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <Dialog open={isFeatureRequestOpen} onOpenChange={setIsFeatureRequestOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Shape the refinement lab</DialogTitle>
          </DialogHeader>
          <FeatureRequestPanel inModal onSuccess={() => setIsFeatureRequestOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
