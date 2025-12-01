import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSavedPair } from '../api';
import type { SavedPair } from '../types';

export function useDeleteSavedPair() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSavedPair,
    onSuccess: (_, id) => {
      queryClient.setQueryData<SavedPair[]>(['savedPairs'], (existing) => {
        if (!existing) return existing;
        return existing.filter((pair) => pair.id !== id);
      });
    },
  });
}
