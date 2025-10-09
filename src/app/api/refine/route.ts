import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
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

Only respond with the refined sentence. Do not add explanations or additional text.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const converted = completion.choices[0]?.message?.content || text;

    return NextResponse.json({
      converted: converted.trim(),
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
    });
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
