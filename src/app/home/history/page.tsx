'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDeleteSavedPair } from '@/features/saves/hooks/useDeleteSavedPair';
import { useSavedPairs } from '@/features/saves/hooks/useSavedPairs';
import { ApiError } from '@/features/saves/api';
import { ArrowRight, Copy, Loader2, LogIn, RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryPage() {
  const { data, isLoading, isError, error, refetch } = useSavedPairs();
  const deleteSavedPair = useDeleteSavedPair();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const savedPairs = useMemo(() => data ?? [], [data]);
  const apiError = error instanceof ApiError ? error : null;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      toast({ description: 'Copied. Paste to use it.' });
    } catch (copyError) {
      console.error('Clipboard copy failed', copyError);
      toast({
        title: 'Could not copy',
        description: 'Try again or copy manually.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteSavedPair.mutateAsync(id);
      toast({ title: 'Removed', description: 'Deleted from saved pairs.' });
    } catch (deleteError) {
      console.error('Delete failed', deleteError);
      toast({
        title: 'Could not delete',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-border" />
          <div className="h-10 w-64 animate-pulse rounded bg-border" />
          <div className="h-4 w-80 animate-pulse rounded bg-border" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border border-border bg-card">
              <CardHeader className="pb-2">
                <div className="h-3 w-24 animate-pulse rounded bg-border" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-border" />
                <div className="h-4 w-full animate-pulse rounded bg-border" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-border" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError && apiError?.status === 401) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Card className="border border-border bg-card/85">
          <CardContent className="space-y-4 py-12 text-center">
            <LogIn className="mx-auto h-8 w-8 text-secondary" />
            <p className="text-lg font-semibold text-foreground">Sign in to view your saves</p>
            <p className="text-sm leading-relaxed text-secondary">
              Access your saved refinements across devices after logging in.
            </p>
            <Button asChild className="px-8 font-sans text-xs uppercase tracking-[0.28em]">
              <Link href="/login">Log in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Card className="border border-border bg-card/85">
          <CardContent className="flex flex-col items-start gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Couldn&apos;t load saved pairs</p>
              <p className="text-sm leading-relaxed text-secondary">Please try again.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.28em]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-secondary">Archive</p>
          <h1 className="text-[2.5rem] font-light leading-tight text-foreground">Saved refinements</h1>
          <p className="text-base leading-relaxed text-secondary">
            Your saved input/output pairs, ordered by most recent first.
          </p>
        </div>
        {savedPairs.length > 0 && (
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        )}
      </div>

      {savedPairs.length === 0 ? (
        <Card className="border border-border bg-card/85">
          <CardContent className="space-y-3 py-16 text-center">
            <p className="text-lg leading-relaxed text-foreground">No saved refinements yet</p>
            <p className="text-sm leading-relaxed text-secondary">
              Save your best refinements to revisit them later.
            </p>
            <Button asChild className="px-8 font-sans text-xs uppercase tracking-[0.28em]">
              <Link href="/home">
                Start refining
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedPairs.map((item) => (
            <Card key={item.id} className="border border-border bg-card transition-colors hover:border-foreground">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-sm font-normal leading-relaxed text-secondary">
                    {formatDate(item.savedAt)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.refinedText, item.id)}
                      className="gap-2 border border-transparent font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:border-border hover:text-foreground"
                    >
                      <Copy className="w-4 h-4" />
                      {copied === item.id ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === item.id || deleteSavedPair.isPending}
                      onClick={() => handleDelete(item.id)}
                      className="gap-2 border border-transparent font-sans text-[0.7rem] uppercase tracking-[0.28em] text-accent-error hover:border-accent-error/60"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Original</p>
                  <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">{item.originalText}</p>
                </div>
                <div className="border-t border-border pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Refined</p>
                  <p className="text-base font-medium leading-relaxed text-foreground whitespace-pre-wrap">
                    {item.refinedText}
                  </p>
                </div>
                {item.explanation && (
                  <div className="border-t border-border pt-2 text-secondary">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em]">What changed</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
