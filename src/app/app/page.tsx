'use client';

import { InputForm } from '@/features/sentence/components/InputForm';

export default function AppPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold leading-snug text-gray-800 mb-2">
          Refine Your English
        </h1>
        <p className="text-base leading-relaxed text-gray-600">
          Enter your sentence below and get instant, natural American English suggestions.
        </p>
      </div>

      <InputForm />
    </div>
  );
}
