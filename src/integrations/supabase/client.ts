
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use direct Supabase configuration - environment variables not available in Lovable
const SUPABASE_URL = "https://ccmyjrgrdymwraiuauoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg";

console.log('Supabase client: Initializing with URL:', SUPABASE_URL);
console.log('Supabase client: Using key ending with:', SUPABASE_PUBLISHABLE_KEY.slice(-10));

// Create a single instance to prevent multiple client warnings
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: true // Enable debug mode to see auth issues
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

console.log('Supabase client: Initialization complete');

// Test the connection immediately
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error);
  } else {
    console.log('Supabase connection test successful:', data ? 'with session' : 'no session');
  }
}).catch((err) => {
  console.error('Supabase connection test exception:', err);
});
