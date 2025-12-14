'use client';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ArrowRight, Copy, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type HistoryItem = {
  id: string;
  input_text: string;
  output_text: string;
  explanation: string | null;
  created_at: string;
};

const demoHistory: HistoryItem[] = [
  {
    id: 'demo-1',
    input_text: "i'm gonna finish this proposal tmrw",
    output_text: "I'm going to finish this proposal tomorrow.",
    explanation: 'Spelled out “tomorrow,” removed slang, and corrected capitalization.',
    created_at: new Date().toISOString(),
  },
];

export default function HistoryPage() {
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const isMountedRef = useRef(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!isMountedRef.current) {
        return;
      }

      if (userError) {
        if (userError.name === 'AuthSessionMissingError') {
          // Expected when signed out; treat as anonymous and do not surface an error.
          setUserId(null);
          setHistory([]);
          setIsLoading(false);
          return;
        }
        console.error('[history] failed to read user session', userError);
        setError('Unable to read your session. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!user) {
        setUserId(null);
        setHistory([]);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('refinement_history')
        .select('id, input_text, output_text, explanation, created_at')
        .order('created_at', { ascending: false });

      if (!isMountedRef.current) {
        return;
      }

      if (error) {
        console.error('[history] failed to load rows', error);
        setError('Unable to load your history right now.');
        setHistory([]);
      } else {
        setHistory(data ?? []);
      }
    } catch (loadError) {
      console.error('[history] unexpected load error', loadError);
      if (isMountedRef.current) {
        setError('Unable to load your history right now.');
        setHistory([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [supabase]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchHistory();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchHistory();
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchHistory, supabase]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (copyError) {
      console.error('[history] failed to copy', copyError);
      toast({
        description: 'Unable to copy to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyPair = async (item: HistoryItem) => {
    const snippet = [
      'Original:',
      item.input_text,
      '',
      'Refined:',
      item.output_text,
      item.explanation ? `\nExplanation:\n${item.explanation}` : '',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(snippet);
      toast({
        description: 'Copied both original and refined text.',
      });
    } catch (copyError) {
      console.error('[history] failed to copy snippet', copyError);
      toast({
        description: 'Unable to copy the snippet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) {
      toast({
        description: 'Log in to manage your history.',
        variant: 'destructive',
      });
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from('refinement_history').delete().eq('id', id);

      if (error) {
        throw error;
      }

      setHistory((current) => current.filter((item) => item.id !== id));
    } catch (deleteError) {
      console.error('[history] delete failed', deleteError);
      toast({
        description: 'Could not delete this entry. Please retry.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!userId) {
      toast({
        description: 'Log in to manage your history.',
        variant: 'destructive',
      });
      return;
    }

    const shouldClear = window.confirm('Clear all saved refinements? This cannot be undone.');
    if (!shouldClear) {
      return;
    }

    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('refinement_history')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setHistory([]);
    } catch (clearError) {
      console.error('[history] clear failed', clearError);
      toast({
        description: 'Unable to clear history right now.',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <Card className="border border-border bg-card/85">
          <CardContent className="flex items-center gap-3 py-10 text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading your history…</span>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="border border-destructive/50 bg-destructive/10">
          <CardContent className="space-y-3 py-6">
            <p className="text-base font-semibold text-destructive">Couldn&apos;t load history</p>
            <p className="text-sm text-destructive/80">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchHistory}
              className="border-destructive/60 text-destructive hover:border-destructive hover:text-destructive"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!userId) {
      return (
        <Card className="border border-border bg-card/85">
          <CardContent className="space-y-6 py-8">
            <div className="space-y-2 text-left">
              <p className="text-lg font-semibold leading-relaxed text-foreground">History is personal</p>
              <p className="text-sm leading-relaxed text-secondary">
                Sign in to keep a private log of everything you refine. Otherwise, try a demo entry below.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                asChild
                className="w-full sm:w-auto px-6 font-sans text-xs uppercase tracking-[0.28em]"
              >
                <Link href="/login">
                  Log in
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-border font-sans text-[0.75rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground"
              >
                <Link href="/">
                  Try refining first
                </Link>
              </Button>
            </div>
            <div className="rounded-md border border-dashed border-border/80 bg-card/70 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                Demo preview (read-only)
              </p>
              {demoHistory.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                      Original
                    </p>
                    <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                      {item.input_text}
                    </p>
                  </div>
                  <div className="border-t border-border pt-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      Refined
                    </p>
                    <p className="text-base font-medium leading-relaxed text-foreground whitespace-pre-wrap">
                      {item.output_text}
                    </p>
                  </div>
                  {item.explanation ? (
                    <div className="border-t border-border pt-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                        Explanation
                      </p>
                      <p className="text-sm leading-relaxed text-secondary whitespace-pre-wrap">
                        {item.explanation}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (history.length === 0) {
      return (
        <Card className="border border-border bg-card/85">
          <CardContent className="space-y-3 py-16 text-center">
            <p className="text-lg leading-relaxed text-foreground">
              No conversion history yet
            </p>
            <p className="text-sm leading-relaxed text-secondary">
              Start refining your sentences to build your archive.
            </p>
            <Button asChild className="px-8 font-sans text-xs uppercase tracking-[0.28em]">
              <Link href="/">
                Start refining
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {history.map((item) => (
          <Card
            key={item.id}
            className="border border-border bg-card transition-colors hover:border-foreground"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-sm font-normal leading-relaxed text-secondary">
                    {formatDate(item.created_at)}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(item.output_text, item.id)}
                    className={cn(
                      'gap-2 border border-transparent font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:border-border hover:text-foreground',
                    )}
                  >
                    <Copy className="w-4 h-4" />
                    {copied === item.id ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyPair(item)}
                    className="gap-2 border border-transparent font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:border-border hover:text-foreground"
                  >
                    <Copy className="w-4 h-4" />
                    Copy pair
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="gap-2 border border-transparent font-sans text-[0.7rem] uppercase tracking-[0.28em] text-accent-error hover:border-accent-error/60 disabled:opacity-60"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                  Original
                </p>
                <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {item.input_text}
                </p>
              </div>
              <div className="border-t border-border pt-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Refined
                </p>
                <p className="text-base font-medium leading-relaxed text-foreground whitespace-pre-wrap">
                  {item.output_text}
                </p>
              </div>
              {item.explanation ? (
                <div className="border-t border-border pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                    Explanation
                  </p>
                  <p className="text-sm leading-relaxed text-secondary whitespace-pre-wrap">
                    {item.explanation}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-secondary">
              Archive
            </p>
            <h1 className="text-[2.5rem] font-light leading-tight text-foreground">
              Conversion history
            </h1>
            <p className="text-base leading-relaxed text-secondary">
              A clean log of what went in, what came out, and when it happened.
            </p>
          </div>
          {userId && (
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                  Saved only
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                  Saved: {history.length}
                </span>
              </div>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>

        {renderBody()}
      </div>
    </div>
  );
}
