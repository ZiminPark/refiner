import { DEFAULT_REFINER_PROMPT } from '@/lib/prompt';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const TEMPERATURE_DEFAULT = 0.7;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schema for structured output
const RefinementResponse = z.object({
  refined_sentence: z.string().describe('The refined, natural American English sentence'),
  explanation: z.string().describe('Brief explanation of the key changes made and why they improve the sentence'),
});

export async function POST(request: NextRequest,) {
  try {
    const { text, prompt, temperature } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = typeof prompt === 'string' && prompt.trim().length > 0 ? prompt : DEFAULT_REFINER_PROMPT;

    const completion = await client.chat.completions.parse({
      model: "gpt-5.1-chat-latest",
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: temperature ?? TEMPERATURE_DEFAULT,
      response_format: zodResponseFormat(RefinementResponse, 'refinement_response'),
    });

    const message = completion.choices[0]?.message;

    if (message?.parsed) {
      return NextResponse.json({
        converted: message.parsed.refined_sentence,
        explanation: message.parsed.explanation,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
      });
    } else if (message?.refusal) {
      console.warn('[refine] model refusal:', {
        input: text,
        refusal: message.refusal,
      });
      return NextResponse.json(
        { error: 'Model refused to process the request', details: message.refusal },
        { status: 400 }
      );
    } else {
      // Fallback in case parsing fails
      const converted = message?.content || text;
      console.warn('[refine] fallback response path used:', {
        input: text,
        rawMessage: message,
        usage: completion.usage,
      });
      return NextResponse.json({
        converted: converted.trim(),
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
      });
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: 'Failed to refine sentence',
          details: error.message,
        },
        { status: error.status || 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to refine sentence',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
