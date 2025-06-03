
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  });

  useEffect(() => {
    console.log('useAuth: Setting up auth listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('useAuth: Initial session check', { session: !!session, error });
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.email);
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false
        });
      }
    );

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('useAuth: Attempting sign up for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('useAuth: Sign up result:', { data: !!data, error });
      return { error };
    } catch (err) {
      console.error('useAuth: Sign up exception:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useAuth: Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('useAuth: Sign in result:', { data: !!data, error });
      return { error };
    } catch (err) {
      console.error('useAuth: Sign in exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('useAuth: Attempting sign out');
    try {
      const { error } = await supabase.auth.signOut();
      console.log('useAuth: Sign out result:', { error });
      return { error };
    } catch (err) {
      console.error('useAuth: Sign out exception:', err);
      return { error: err };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
};
