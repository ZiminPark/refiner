import type { ConvertResponse, ConvertSentenceInput } from './types';

export async function convertSentence(
  input: ConvertSentenceInput
): Promise<ConvertResponse> {
  const response = await fetch('/api/refine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Failed to convert sentence',
    }));
    throw new Error(error.error || error.details || 'Failed to convert sentence');
  }

  return response.json();
}
