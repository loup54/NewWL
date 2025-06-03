
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SimpleAuthContext: Initializing auth state');
    
    // Get initial session
    const getSession = async () => {
      console.log('SimpleAuthContext: Getting initial session');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('SimpleAuthContext: Error getting session:', error);
      } else {
        console.log('SimpleAuthContext: Initial session:', session ? 'found' : 'none');
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('SimpleAuthContext: Auth state changed:', event, session ? 'with session' : 'no session');
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('SimpleAuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('SimpleAuthContext: Sign up attempt for:', email);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('SimpleAuthContext: Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('SimpleAuthContext: Sign up successful');
      toast({
        title: "Success!",
        description: "Account created successfully",
      });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('SimpleAuthContext: Sign in attempt for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('SimpleAuthContext: Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('SimpleAuthContext: Sign in successful');
      toast({
        title: "Welcome!",
        description: "Signed in successfully",
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('SimpleAuthContext: Sign out attempt');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('SimpleAuthContext: Sign out error:', error);
    } else {
      console.log('SimpleAuthContext: Sign out successful');
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  console.log('SimpleAuthContext: Rendering with user:', user ? user.email : 'none', 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
