'use client';

import { AppHeader } from '@/components/app-header';
import { FeatureRequestSection } from '@/features/feature-request/components/FeatureRequestSection';
import { InputForm } from '@/features/sentence/components/InputForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader showSessionControls={false} />
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        <div className="space-y-3">
          <h1 className="text-[2.5rem] font-light leading-tight text-foreground">
            Refine your English
          </h1>
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-2xl text-sm text-secondary leading-relaxed">
              Calibrated for clarity with a tactile, paper-like backdrop. Paste, refine, and send us
              the next thing you want to see in this lab.
            </p>
            <FeatureRequestSection />
          </div>
        </div>

        <InputForm />
      </div>
    </div>
  );
}
