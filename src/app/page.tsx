'use client';

import { AppHeader } from '@/components/app-header';
import { TypingAnimation } from '@/components/typing-animation';
import { InputForm } from '@/features/sentence/components/InputForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-[2.5rem] font-light leading-tight text-foreground">
            <TypingAnimation text="Refine your English" />
          </h1>
        </div>

        <InputForm />
      </div>
    </div>
  );
}
