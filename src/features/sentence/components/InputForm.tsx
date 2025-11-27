'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Check, Copy, Loader2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePromptSetting } from '@/hooks/usePromptSetting';
import { useToast } from '@/hooks/use-toast';
import { useConvertSentence } from '../hooks/useConvertSentence';
import type { ConversionResult } from '../types';

export function InputForm() {
  const [inputText, setInputText] = useState('');
  const [converted, setConverted] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [clipboardPrefilled, setClipboardPrefilled] = useState(false);
  const [isMacUser, setIsMacUser] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { convertSentence, isLoading, error } = useConvertSentence();
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
        console.warn('Auto-paste failed:', clipError);
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

  const handleConvert = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      const result = await convertSentence({
        text: inputText,
        prompt,
      });
      setConverted({
        original: inputText,
        refined: result.converted,
        explanation: result.explanation,
      });
    } catch (err) {
      console.error('Conversion error:', err);
    }
  }, [convertSentence, inputText, isLoading, prompt]);

  const canConvert = Boolean(inputText.trim()) && !isLoading;
  const shortcutLabel =
    isMacUser === null ? 'Cmd or Ctrl + Enter' : isMacUser ? 'Cmd + Enter' : 'Ctrl + Enter';
  const ariaShortcut =
    isMacUser === null ? 'Meta+Enter Control+Enter' : isMacUser ? 'Meta+Enter' : 'Control+Enter';

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
    if (!converted?.refined || typeof navigator === 'undefined') {
      return false;
    }

    try {
      await navigator.clipboard.writeText(converted.refined);
      setCopied(true);
      toast({
        description: '복사되었습니다.',
        duration: 10000,
        className:
          'bg-emerald-600 text-white border-emerald-500 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.75)] font-semibold tracking-tight sm:max-w-[360px]',
      });
      return true;
    } catch (clipError) {
      console.error('Clipboard copy failed:', clipError);
      return false;
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [converted?.refined, toast]);

  const handleCopy = () => {
    copyRefinedToClipboard();
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

  return (
    <div className="space-y-8 text-foreground">
      {/* Input Form */}
      <Card className="border border-border bg-white/90">
        <CardHeader>
          <CardTitle className="text-[1.5rem] font-light leading-snug text-[#333333]">
            Enter Your Sentence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <Button
            onClick={handleConvert}
            disabled={!canConvert}
            className="w-full sm:w-auto px-8 font-sans text-xs uppercase tracking-[0.35em]"
            aria-keyshortcuts={ariaShortcut}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Refine Sentence
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          <div className="space-y-1 text-sm text-secondary">
            <p>
              Press <span className="font-semibold">{shortcutLabel}</span> to refine instantly.
            </p>
            <p>
              Press <span className="font-semibold">/</span> to jump to the input box.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Result */}
      {converted && (
        <div className="space-y-4">
          <Card className="border border-border bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold uppercase tracking-[0.2em] text-secondary">
                Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-[#444444]">{converted.original}</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/30 bg-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold uppercase tracking-[0.2em] text-primary">
                  Refined Version
                </CardTitle>
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
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-base font-medium leading-relaxed text-[#111111]">
                {converted.refined}
              </p>
              
              {/* Explanation Section */}
              {converted.explanation && (
                <div className="mt-4 pt-4 border-t border-accent-success/20">
                  <h4 className="mb-2 text-sm font-semibold text-secondary">
                    What Changed?
                  </h4>
                  <p className="text-sm leading-relaxed text-secondary">
                    {converted.explanation}
                  </p>
                </div>
              )}
              
              {/* Feedback Section */}
              <div className="pt-4 border-t border-accent-success/20 mt-4">
                <p className="mb-3 text-sm leading-relaxed text-secondary">Was this helpful?</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback(true)}
                    className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.3em] hover:text-foreground"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback(false)}
                    className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.3em] hover:text-foreground"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    No
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


    </div>
  );
}

function ExampleItem({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full border-l-2 border-border px-4 py-3 text-left transition-colors hover:border-primary"
    >
      <p className="text-sm leading-relaxed text-[#444444]">{text}</p>
    </button>
  );
}
