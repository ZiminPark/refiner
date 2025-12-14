export interface ConvertResponse {
  converted: string;
  explanation?: string;
}

export interface ConversionResult {
  original: string;
  refined: string;
  explanation?: string;
}

export interface ConvertSentenceInput {
  text: string;
  prompt?: string;
  temperature?: number;
}

export type ChangeKind = 'insert' | 'delete' | 'replace';

export type ChangeBlock = {
  id: string;
  kind: ChangeKind;
  beforeText: string;
  afterText: string;
};

export type RefinedSegment =
  | { type: 'equal'; text: string }
  | { type: 'changed'; text: string; changeId: string };

export type ChangeHighlightsResult = {
  segments: RefinedSegment[];
  changes: ChangeBlock[];
};
