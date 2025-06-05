
// Phase 1 - Complete authentication removal
// This hook provides static values with no authentication logic whatsoever

export const useAuth = () => {
  console.log('useAuth: Authentication completely disabled - Phase 1');
  
  return {
    user: null,
    session: null,
    loading: false,
    isAuthenticated: false,
    signIn: () => {
      console.log('Sign in disabled - Phase 1');
      return Promise.resolve({ error: new Error('Authentication disabled in Phase 1') });
    },
    signOut: () => {
      console.log('Sign out disabled - Phase 1');
      return Promise.resolve({ error: null });
    },
    signUp: () => {
      console.log('Sign up disabled - Phase 1');
      return Promise.resolve({ error: new Error('Authentication disabled in Phase 1') });
    }
  };
};
