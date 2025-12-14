'use client';

import { AppShell } from '@/components/app-shell';
import { TypingAnimation } from '@/components/typing-animation';
import { InputForm } from '@/features/sentence/components/InputForm';

export default function HomePage() {
  return (
    <AppShell>
      <div className="w-full max-w-3xl space-y-10 mx-auto">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-[2.5rem] font-light leading-tight text-foreground">
            <TypingAnimation text="Refine your English" />
          </h1>
        </div>

        <InputForm />
      </div>
    </AppShell>
  );
}
