'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ExplanationSectionProps = {
  text: string;
  title?: string;
};

export function ExplanationSection({ text, title = 'What Changed?' }: ExplanationSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        'rounded-md border px-3 py-3 shadow-inner transition-colors',
        isOpen ? 'border-primary/25 bg-accent-warning/10 ring-1 ring-primary/10' : 'border-border/60 bg-muted/20',
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1',
              isOpen
                ? 'bg-primary/10 text-primary ring-primary/15'
                : 'bg-muted/60 text-secondary ring-border/60',
            )}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary">
              {title}
            </p>
            {!isOpen && (
              <p className="text-xs text-muted-foreground">
                Tap to view the assistant&apos;s rationale
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="mt-3 border-t border-primary/15 pt-3">
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap md:text-[1.05rem] md:leading-8">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
