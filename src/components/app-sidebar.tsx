'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSidebarStore } from '@/hooks/useSidebarStore';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, History, Home, Menu, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/app', label: 'Refine', icon: Home },
  { href: '/app/history', label: 'History', icon: History },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex border-r bg-gray-50 flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full gap-3 transition-all',
                    isCollapsed ? 'justify-center px-0' : 'justify-start',
                    isActive 
                      ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
        
        {/* Toggle Button */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={toggle}
            className={cn(
              'w-full transition-all text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'
            )}
            title={isCollapsed ? 'Expand sidebar' : undefined}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse sidebar</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3',
                        isActive 
                          ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
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
