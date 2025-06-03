
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useSimpleAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false
        });
      } catch (error) {
        console.error('Error getting session:', error);
        setAuthState({ user: null, session: null, loading: false });
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false
        });
      }
    );

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        setAuthState(prev => ({ ...prev, loading: false }));
        return { error };
      }
      
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "Please check your email to confirm your account",
        });
      }
      
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: null };
    } catch (err) {
      const error = new Error('Sign up failed');
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        setAuthState(prev => ({ ...prev, loading: false }));
        return { error };
      }
      
      toast({
        title: "Welcome!",
        description: "Signed in successfully",
      });
      
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: null };
    } catch (err) {
      const error = new Error('Sign in failed');
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You've been signed out successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
};
