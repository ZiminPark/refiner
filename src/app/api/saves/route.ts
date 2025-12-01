import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const savePayloadSchema = z.object({
  originalText: z.string().trim().min(1, 'Original text is required'),
  refinedText: z.string().trim().min(1, 'Refined text is required'),
  explanation: z.string().optional().nullable(),
  sourcePrompt: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
});

const savedPairSelect =
  'id, user_id, original_text, refined_text, explanation, source_prompt, model, saved_at, updated_at';

type SavedPairRow = {
  id: string;
  user_id: string;
  original_text: string;
  refined_text: string;
  explanation: string | null;
  source_prompt: string | null;
  model: string | null;
  saved_at: string;
  updated_at: string;
};

function mapRowToResponse(row: SavedPairRow) {
  return {
    id: row.id,
    originalText: row.original_text,
    refinedText: row.refined_text,
    explanation: row.explanation,
    sourcePrompt: row.source_prompt,
    model: row.model,
    savedAt: row.saved_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('saved_pairs')
    .select(savedPairSelect)
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[saves] fetch failed', error);
    return NextResponse.json(
      { error: 'Failed to load saved pairs', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ savedPairs: (data ?? []).map(mapRowToResponse) });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let parsedPayload: z.infer<typeof savePayloadSchema>;

  try {
    const payload = await request.json();
    parsedPayload = savePayloadSchema.parse(payload);
  } catch (parseError) {
    const message =
      parseError instanceof Error ? parseError.message : 'Invalid request payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('saved_pairs')
    .insert({
      user_id: user.id,
      original_text: parsedPayload.originalText,
      refined_text: parsedPayload.refinedText,
      explanation: parsedPayload.explanation,
      source_prompt: parsedPayload.sourcePrompt,
      model: parsedPayload.model,
    })
    .select(savedPairSelect)
    .single();

  if (error || !data) {
    console.error('[saves] insert failed', error);
    return NextResponse.json(
      { error: 'Failed to save pair', details: error?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ savedPair: mapRowToResponse(data) });
}
