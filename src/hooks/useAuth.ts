
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
    const getInitialSession = async () => {
      try {
        console.log('useAuth: Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('useAuth: Initial session check result:', { 
          hasSession: !!session, 
          error: error?.message,
          userId: session?.user?.id 
        });
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false
        });
      } catch (err) {
        console.error('useAuth: Error getting initial session:', err);
        setAuthState({
          user: null,
          session: null,
          loading: false
        });
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth: Auth state changed:', event, {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false
        });
      }
    );

    getInitialSession();

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('useAuth: Attempting sign up for:', email);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      console.log('useAuth: Sign up result:', { 
        hasData: !!data, 
        hasUser: !!data?.user,
        error: error?.message 
      });
      
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error };
    } catch (err) {
      console.error('useAuth: Sign up exception:', err);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useAuth: Attempting sign in for:', email);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('useAuth: Sign in result:', { 
        hasData: !!data, 
        hasSession: !!data?.session,
        error: error?.message 
      });
      
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error };
    } catch (err) {
      console.error('useAuth: Sign in exception:', err);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('useAuth: Attempting sign out');
    try {
      const { error } = await supabase.auth.signOut();
      console.log('useAuth: Sign out result:', { error: error?.message });
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
