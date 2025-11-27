'use client';

import Link from 'next/link';

const navLinks = [
  { href: '/home', label: 'Refine' },
  { href: '/home/history', label: 'History' },
  { href: '/home/settings', label: 'Settings' },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/home"
          className="font-sans text-sm uppercase tracking-[0.3em] text-secondary hover:text-foreground"
        >
          English Refiner
        </Link>
        <nav className="hidden gap-6 text-xs font-sans uppercase tracking-[0.25em] text-secondary md:flex">
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
