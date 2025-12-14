'use client';

import { useCallback, useRef, useState } from 'react';
import { convertSentence as convertSentenceAPI } from '../api';
import type { ConvertResponse, ConvertSentenceInput } from '../types';

export function useConvertSentence() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const convertSentence = useCallback(
    async (input: ConvertSentenceInput): Promise<ConvertResponse> => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const result = await convertSentenceAPI(input, {
          signal: controller.signal,
        });
        return result;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw err;
        }
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert sentence';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        setIsLoading(false);
      }
    },
    []
  );

  const cancelConversion = useCallback(() => {
    if (!abortControllerRef.current) {
      return;
    }

    abortControllerRef.current.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    convertSentence,
    cancelConversion,
    isLoading,
    error,
  };
}
