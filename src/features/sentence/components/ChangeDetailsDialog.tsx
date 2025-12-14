'use client';

import { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ChangeBlock } from '../types';

type ChangeDetailsDialogProps = {
  open: boolean;
  changes: ChangeBlock[];
  activeChangeId: string | null;
  onOpenChange: (open: boolean) => void;
  onActiveChangeId: (changeId: string) => void;
};

export function ChangeDetailsDialog({
  open,
  changes,
  activeChangeId,
  onOpenChange,
  onActiveChangeId,
}: ChangeDetailsDialogProps) {
  const activeIndex = changes.findIndex((change) => change.id === activeChangeId);
  const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const activeChange = changes[effectiveIndex];
  const totalChanges = changes.length;

  const goToIndex = (nextIndex: number) => {
    const nextChange = changes[nextIndex];
    if (nextChange) {
      onActiveChangeId(nextChange.id);
    }
  };

  const handlePrev = () => {
    if (effectiveIndex <= 0) return;
    goToIndex(effectiveIndex - 1);
  };

  const handleNext = () => {
    if (effectiveIndex >= totalChanges - 1) return;
    goToIndex(effectiveIndex + 1);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyNav = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [open, handleNext, handlePrev]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Change details dialog">
        <DialogHeader>
          <DialogTitle>
            {totalChanges > 0
              ? `Change ${effectiveIndex + 1} of ${totalChanges}`
              : 'No changes to review'}
          </DialogTitle>
          <DialogDescription>
            Review how the refined text differs from your original input.
          </DialogDescription>
        </DialogHeader>

        {activeChange ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1 text-[0.65rem] font-semibold text-foreground/80">
                {activeChange.kind}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={effectiveIndex <= 0}
                  className="gap-2 border-border"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={effectiveIndex >= totalChanges - 1}
                  className="gap-2 border-border"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Before
                </p>
                <div className="mt-1 rounded-sm bg-background px-3 py-2 text-sm text-foreground shadow-inner ring-1 ring-border/60">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {activeChange.beforeText || '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  After
                </p>
                <div
                  className={cn(
                    'mt-1 rounded-sm bg-background px-3 py-2 text-sm leading-relaxed ring-1 ring-accent-warning/40',
                    activeChange.kind === 'delete' && 'opacity-70 ring-border/60',
                  )}
                >
                  <p className="whitespace-pre-wrap text-foreground">
                    {activeChange.afterText || (activeChange.kind === 'delete' ? 'Removed' : '—')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No changes available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
