'use client';

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/home`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { prompt: 'select_account' },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Unable to sign in',
        description: 'Please try again or use a different Google account.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      variant="outline"
      className="group flex w-full items-center gap-2 rounded-sm border border-border bg-card/70 px-6 py-4 font-sans text-xs uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-base font-semibold text-[#4285F4] shadow-sm">
          G
        </span>
      )}
      Continue with Google
    </Button>
  );
}
