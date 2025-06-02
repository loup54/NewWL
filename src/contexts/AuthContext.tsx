
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleAuthError } = useAuthErrorHandler();

  // Session refresh function
  const refreshSession = async () => {
    try {
      console.log('AuthProvider: Refreshing session...');
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('AuthProvider: Session refresh error:', error);
        handleAuthError(error);
      } else {
        console.log('AuthProvider: Session refreshed successfully');
      }
    } catch (error) {
      console.error('AuthProvider: Session refresh exception:', error);
      handleAuthError(error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('AuthProvider: Error getting initial session:', error);
            handleAuthError(error);
          } else {
            console.log('AuthProvider: Initial session retrieved', session ? 'with user' : 'no session');
            setSession(session);
            setUser(session?.user ?? null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Exception getting initial session:', error);
        if (mounted) {
          handleAuthError(error);
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    console.log('AuthProvider: Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider: Auth state change:', event, session ? 'with session' : 'no session');
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Show appropriate feedback for auth events
        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been signed out successfully.",
          });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('AuthProvider: Token refreshed automatically');
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password reset",
            description: "You can now set a new password.",
          });
        }
      }
    });

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthError]);

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Sign up attempt for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.log('AuthProvider: Sign up error:', error.message);
        handleAuthError(error);
      } else {
        console.log('AuthProvider: Sign up successful');
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign up exception:', error);
      handleAuthError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Sign in attempt for:', email);
    setLoading(true);
    
    try {
      // Add validation before attempting sign in
      if (!email || !password) {
        const validationError = new Error('Email and password are required');
        handleAuthError(validationError);
        return { error: validationError };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.log('AuthProvider: Sign in error:', error.message, error);
        handleAuthError(error);
      } else {
        console.log('AuthProvider: Sign in successful', data);
      }
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign in exception:', error);
      handleAuthError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Sign out attempt');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        handleAuthError(error);
      } else {
        console.log('AuthProvider: Sign out successful');
      }
    } catch (error) {
      console.error('AuthProvider: Sign out exception:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
