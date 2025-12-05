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
