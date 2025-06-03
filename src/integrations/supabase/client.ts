
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase configuration from environment/secrets
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ccmyjrgrdymwraiuauoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg";

console.log('Supabase client: Initializing with URL:', SUPABASE_URL);

// Create a single instance to prevent multiple client warnings
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: false // Reduce debug noise
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
