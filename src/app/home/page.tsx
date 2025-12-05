'use client';

import { InputForm } from '@/features/sentence/components/InputForm';

export default function AppPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <header className="space-y-3">
        <h1 className="text-[2.5rem] font-light leading-tight text-foreground">
          Refine your English
        </h1>
        <p className="max-w-2xl text-sm text-secondary leading-relaxed">
          Write, polish, and log your requests without leaving this calm workspace. We keep the
          navigation steady and the background analog so you can focus on the words.
        </p>
      </header>

      <InputForm />
    </div>
  );
}
