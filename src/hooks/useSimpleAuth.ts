
import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
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
    console.log('useSimpleAuth: Setting up auth listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useSimpleAuth: Auth state changed:', event, session ? 'with session' : 'no session');
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false
        });
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('useSimpleAuth: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useSimpleAuth: Error getting session:', error);
          setAuthState({ user: null, session: null, loading: false });
        } else {
          console.log('useSimpleAuth: Initial session:', session ? 'found' : 'none');
          setAuthState({
            user: session?.user ?? null,
            session: session,
            loading: false
          });
        }
      } catch (err) {
        console.error('useSimpleAuth: Exception getting session:', err);
        setAuthState({ user: null, session: null, loading: false });
      }
    };

    getInitialSession();

    return () => {
      console.log('useSimpleAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('useSimpleAuth: Sign up attempt for:', email);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('useSimpleAuth: Sign up error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      console.log('useSimpleAuth: Sign up successful');
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "Please check your email to confirm your account",
        });
      } else {
        toast({
          title: "Success!",
          description: "Account created successfully",
        });
      }
      
      return { error: null };
    } catch (err) {
      console.error('useSimpleAuth: Sign up exception:', err);
      const error = new Error('An unexpected error occurred during sign up');
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useSimpleAuth: Sign in attempt for:', email);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('useSimpleAuth: Sign in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      console.log('useSimpleAuth: Sign in successful');
      toast({
        title: "Welcome!",
        description: "Signed in successfully",
      });
      
      return { error: null };
    } catch (err) {
      console.error('useSimpleAuth: Sign in exception:', err);
      const error = new Error('An unexpected error occurred during sign in');
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    console.log('useSimpleAuth: Sign out attempt');
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('useSimpleAuth: Sign out error:', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('useSimpleAuth: Sign out successful');
        toast({
          title: "Signed out",
          description: "You've been signed out successfully",
        });
      }
    } catch (err) {
      console.error('useSimpleAuth: Sign out exception:', err);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
};
