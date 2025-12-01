import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePair } from '../api';
import type { SavePairPayload, SavedPair } from '../types';

export function useSavePair() {
  const queryClient = useQueryClient();

  return useMutation<SavedPair, Error, SavePairPayload>({
    mutationFn: savePair,
    onSuccess: (savedPair) => {
      queryClient.setQueryData<SavedPair[]>(['savedPairs'], (existing) => {
        if (!existing) return [savedPair];
        return [savedPair, ...existing];
      });
    },
  });
}
