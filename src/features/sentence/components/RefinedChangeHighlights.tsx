'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import type { ChangeBlock, RefinedSegment } from '../types';

type RefinedChangeHighlightsProps = {
  segments: RefinedSegment[];
  changes: ChangeBlock[];
  activeChangeId: string | null;
  onHighlightSelect: (changeId: string) => void;
};

export function RefinedChangeHighlights({
  segments,
  changes,
  activeChangeId,
  onHighlightSelect,
}: RefinedChangeHighlightsProps) {
  const changeOrder = useMemo(() => {
    const orderMap = new Map<string, number>();
    changes.forEach((change, index) => orderMap.set(change.id, index));
    return orderMap;
  }, [changes]);

  return (
    <div className="rounded-md border border-dashed border-border/70 bg-muted/40 px-4 py-3 text-base leading-relaxed text-foreground">
      <p className="whitespace-pre-wrap break-words">
        {segments.map((segment, index) => {
          if (segment.type === 'equal') {
            return (
              <span key={`equal-${index}`} className="text-foreground/90">
                {segment.text}
              </span>
            );
          }

          const changeIndex = changeOrder.get(segment.changeId) ?? 0;
          const isActive = segment.changeId === activeChangeId;

          return (
            <button
              key={`changed-${segment.changeId}-${index}`}
              type="button"
              onClick={() => onHighlightSelect(segment.changeId)}
              className={cn(
                'relative inline-flex items-center rounded-sm px-1 py-0.5 align-baseline text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'bg-accent-warning/20 underline decoration-primary/25 decoration-2 underline-offset-[3px]',
                isActive
                  ? 'ring-1 ring-primary/40 bg-accent-warning/30'
                  : 'hover:bg-accent-warning/30 hover:ring-1 hover:ring-primary/25',
              )}
              aria-label={`View change ${changeIndex + 1} of ${changes.length}`}
            >
              <span className="whitespace-pre-wrap text-left">{segment.text}</span>
            </button>
          );
        })}
      </p>
    </div>
  );
}
