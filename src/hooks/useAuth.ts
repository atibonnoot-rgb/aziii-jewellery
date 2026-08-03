import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { signIn as apiSignIn, signOut as apiSignOut } from '../lib/authApi';
import type { Session } from '@supabase/supabase-js';

interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const newSession = await apiSignIn(email, password);
    setSession(newSession);
  };

  const signOut = async () => {
    await apiSignOut();
    setSession(null);
  };

  return { session, loading, signIn, signOut };
}
