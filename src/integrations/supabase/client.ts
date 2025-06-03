
// Phase 1 - Completely mock Supabase client without any real client creation
export const supabase = {
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
    onAuthStateChange: (callback: any) => {
      console.log('onAuthStateChange call blocked - Phase 1');
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: () => ({
    select: () => {
      console.log('Database select blocked - Phase 1');
      return Promise.reject(new Error('Database calls disabled in Phase 1'));
    },
    insert: () => {
      console.log('Database insert blocked - Phase 1');
      return Promise.reject(new Error('Database calls disabled in Phase 1'));
    },
    update: () => {
      console.log('Database update blocked - Phase 1');
      return Promise.reject(new Error('Database calls disabled in Phase 1'));
    },
    delete: () => {
      console.log('Database delete blocked - Phase 1');
      return Promise.reject(new Error('Database calls disabled in Phase 1'));
    }
  }),
  rpc: () => {
    console.log('RPC call blocked - Phase 1');
    return Promise.reject(new Error('RPC calls disabled in Phase 1'));
  },
  functions: {
    invoke: () => {
      console.log('Function call blocked - Phase 1');
      return Promise.reject(new Error('Function calls disabled in Phase 1'));
    }
  }
} as any;

// Also clear any existing auth state that might trigger refresh attempts
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
    localStorage.removeItem('sb-ccmyjrgrdymwraiuauoq-auth-token');
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.refreshToken');
    console.log('Cleared any existing Supabase auth tokens from storage');
  } catch (error) {
    console.log('Could not clear storage:', error);
  }
}
