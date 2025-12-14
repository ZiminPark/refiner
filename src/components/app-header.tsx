'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FeatureRequestPanel } from "@/features/feature-request/components/FeatureRequestPanel";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Refine" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

interface AppHeaderProps {
  showSessionControls?: boolean;
}

export function AppHeader({ showSessionControls = true }: AppHeaderProps) {
  const [hasSession, setHasSession] = useState(false);
  const [isFeatureRequestOpen, setIsFeatureRequestOpen] = useState(false);

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
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-sans text-sm uppercase tracking-[0.28em] text-foreground/70 transition-colors hover:text-foreground"
        >
          English Refiner
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 font-sans text-xs uppercase tracking-[0.23em] text-foreground/70 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <Dialog open={isFeatureRequestOpen} onOpenChange={setIsFeatureRequestOpen}>
              <DialogTrigger asChild>
                <button className="font-sans text-xs uppercase tracking-[0.23em] text-foreground/70 transition-colors hover:text-foreground">
                  Requests
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sr-only">
                  <DialogTitle>Shape the refinement lab</DialogTitle>
                </DialogHeader>
                <FeatureRequestPanel inModal onSuccess={() => setIsFeatureRequestOpen(false)} />
              </DialogContent>
            </Dialog>
          </nav>
          {showSessionControls && !hasSession && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-sans text-[0.7rem] uppercase tracking-[0.23em] text-foreground/70 hover:text-foreground"
            >
              <Link href="/login">Log in</Link>
            </Button>
          )}
          {!showSessionControls && !hasSession && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-sans text-[0.7rem] uppercase tracking-[0.23em] text-foreground/70 hover:text-foreground md:hidden"
            >
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
