'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/`;
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
      className="group flex w-full items-center gap-3 rounded-sm border border-border bg-card/70 px-6 py-4 font-sans text-xs uppercase tracking-[0.28em] text-foreground/80 transition-colors hover:text-foreground"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-border/80 transition group-hover:ring-primary/30">
          <GoogleLogo />
        </span>
      )}
      <span className="leading-none">Continue with Google</span>
    </Button>
  );
}

function GoogleLogo() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.52 12.275c0-.815-.073-1.595-.209-2.349H12v4.443h6.48c-.28 1.475-1.12 2.727-2.392 3.567v2.97h3.868c2.266-2.088 3.564-5.164 3.564-8.631Z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.954-1.073 7.938-2.904l-3.868-2.97c-1.073.72-2.444 1.15-4.07 1.15-3.132 0-5.788-2.116-6.736-4.957H1.29v3.086C3.27 21.94 7.308 24 12 24Z"
        fill="#34A853"
      />
      <path
        d="M5.264 14.319A7.214 7.214 0 0 1 4.894 12c0-.806.139-1.59.37-2.319V6.595H1.29A11.997 11.997 0 0 0 0 12c0 1.948.464 3.785 1.29 5.405l3.974-3.086Z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.754c1.761 0 3.34.605 4.586 1.794l3.439-3.439C17.948 1.14 15.24 0 12 0 7.308 0 3.27 2.06 1.29 6.595l3.974 3.086C6.212 6.87 8.868 4.754 12 4.754Z"
        fill="#EA4335"
      />
    </svg>
  );
}
