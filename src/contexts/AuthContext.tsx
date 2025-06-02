
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
  console.log('AuthProvider: Component initializing');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider: State initialized');

  useEffect(() => {
    console.log('AuthProvider: useEffect starting');
    
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        } else {
          console.log('AuthProvider: Initial session retrieved:', session);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthProvider: Exception getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider: Auth state change:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initialize auth
    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Sign up attempt for:', email);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('AuthProvider: Sign up error:', error);
      } else {
        console.log('AuthProvider: Sign up successful');
      }
      
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign up exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Sign in attempt for:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('AuthProvider: Sign in error:', error);
      } else {
        console.log('AuthProvider: Sign in successful');
      }
      
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Sign out attempt');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Sign out successful');
      }
    } catch (error) {
      console.error('AuthProvider: Sign out exception:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  console.log('AuthProvider: Rendering with state:', { user: !!user, session: !!session, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
