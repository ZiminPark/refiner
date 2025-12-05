'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFeatureRequest } from '../hooks/useFeatureRequest';
import type { FeatureRequestCategory } from '../types';

const categories: Array<{ label: string; value: FeatureRequestCategory }> = [
  { label: 'Product polish', value: 'product' },
  { label: 'Quality & UX', value: 'quality' },
  { label: 'Integrations', value: 'integration' },
  { label: 'Something else', value: 'other' },
];

type FeatureRequestPanelProps = {
  inModal?: boolean;
  onSuccess?: () => void;
};

export function FeatureRequestPanel({ inModal = false, onSuccess }: FeatureRequestPanelProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<FeatureRequestCategory>('product');
  const { sendFeatureRequest, isSubmitting, error } = useFeatureRequest();
  const { toast } = useToast();

  const trimmedContact = useMemo(() => contact.trim(), [contact]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (!trimmedTitle) {
      toast({
        description: 'Title is required.',
        className:
          'bg-amber-50 border border-amber-200 text-amber-900 font-semibold tracking-tight',
      });
      return;
    }

    if (!trimmedDetails) {
      toast({
        description: 'Details are required.',
        className:
          'bg-amber-50 border border-amber-200 text-amber-900 font-semibold tracking-tight',
      });
      return;
    }

    try {
      await sendFeatureRequest({
        title: trimmedTitle,
        details: trimmedDetails,
        category,
        contact: trimmedContact || undefined,
      });

      setTitle('');
      setDetails('');
      setContact('');

      toast({
        title: 'Sent to the roadmap channel',
        description: 'We bookmarked your idea in Slack. Thank you for steering us.',
        className:
          'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-none font-semibold tracking-tight sm:max-w-[360px]',
      });

      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to submit right now.';
      toast({
        description: message,
        className:
          'bg-red-50 border border-red-200 text-red-700 font-semibold tracking-tight sm:max-w-[360px]',
      });
    }
  };

  return (
    <Card className={inModal ? "border-0 bg-transparent shadow-none" : "border border-border/80 bg-card/90 shadow-sm backdrop-blur-sm"}>
      <CardHeader className="pb-4 space-y-3">
        <div className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-secondary">
          <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          <span>Feature Requests</span>
        </div>
        <CardTitle className="text-2xl font-light leading-snug text-foreground">
          Shape the refinement lab
        </CardTitle>
        <p className="text-sm leading-relaxed text-secondary">
          Drop an idea, friction point, or integration wish. We route it straight into Slack so the
          team can pick it up without losing the analog calm of this workspace.
        </p>
        <div className="flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1">Avg response &lt; 1 day</span>
          <span className="rounded-full border border-border px-3 py-1">Be specific, stay brief</span>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.28em] text-secondary">
                Title
              </Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Concise headline (e.g., 'Faster paste-to-refine flow')"
                disabled={isSubmitting}
                className="bg-background/60"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.28em] text-secondary">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(value: FeatureRequestCategory) => setCategory(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.28em] text-secondary">
              Details
            </Label>
            <Textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="What would make this better for you? Add context, a quick scenario, or a link."
              disabled={isSubmitting}
              className="min-h-[140px] bg-background/60"
            />
            <p className="text-xs text-muted-foreground">
              The more concrete the scenario, the faster we can ship it.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.28em] text-secondary">
              Contact (optional)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="you@example.com"
                disabled={isSubmitting}
                className="pl-10 bg-background/60"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              We’ll log this in Slack with your timestamp and follow up if we need details.
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 font-sans text-[0.75rem] uppercase tracking-[0.3em]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send to Slack
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
