
// Phase 1 - Authentication completely removed
// This hook is kept for compatibility but returns minimal state

export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signIn: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signUp: () => Promise.resolve({ error: null })
  };
};
