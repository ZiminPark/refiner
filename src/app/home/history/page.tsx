'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Dummy data for UI mockup
const dummyHistory = [
  {
    id: '1',
    original: "I'm gonna finish this project tomorrow",
    refined: "I'm going to finish this project tomorrow (refined)",
    createdAt: '2025-10-07T10:30:00',
  },
  {
    id: '2',
    original: "He don't know how to solve this problem",
    refined: "He doesn't know how to solve this problem (refined)",
    createdAt: '2025-10-07T09:15:00',
  },
  {
    id: '3',
    original: "We was planning to meet at 3pm",
    refined: "We were planning to meet at 3pm (refined)",
    createdAt: '2025-10-06T16:45:00',
  },
  {
    id: '4',
    original: 'Can you helping me with this task?',
    refined: 'Can you help me with this task? (refined)',
    createdAt: '2025-10-06T14:20:00',
  },
  {
    id: '5',
    original: 'She have been working here since 2020',
    refined: 'She has been working here since 2020 (refined)',
    createdAt: '2025-10-05T11:00:00',
  },
];

export default function HistoryPage() {
  const [history, setHistory] = useState(dummyHistory);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setHistory(history.filter((item) => item.id !== id));
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
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

  return (
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
        {history.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="gap-2 border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="border border-border bg-card/85">
          <CardContent className="space-y-3 py-16 text-center">
            <p className="text-lg leading-relaxed text-foreground">
              No conversion history yet
            </p>
            <p className="text-sm leading-relaxed text-secondary">
              Start refining your sentences to build your archive.
            </p>
            <Button asChild className="px-8 font-sans text-xs uppercase tracking-[0.28em]">
              <a href="/home">
                Start refining
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                      {formatDate(item.createdAt)}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.refined, item.id)}
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
                      onClick={() => handleDelete(item.id)}
                      className="gap-2 border border-transparent font-sans text-[0.7rem] uppercase tracking-[0.28em] text-accent-error hover:border-accent-error/60"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                    Original
                  </p>
                  <p className="text-base leading-relaxed text-foreground/80">{item.original}</p>
                </div>
                <div className="border-t border-border pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Refined
                  </p>
                  <p className="text-base font-medium leading-relaxed text-foreground">
                    {item.refined}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination (UI only) */}
      {history.length > 0 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-primary bg-card text-primary hover:bg-[hsl(var(--primary-hover))] hover:text-primary-foreground"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground"
          >
            3
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border font-sans text-[0.7rem] uppercase tracking-[0.28em] text-secondary hover:text-foreground"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
