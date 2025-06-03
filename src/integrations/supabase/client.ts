
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use dummy URLs to prevent any real connections in Phase 1
const supabaseUrl = 'https://dummy.supabase.co';
const supabaseAnonKey = 'dummy-key';

// Create a completely disabled client for Phase 1
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

// Override all auth methods to prevent any calls
const originalAuth = supabase.auth;
supabase.auth = {
  ...originalAuth,
  signInWithPassword: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signUp: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signOut: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
} as any;

// Disable all auth functionality for Phase 1
export const useAuth = () => ({
  user: null,
  loading: false,
  signIn: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signOut: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signUp: () => Promise.reject(new Error('Auth disabled in Phase 1'))
});
