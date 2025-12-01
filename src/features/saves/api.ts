import type { SavePairPayload, SavedPair } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type SavedPairResponse = {
  savedPair: SavedPair;
};

type SavedPairsResponse = {
  savedPairs: SavedPair[];
};

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      payload.error || payload.message || 'Request failed',
      response.status,
      payload.details || payload.error
    );
  }

  return payload as T;
}

export async function savePair(payload: SavePairPayload): Promise<SavedPair> {
  const response = await fetch('/api/saves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<SavedPairResponse>(response);
  return data.savedPair;
}

export async function fetchSavedPairs(): Promise<SavedPair[]> {
  const response = await fetch('/api/saves');
  const data = await handleResponse<SavedPairsResponse>(response);
  return data.savedPairs;
}

export async function deleteSavedPair(id: string): Promise<void> {
  const response = await fetch(`/api/saves/${id}`, {
    method: 'DELETE',
  });

  await handleResponse<{ success: true }>(response);
}
