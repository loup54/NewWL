
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://ccmyjrgrdymwraiuauoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg';

// Create a disabled client for Phase 1 - no actual connections
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'X-Client-Info': 'disabled-phase-1'
    }
  }
});

// Disable all auth functionality for Phase 1
export const useAuth = () => ({
  user: null,
  loading: false,
  signIn: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signOut: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signUp: () => Promise.reject(new Error('Auth disabled in Phase 1'))
});
