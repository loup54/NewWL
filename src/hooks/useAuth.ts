

// Phase 1 - Authentication completely removed
// This hook returns static values with no authentication logic

export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signIn: () => {
      console.log('Sign in disabled - Phase 1');
      return Promise.resolve({ error: null });
    },
    signOut: () => {
      console.log('Sign out disabled - Phase 1');
      return Promise.resolve({ error: null });
    },
    signUp: () => {
      console.log('Sign up disabled - Phase 1');
      return Promise.resolve({ error: null });
    }
  };
};

