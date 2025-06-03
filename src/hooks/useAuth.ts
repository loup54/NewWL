
// Phase 1 - Disabled auth hook
export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signIn: () => {
      console.log('Auth disabled in Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    signOut: () => {
      console.log('Auth disabled in Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    signUp: () => {
      console.log('Auth disabled in Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    }
  };
};
