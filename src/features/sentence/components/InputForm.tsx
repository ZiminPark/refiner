'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePromptSetting } from '@/hooks/usePromptSetting';
import { Check, ClipboardPaste, Copy, Loader2, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useConvertSentence } from '../hooks/useConvertSentence';
import { RefinedChangeHighlights } from './RefinedChangeHighlights';
import { RefinedOutputTabs } from './RefinedOutputTabs';
import { ChangeDetailsPanel } from './ChangeDetailsPanel';
import { ExplanationSection } from './ExplanationSection';
import { computeChangeHighlights } from '../lib/diff';
import type { ChangeHighlightsResult, ConversionResult } from '../types';

const shortcutKeyClassName =
  'inline-flex items-center rounded-[3px] border border-border bg-background/70 px-2 py-0.5 font-mono text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground';

export function InputForm() {
  const [inputText, setInputText] = useState('');
  const [converted, setConverted] = useState<ConversionResult | null>(null);
  const [refinedText, setRefinedText] = useState('');
  const [changeHighlights, setChangeHighlights] = useState<ChangeHighlightsResult | null>(null);
  const [viewMode, setViewMode] = useState<'changes' | 'refined'>('refined');
  const [activeChangeId, setActiveChangeId] = useState<string | null>(null);
  const [isChangePanelOpen, setIsChangePanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clipboardPrefilled, setClipboardPrefilled] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [isMacUser, setIsMacUser] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const supabase = useRef(createClient());
  const [userId, setUserId] = useState<string | null>(null);
  const [saveAction, setSaveAction] = useState<'saving' | 'removing' | null>(null);
  const [savedHistoryId, setSavedHistoryId] = useState<string | null>(null);
  const { convertSentence, cancelConversion, isLoading, error } = useConvertSentence();
  const { prompt } = usePromptSetting();
  const { toast } = useToast();

  // Prefill the textarea with clipboard contents so users can convert immediately after landing.
  useEffect(() => {
    if (clipboardPrefilled || inputText) return;

    let isCancelled = false;

    const pasteClipboard = async () => {
      if (!navigator?.clipboard?.readText) {
        setClipboardPrefilled(true);
        return;
      }

      try {
        const text = await navigator.clipboard.readText();
        if (!isCancelled && text) {
          setInputText(text);
        }
      } catch (clipError) {
        if (!(clipError instanceof DOMException && clipError.name === 'NotAllowedError')) {
          console.warn('Auto-paste failed:', clipError);
        }
      } finally {
        if (!isCancelled) {
          setClipboardPrefilled(true);
        }
      }
    };

    pasteClipboard();

    return () => {
      isCancelled = true;
    };
  }, [clipboardPrefilled, inputText]);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? 
      navigator.platform ?? 
      navigator.userAgent ?? 
      '';

    if (!platform) {
      setIsMacUser(null);
      return;
    }

    setIsMacUser(/mac|darwin|iphone|ipad/i.test(platform));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const client = supabase.current;

    client.auth.getUser().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        if (error.name !== 'AuthSessionMissingError') {
          console.warn('[refine] auth getUser error', error);
        }
        setUserId(null);
        return;
      }
      setUserId(data.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUserId(session?.user?.id ?? null);
      setSavedHistoryId(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleConvert = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      const result = await convertSentence({
        text: inputText,
        prompt,
      });
      const refined = result.converted;
      const highlights = computeChangeHighlights(inputText, refined);

      setConverted({
        original: inputText,
        refined,
        explanation: result.explanation,
      });
      setRefinedText(refined);
      setChangeHighlights(highlights);
      setViewMode(highlights.changes.length > 0 ? 'changes' : 'refined');
      setActiveChangeId(highlights.changes[0]?.id ?? null);
      setIsChangePanelOpen(false);
      setSavedHistoryId(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      console.error('Conversion error:', err);
    }
  }, [convertSentence, inputText, isLoading, prompt]);

  const handleCancel = useCallback(() => {
    cancelConversion();
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
    }
  }, [cancelConversion]);

  const clearInput = useCallback(() => {
    setInputText('');
    setConverted(null);
    setRefinedText('');
    setChangeHighlights(null);
    setActiveChangeId(null);
    setIsChangePanelOpen(false);
    setViewMode('refined');
    setSavedHistoryId(null);
    setSaveAction(null);
    setCopied(false);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
    }
  }, []);

  const pasteClipboardIfAvailable = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) {
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch (clipError) {
      if (!(clipError instanceof DOMException && clipError.name === 'NotAllowedError')) {
        console.warn('[refine] clipboard read after clear failed', clipError);
      }
    }
  }, []);

  const pasteFromClipboard = useCallback(async () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
    }

    if (typeof navigator === 'undefined') {
      return;
    }

    if (!navigator.clipboard?.readText) {
      toast({
        description:
          'This browser does not allow clipboard paste via button. Use your device paste controls instead.',
      });
      return;
    }

    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();

      if (!text) {
        toast({ description: 'Your clipboard is empty.' });
        return;
      }

      setInputText(text);
      toast({ description: 'Pasted from clipboard.' });
    } catch (clipError) {
      if (clipError instanceof DOMException && clipError.name === 'NotAllowedError') {
        toast({
          description:
            'Clipboard access was blocked. Tap and hold in the input, then choose Paste.',
        });
        return;
      }

      console.error('[refine] paste failed', clipError);
      toast({
        description: 'Unable to paste from clipboard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPasting(false);
    }
  }, [toast]);

  const hasInput = Boolean(inputText.trim());
  const canConvert = hasInput;
  const shortcutLabel =
    isMacUser === null ? '⌘ + ↵' : isMacUser ? '⌘ + ↵' : '⌃ + ↵';
  const ariaShortcut =
    isMacUser === null ? 'Meta+Enter Control+Enter' : isMacUser ? 'Meta+Enter' : 'Control+Enter';

  useEffect(() => {
    if (!converted) {
      setChangeHighlights(null);
      setActiveChangeId(null);
      setIsChangePanelOpen(false);
      return;
    }

    const updatedHighlights = computeChangeHighlights(converted.original, refinedText);
    setChangeHighlights(updatedHighlights);

    if (viewMode === 'changes' && updatedHighlights.changes.length === 0) {
      setViewMode('refined');
      setIsChangePanelOpen(false);
    }

    if (
      viewMode === 'changes' &&
      activeChangeId &&
      !updatedHighlights.changes.some((change) => change.id === activeChangeId)
    ) {
      setActiveChangeId(updatedHighlights.changes[0]?.id ?? null);
    }
  }, [converted, refinedText, viewMode, activeChangeId]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== 'Enter' ||
        (!event.metaKey && !event.ctrlKey) ||
        !canConvert
      ) {
        return;
      }

      event.preventDefault();
      handleConvert();
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [handleConvert, canConvert]);

  useEffect(() => {
    const handleClearShortcut = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== 'Escape' ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      event.preventDefault();
      clearInput();
      void pasteClipboardIfAvailable();
    };

    window.addEventListener('keydown', handleClearShortcut);
    return () => window.removeEventListener('keydown', handleClearShortcut);
  }, [clearInput, pasteClipboardIfAvailable]);

  useEffect(() => {
    const handleFocusShortcut = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== '/' ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target;
      if (
        target &&
        target instanceof HTMLElement &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox')
      ) {
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      event.preventDefault();
      textarea.focus();
    };

    window.addEventListener('keydown', handleFocusShortcut);
    return () => window.removeEventListener('keydown', handleFocusShortcut);
  }, []);

  const copyRefinedToClipboard = useCallback(async () => {
    if (!refinedText || typeof navigator === 'undefined') {
      return false;
    }

    try {
      await navigator.clipboard.writeText(refinedText);
      setCopied(true);
      toast({
        description: 'Copied. Paste to use it.',
        duration: 10000,
        className:
          'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-none font-semibold tracking-tight sm:max-w-[360px]',
      });
      return true;
    } catch (clipError) {
      console.error('Clipboard copy failed:', clipError);
      return false;
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [refinedText, toast]);

  const handleCopy = () => {
    copyRefinedToClipboard();
  };

  const handleViewModeChange = (mode: 'changes' | 'refined') => {
    if (mode === 'changes' && !(changeHighlights?.changes.length)) {
      return;
    }
    if (mode === 'changes' && changeHighlights?.changes.length && !activeChangeId) {
      setActiveChangeId(changeHighlights.changes[0].id);
    }
    setViewMode(mode);
    if (mode === 'refined') {
      setIsChangePanelOpen(false);
    }
  };

  const openChangePanelFor = (changeId: string | null) => {
    if (!changeId) {
      return;
    }
    setActiveChangeId(changeId);
    setViewMode('changes');
    setIsChangePanelOpen(true);
  };

  const handleChangeCountClick = () => {
    if (!changeHighlights?.changes.length) {
      return;
    }
    openChangePanelFor(changeHighlights.changes[0]?.id ?? null);
  };

  const handleHighlightSelect = (changeId: string) => {
    openChangePanelFor(changeId);
  };

  const handlePanelOpenChange = (open: boolean) => {
    setIsChangePanelOpen(open);
  };

  const handleActiveChangeIdChange = (changeId: string) => {
    setActiveChangeId(changeId);
  };

  const handleSave = async () => {
    if (!converted || !converted.original.trim()) {
      return;
    }

    const client = supabase.current;

    if (!userId) {
      toast({
        description: 'Log in to save this pair for later.',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
      return;
    }

    try {
      if (saveAction) {
        return;
      }

      if (savedHistoryId) {
        setSaveAction('removing');
        const previousId = savedHistoryId;
        setSavedHistoryId(null);

        const { error } = await client
          .from('refinement_history')
          .delete()
          .eq('id', previousId);

        if (error) {
          throw error;
        }

        toast({ description: 'Removed from saved.' });
        return;
      }

      setSaveAction('saving');
      setSavedHistoryId('pending');

      const { data, error } = await client
        .from('refinement_history')
        .insert({
          user_id: userId,
          input_text: converted.original,
          output_text: converted.refined,
          explanation: converted.explanation || null,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      if (data?.id) {
        setSavedHistoryId(data.id);
        toast({
          description: 'Saved to your board. View it in History.',
        });
      }
    } catch (saveError) {
      console.error('[refine] save failed', saveError);
      setSavedHistoryId((current) => {
        if (saveAction === 'removing') {
          return current ?? null;
        }
        if (saveAction === 'saving' && current === 'pending') {
          return null;
        }
        return current;
      });
      toast({
        description: 'Unable to save right now. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaveAction(null);
    }
  };

  useEffect(() => {
    if (!converted) {
      return;
    }

    copyRefinedToClipboard();
  }, [converted, copyRefinedToClipboard]);

  const handleFeedback = (isPositive: boolean) => {
    alert(`Feedback ${isPositive ? 'positive' : 'negative'} recorded (UI only)`);
  };

  const changeCount = changeHighlights?.changes.length ?? 0;
  const showChangesTab = changeCount > 0;

  return (
    <div className="space-y-6 text-foreground">
      {/* Input Form */}
      <Card className="border border-border bg-card/90">
        <CardContent className="space-y-5 pt-6">
          <Textarea
            placeholder="Type or paste your sentence here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[180px]"
            disabled={isLoading}
            ref={textareaRef}
          />
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden w-full sm:flex sm:w-auto">
              <Button
                type="button"
                variant={isLoading ? 'outline' : 'default'}
                onClick={isLoading ? handleCancel : handleConvert}
                disabled={!isLoading && !canConvert}
                className={cn(
                  'w-full sm:w-auto justify-center gap-3 px-8 font-sans text-sm uppercase tracking-[0.25em]',
                  isLoading &&
                    'border-border bg-background/70 shadow-none text-muted-foreground hover:bg-background/80'
                )}
                aria-keyshortcuts={!isLoading ? ariaShortcut : undefined}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cancel
                  </>
                ) : (
                  <>
                    <span>Refine</span>
                    <span className="hidden items-center text-xs font-normal tracking-[0.2em] sm:inline-flex">
                      <span className={shortcutKeyClassName}>{shortcutLabel}</span>
                    </span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex w-full gap-3 sm:hidden">
              <Button
                type="button"
                variant="outline"
                onClick={pasteFromClipboard}
                disabled={isLoading || isPasting}
                aria-label="Paste from clipboard"
                className="flex-1 justify-center border-border"
              >
                {isPasting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="sr-only">Pasting from clipboard</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="h-5 w-5" />
                    <span className="sr-only">Paste from clipboard</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant={isLoading ? 'ghost' : 'default'}
                onClick={isLoading ? handleCancel : handleConvert}
                disabled={!isLoading && !canConvert}
                aria-label={isLoading ? 'Cancel conversion' : 'Refine sentence'}
                aria-keyshortcuts={!isLoading ? ariaShortcut : undefined}
                className={cn(
                  'flex-1 justify-center px-6',
                  isLoading &&
                    'border-border bg-background/40 text-muted-foreground hover:bg-background/50'
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="sr-only">Cancel conversion</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden className="text-[1.4rem] leading-none">
                      🖋️
                    </span>
                    <span className="sr-only">Refine sentence</span>
                  </>
                )}
              </Button>
            </div>
            <div className="hidden gap-2 text-xs sm:flex sm:flex-row sm:items-center">
              <ShortcutHint label="/" description="Jump to input" />
              <ShortcutHint label="Esc" description="Clear input" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Result */}
      {converted && (
        <div className="space-y-4">
          <Card className="border border-primary/25 bg-card">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold uppercase tracking-[0.2em] text-primary">
                  Refined Version
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={savedHistoryId ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleSave}
                    disabled={Boolean(saveAction)}
                    className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.3em]"
                  >
                    {saveAction === 'saving' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saveAction === 'removing' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Star
                        className={cn(
                          'w-4 h-4',
                          savedHistoryId ? 'fill-current' : 'text-foreground/70'
                        )}
                      />
                    )}
                    {saveAction === 'saving'
                      ? 'Saving…'
                      : saveAction === 'removing'
                        ? 'Removing…'
                        : savedHistoryId
                          ? 'Saved'
                          : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.3em]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RefinedOutputTabs
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                changeCount={changeCount}
                showChangesTab={showChangesTab}
                onChangeCountClick={handleChangeCountClick}
              />

              {viewMode === 'changes' && changeHighlights ? (
                <RefinedChangeHighlights
                  segments={changeHighlights.segments}
                  changes={changeHighlights.changes}
                  activeChangeId={activeChangeId}
                  onHighlightSelect={handleHighlightSelect}
                />
              ) : (
                <Textarea
                  value={refinedText}
                  onChange={(e) => setRefinedText(e.target.value)}
                  className="min-h-[120px] resize-none text-base font-medium leading-relaxed text-foreground"
                  placeholder="Refined sentence will appear here..."
                />
              )}
              
              {converted.explanation && (
                <div className="pt-2">
                  <ExplanationSection text={converted.explanation} />
                </div>
              )}
            </CardContent>
          </Card>
          <ChangeDetailsPanel
            open={isChangePanelOpen}
            changes={changeHighlights?.changes ?? []}
            activeChangeId={activeChangeId}
            onOpenChange={handlePanelOpenChange}
            onActiveChangeId={handleActiveChangeIdChange}
          />
        </div>
      )}


    </div>
  );
}

type ShortcutHintProps = {
  label: string;
  description: string;
};

function ShortcutHint({ label, description }: ShortcutHintProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={shortcutKeyClassName}>{label}</span>
      <span className="text-muted-foreground">{description}</span>
    </div>
  );
}
