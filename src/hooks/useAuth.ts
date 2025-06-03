
// Phase 1 - Completely disabled auth hook - no sign-in required
export const useAuth = () => {
  console.log('useAuth: Phase 1 - Authentication completely bypassed');
  
  return {
    user: null,
    loading: false,
    signIn: () => {
      console.log('Auth signIn: Disabled in Phase 1');
      return Promise.resolve({ error: null });
    },
    signOut: () => {
      console.log('Auth signOut: Disabled in Phase 1');
      return Promise.resolve({ error: null });
    },
    signUp: () => {
      console.log('Auth signUp: Disabled in Phase 1');
      return Promise.resolve({ error: null });
    }
  };
};
