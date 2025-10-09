'use client';

import { useState } from 'react';
import { convertSentence as convertSentenceAPI } from '../api';
import type { ConvertResponse, ConvertSentenceInput } from '../types';

export function useConvertSentence() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertSentence = async (input: ConvertSentenceInput): Promise<ConvertResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await convertSentenceAPI(input);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert sentence';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    convertSentence,
    isLoading,
    error,
  };
}
