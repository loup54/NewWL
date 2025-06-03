
// Phase 1 - Completely disabled Supabase client to prevent any auth attempts
console.log('Supabase client completely disabled - Phase 1');

// Mock client that throws errors for any operation to prevent auth attempts
export const supabase = {
  auth: {
    signInWithPassword: () => {
      console.log('Auth operation blocked - Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    signUp: () => {
      console.log('Auth operation blocked - Phase 1'); 
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    signOut: () => {
      console.log('Auth operation blocked - Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    getSession: () => {
      console.log('getSession blocked - Phase 1');
      return Promise.resolve({ data: { session: null }, error: null });
    },
    getUser: () => {
      console.log('getUser blocked - Phase 1');
      return Promise.resolve({ data: { user: null }, error: null });
    },
    onAuthStateChange: () => {
      console.log('onAuthStateChange blocked - Phase 1');
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

// Clear any existing auth tokens that might trigger modals
if (typeof window !== 'undefined') {
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('Cleared all storage to prevent auth modal triggers');
  } catch (error) {
    console.log('Could not clear storage:', error);
  }
}
