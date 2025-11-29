'use client';

import { AppHeader } from '@/components/app-header';
import { InputForm } from '@/features/sentence/components/InputForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader showSessionControls={false} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-[2.5rem] font-light leading-tight text-foreground">
            Refine your English
          </h1>
        </div>

        <InputForm />
      </div>
    </div>
  );
}
