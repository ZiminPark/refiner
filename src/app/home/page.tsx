'use client';

import { InputForm } from '@/features/sentence/components/InputForm';

export default function AppPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 space-y-3">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          Workspace
        </p>
        <h1 className="text-[2.5rem] font-light leading-tight text-[#333333]">
          Refine your English
        </h1>
        <p className="text-base leading-relaxed text-secondary">
          Paste a sentence below and receive a calmer, evidence-backed suggestion in seconds.
        </p>
      </div>

      <InputForm />
    </div>
  );
}
