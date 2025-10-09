import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schema for structured output
const RefinementResponse = z.object({
  refined_sentence: z.string().describe('The refined, natural American English sentence'),
  explanation: z.string().describe('Brief explanation of the key changes made and why they improve the sentence'),
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

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

    const completion = await client.chat.completions.parse({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are an expert English writing assistant specializing in converting non-native English into natural, fluent American English. 

Your task:
- Refine the input sentence into natural American English
- Maintain the original meaning and intent
- Improve grammar, vocabulary, and sentence structure
- Make it sound like a native American English speaker wrote it
- Keep the tone appropriate for the context (professional, casual, etc.)
- Provide a brief explanation of the key changes you made

Respond with both the refined sentence and a clear explanation of improvements.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      reasoning_effort: 'minimal',
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
      return NextResponse.json(
        { error: 'Model refused to process the request', details: message.refusal },
        { status: 400 }
      );
    } else {
      // Fallback in case parsing fails
      const converted = message?.content || text;
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
