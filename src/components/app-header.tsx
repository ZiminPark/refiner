'use client';

import Link from 'next/link';

const navLinks = [
  { href: '/home', label: 'Refine' },
  { href: '/home/history', label: 'History' },
  { href: '/home/settings', label: 'Settings' },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/home"
          className="font-sans text-sm uppercase tracking-[0.28em] text-foreground/70 transition-colors hover:text-foreground"
        >
          English Refiner
        </Link>
        <nav className="hidden gap-6 text-xs font-sans uppercase tracking-[0.23em] text-foreground/70 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
