
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ccmyjrgrdymwraiuauoq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg";

console.log('Creating Supabase client with URL:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  }
});

console.log('Supabase client created successfully');
