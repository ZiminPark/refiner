'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Unable to sign out',
        description: 'Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isLoading}
      className="font-sans text-[0.7rem] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign out'}
    </Button>
  );
}
