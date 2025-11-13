'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold leading-snug text-gray-800 mb-2">
            Conversion History
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Review your past sentence conversions and track your progress.
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="gap-2 text-accent-error border-accent-error hover:bg-accent-error/10"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="py-16 text-center">
            <p className="text-lg leading-relaxed text-gray-600 mb-4">
              No conversion history yet
            </p>
            <p className="text-sm leading-relaxed text-gray-500 mb-6">
              Start refining your sentences to build your history
            </p>
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <a href="/home">
                Start Refining
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="bg-slate-50 border-slate-200 hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-sm leading-relaxed text-gray-500 font-normal mb-2">
                      {formatDate(item.createdAt)}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.refined, item.id)}
                      className="gap-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Copy className="w-4 h-4" />
                      {copied === item.id ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="gap-2 text-accent-error hover:text-accent-error hover:bg-accent-error/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs leading-normal text-gray-500 mb-1 font-semibold uppercase">
                    Original
                  </p>
                  <p className="text-base leading-relaxed text-gray-700">{item.original}</p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs leading-normal text-accent-success mb-1 font-semibold uppercase">
                    Refined
                  </p>
                  <p className="text-base leading-relaxed text-gray-900 font-medium">
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
            className="text-gray-400 border-gray-200"
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary text-primary-foreground border-primary hover:bg-primary-hover"
          >
            1
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          >
            2
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          >
            3
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
