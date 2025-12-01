import { useQuery } from '@tanstack/react-query';
import { fetchSavedPairs } from '../api';
import type { SavedPair } from '../types';

export function useSavedPairs() {
  return useQuery<SavedPair[]>({
    queryKey: ['savedPairs'],
    queryFn: fetchSavedPairs,
    staleTime: 30_000,
  });
}
