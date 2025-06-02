
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ccmyjrgrdymwraiuauoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg";

console.log('Initializing Supabase client');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

console.log('Supabase client initialized successfully');
