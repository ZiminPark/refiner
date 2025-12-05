import type { FeatureRequestInput, FeatureRequestResponse } from './types';

export async function submitFeatureRequest(
  input: FeatureRequestInput
): Promise<FeatureRequestResponse> {
  const response = await fetch('/api/feature-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Failed to submit feature request',
    }));

    throw new Error(error.error || error.details || 'Failed to submit feature request');
  }

  return response.json();
}
