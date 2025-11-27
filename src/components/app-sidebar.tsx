'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSidebarStore } from '@/hooks/useSidebarStore';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, History, Home, Menu, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/home', label: 'Refine', icon: Home },
  { href: '/home/history', label: 'History', icon: History },
  { href: '/home/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex border-r border-border bg-white/70 backdrop-blur flex-col transition-all duration-300 relative h-screen",
        isCollapsed ? "w-20" : "w-60"
      )}>
        {/* Toggle Icon */}
        <div className="flex justify-end border-b border-border px-3 py-3">
          <button
            onClick={toggle}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:text-foreground'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-2 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 border-l-2 border-transparent px-4 py-3 font-sans text-xs uppercase tracking-[0.3em] text-secondary transition-colors hover:border-border hover:text-foreground',
                  isCollapsed && 'justify-center px-0',
                  isActive && 'border-primary text-foreground'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="flex items-center justify-center rounded-full border border-border bg-white/90 p-2 text-foreground backdrop-blur hover:bg-white"
              aria-label="Open menu"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <Menu className="w-5 h-5" aria-hidden="true" />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-border bg-white p-0">
            <div className="border-b border-border px-6 py-5">
              <p className="font-sans text-sm uppercase tracking-[0.3em] text-secondary">Menu</p>
            </div>
            <nav className="divide-y divide-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-6 py-4 text-sm text-secondary transition-colors hover:text-foreground',
                      isActive && 'text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-sans text-xs uppercase tracking-[0.3em]">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
