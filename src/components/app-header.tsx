'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="flex h-16 items-center px-6">
        <Link href="/home" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-gray-900">English Refiner</h1>
        </Link>
      </div>
    </header>
  );
}
