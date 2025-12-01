'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

type SessionState = {
  isAuthenticated: boolean;
  isChecking: boolean;
  refreshSession: () => Promise<Session | null>;
};

export function useSupabaseSession(): SessionState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const sync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;
      setIsAuthenticated(Boolean(session));
      setIsChecking(false);
    };

    sync();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMounted) return;
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshSession = useCallback(async () => {
    const supabase = createClient();
    setIsChecking(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsAuthenticated(Boolean(session));
    setIsChecking(false);
    return session ?? null;
  }, []);

  return { isAuthenticated, isChecking, refreshSession };
}
