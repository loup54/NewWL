
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use completely invalid URLs to prevent any connections in Phase 1
const supabaseUrl = 'https://localhost:0';
const supabaseAnonKey = 'invalid-key-phase-1';

// Create a completely neutered client for Phase 1
const baseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    flowType: 'implicit'
  }
});

// Completely override the client to prevent any network calls
export const supabase = {
  ...baseClient,
  auth: {
    signInWithPassword: () => {
      console.log('Auth call blocked - Phase 1');
      return Promise.reject(new Error('Auth disabled in Phase 1'));
    },
    signUp: () => {
      console.log('Auth call blocked - Phase 1');
      return Promise.reject(new Error('Auth disabled in Phase 1'));
    },
    signOut: () => {
      console.log('Auth call blocked - Phase 1');
      return Promise.reject(new Error('Auth disabled in Phase 1'));
    },
    getSession: () => {
      console.log('getSession call blocked - Phase 1');
      return Promise.resolve({ data: { session: null }, error: null });
    },
    getUser: () => {
      console.log('getUser call blocked - Phase 1');
      return Promise.resolve({ data: { user: null }, error: null });
    },
    onAuthStateChange: () => {
      console.log('onAuthStateChange call blocked - Phase 1');
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: () => ({
    select: () => Promise.reject(new Error('Database calls disabled in Phase 1')),
    insert: () => Promise.reject(new Error('Database calls disabled in Phase 1')),
    update: () => Promise.reject(new Error('Database calls disabled in Phase 1')),
    delete: () => Promise.reject(new Error('Database calls disabled in Phase 1'))
  }),
  rpc: () => Promise.reject(new Error('RPC calls disabled in Phase 1')),
  functions: {
    invoke: () => Promise.reject(new Error('Function calls disabled in Phase 1'))
  }
} as any;

// Disable all auth functionality for Phase 1
export const useAuth = () => ({
  user: null,
  loading: false,
  signIn: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signOut: () => Promise.reject(new Error('Auth disabled in Phase 1')),
  signUp: () => Promise.reject(new Error('Auth disabled in Phase 1'))
});
