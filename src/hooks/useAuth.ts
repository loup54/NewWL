
// Phase 1 - Completely disabled auth hook
export const useAuth = () => {
  console.log('useAuth called - returning disabled state for Phase 1');
  
  return {
    user: null,
    loading: false,
    signIn: () => {
      console.log('Auth signIn called but disabled in Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    signOut: () => {
      console.log('Auth signOut called but disabled in Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    },
    signUp: () => {
      console.log('Auth signUp called but disabled in Phase 1');
      return Promise.reject(new Error('Authentication disabled in Phase 1'));
    }
  };
};
