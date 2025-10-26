'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Check, Copy, Loader2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useConvertSentence } from '../hooks/useConvertSentence';
import type { ConversionResult } from '../types';

export function InputForm() {
  const [inputText, setInputText] = useState('');
  const [converted, setConverted] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [clipboardPrefilled, setClipboardPrefilled] = useState(false);
  const { convertSentence, isLoading, error } = useConvertSentence();

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

  const handleConvert = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      const result = await convertSentence({ text: inputText });
      setConverted({
        original: inputText,
        refined: result.converted,
        explanation: result.explanation,
      });
    } catch (err) {
      console.error('Conversion error:', err);
    }
  }, [convertSentence, inputText, isLoading]);

  const canConvert = Boolean(inputText.trim()) && !isLoading;

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

  const handleCopy = () => {
    if (converted) {
      navigator.clipboard.writeText(converted.refined);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    alert(`Feedback ${isPositive ? 'positive' : 'negative'} recorded (UI only)`);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-relaxed text-slate-800">
            Enter Your Sentence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type or paste your sentence here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] text-base leading-relaxed bg-white border-slate-200 text-slate-900 placeholder:text-gray-400"
            disabled={isLoading}
          />
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleConvert}
            disabled={!canConvert}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground"
            aria-keyshortcuts="Meta+Enter Control+Enter"
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
          <p className="text-sm text-slate-500">
            Press <span className="font-semibold">Cmd + Enter</span> (or <span className="font-semibold">Ctrl + Enter</span> on Windows) to refine instantly.
          </p>
        </CardContent>
      </Card>

      {/* Conversion Result */}
      {converted && (
        <div className="space-y-4">
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-slate-800">Original</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-slate-700">{converted.original}</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 border-accent-success">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-accent-success">
                  Refined Version
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2 border-accent-success/30 hover:bg-accent-success/10"
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
              <p className="text-base leading-relaxed text-slate-900 font-medium mb-4">
                {converted.refined}
              </p>
              
              {/* Explanation Section */}
              {converted.explanation && (
                <div className="mt-4 pt-4 border-t border-accent-success/20">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    What Changed?
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {converted.explanation}
                  </p>
                </div>
              )}
              
              {/* Feedback Section */}
              <div className="pt-4 border-t border-accent-success/20 mt-4">
                <p className="text-sm leading-relaxed text-slate-600 mb-3">Was this helpful?</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback(true)}
                    className="gap-2 hover:bg-accent-success/10"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback(false)}
                    className="gap-2 hover:bg-red-50"
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

      {/* Example Sentences */}
      {!converted && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800">Example Sentences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ExampleItem
              text="I'm gonna finish this project tomorrow"
              onClick={() => setInputText("I'm gonna finish this project tomorrow")}
            />
            <ExampleItem
              text="He don't know how to solve this problem"
              onClick={() => setInputText("He don't know how to solve this problem")}
            />
            <ExampleItem
              text="We was planning to meet at 3pm"
              onClick={() => setInputText("We was planning to meet at 3pm")}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ExampleItem({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <p className="text-sm leading-relaxed text-slate-700">{text}</p>
    </button>
  );
}
