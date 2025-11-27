'use client';

import { InputForm } from '@/features/sentence/components/InputForm';

export default function AppPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-[2.5rem] font-light leading-tight text-[#333333]">
          Refine your English
        </h1>
      </div>

      <InputForm />
    </div>
  );
}
