export type SavedPair = {
  id: string;
  originalText: string;
  refinedText: string;
  explanation?: string | null;
  sourcePrompt?: string | null;
  model?: string | null;
  savedAt: string;
  updatedAt: string;
};

export type SavePairPayload = {
  originalText: string;
  refinedText: string;
  explanation?: string | null;
  sourcePrompt?: string | null;
  model?: string | null;
};
