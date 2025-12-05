export type FeatureRequestCategory = 'product' | 'quality' | 'integration' | 'other';

export interface FeatureRequestInput {
  title: string;
  details: string;
  contact?: string;
  category?: FeatureRequestCategory;
}

export interface FeatureRequestResponse {
  ok: boolean;
  ts?: string;
}
