'use client';

import { useCallback, useMemo } from 'react';

import { DEFAULT_REFINER_PROMPT } from '@/lib/prompt';

import { useLocalStorage } from './useLocalStorage';

const PROMPT_STORAGE_KEY = 'refiner.customPrompt';

export function usePromptSetting() {
  const [storedPrompt, setStoredPrompt] = useLocalStorage<string>(PROMPT_STORAGE_KEY, DEFAULT_REFINER_PROMPT);

  const prompt = useMemo(() => {
    const trimmed = storedPrompt.trim();
    return trimmed.length > 0 ? trimmed : DEFAULT_REFINER_PROMPT;
  }, [storedPrompt]);

  const setPrompt = useCallback(
    (value: string) => {
      setStoredPrompt(value);
    },
    [setStoredPrompt]
  );

  const resetPrompt = useCallback(() => {
    setStoredPrompt(DEFAULT_REFINER_PROMPT);
  }, [setStoredPrompt]);

  return {
    prompt,
    setPrompt,
    resetPrompt,
    defaultPrompt: DEFAULT_REFINER_PROMPT,
  } as const;
}
