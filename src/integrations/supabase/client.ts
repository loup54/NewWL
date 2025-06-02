
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ccmyjrgrdymwraiuauoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg";

console.log('Supabase client: Initializing with URL:', SUPABASE_URL);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'wordlens-app'
    }
  },
  db: {
    schema: 'public'
  }
});

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state change:', event, session ? 'with session' : 'no session');
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully');
  } else if (event === 'SIGN_OUT') {
    console.log('User signed out');
  }
});

console.log('Supabase client: Initialization complete');
