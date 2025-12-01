import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!params.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('saved_pairs')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[saves] delete failed', error);
    return NextResponse.json(
      { error: 'Failed to delete saved pair', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
