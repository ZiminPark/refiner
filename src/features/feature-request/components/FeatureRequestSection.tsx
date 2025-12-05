'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

import { FeatureRequestPanel } from './FeatureRequestPanel';

export function FeatureRequestSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full border-0 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Requests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <FeatureRequestPanel inModal onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
