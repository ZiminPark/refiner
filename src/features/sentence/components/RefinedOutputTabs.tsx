'use client';

import { cn } from '@/lib/utils';

type RefinedOutputTabsProps = {
  viewMode: 'changes' | 'refined';
  onViewModeChange: (mode: 'changes' | 'refined') => void;
  changeCount: number;
  showChangesTab: boolean;
  onChangeCountClick?: () => void;
};

export function RefinedOutputTabs({
  viewMode,
  onViewModeChange,
  changeCount,
  showChangesTab,
  onChangeCountClick,
}: RefinedOutputTabsProps) {
  const modes: Array<{ key: 'changes' | 'refined'; label: string; visible: boolean }> = [
    { key: 'changes', label: 'Changes', visible: showChangesTab },
    { key: 'refined', label: 'Refined', visible: true },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
        {modes
          .filter((mode) => mode.visible)
          .map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => onViewModeChange(mode.key)}
              className={cn(
                'rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.25em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                viewMode === mode.key
                  ? 'bg-background text-primary shadow-sm ring-1 ring-primary/40'
                  : 'text-muted-foreground hover:bg-background/60',
              )}
              aria-pressed={viewMode === mode.key}
            >
              {mode.label}
            </button>
          ))}
      </div>

      {showChangesTab && (
        <button
          type="button"
          onClick={onChangeCountClick}
          className="text-xs font-semibold text-muted-foreground underline decoration-transparent underline-offset-4 transition hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {changeCount} {changeCount === 1 ? 'change' : 'changes'}
        </button>
      )}
    </div>
  );
}
