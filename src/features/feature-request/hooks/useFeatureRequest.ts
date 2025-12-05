'use client';

import { useState } from 'react';
import { submitFeatureRequest } from '../api';
import type { FeatureRequestInput, FeatureRequestResponse } from '../types';

export function useFeatureRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendFeatureRequest = async (
    input: FeatureRequestInput
  ): Promise<FeatureRequestResponse> => {
    setIsSubmitting(true);
    setError(null);

    try {
      return await submitFeatureRequest(input);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sendFeatureRequest,
    isSubmitting,
    error,
  };
}
