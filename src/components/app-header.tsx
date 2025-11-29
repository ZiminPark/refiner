'use client';

import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

const navLinks = [
  { href: "/home", label: "Refine" },
  { href: "/home/history", label: "History" },
  { href: "/home/settings", label: "Settings" },
];

interface AppHeaderProps {
  showSessionControls?: boolean;
}

export function AppHeader({ showSessionControls = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/home"
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
          </nav>
          {showSessionControls ? <SignOutButton /> : null}
        </div>
      </div>
    </header>
  );
}
