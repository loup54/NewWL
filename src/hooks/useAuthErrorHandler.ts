
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}

export const useAuthErrorHandler = () => {
  const handleAuthError = useCallback((error: any) => {
    console.error('Auth error:', error);

    // Handle different types of auth errors
    if (error?.message) {
      let title = "Authentication Error";
      let description = error.message;

      // Handle specific Supabase auth errors
      switch (error.message) {
        case 'Invalid login credentials':
          title = "Login Failed";
          description = "The email or password you entered is incorrect. Please try again.";
          break;
        case 'Email not confirmed':
          title = "Email Not Verified";
          description = "Please check your email and click the confirmation link before signing in.";
          break;
        case 'User already registered':
          title = "Account Already Exists";
          description = "An account with this email already exists. Please sign in instead.";
          break;
        case 'Password should be at least 6 characters':
          title = "Password Too Short";
          description = "Your password must be at least 6 characters long.";
          break;
        case 'Unable to validate email address: invalid format':
          title = "Invalid Email";
          description = "Please enter a valid email address.";
          break;
        case 'Network request failed':
          title = "Connection Error";
          description = "Unable to connect to the server. Please check your internet connection.";
          break;
        default:
          // Use the original message for unknown errors
          break;
      }

      toast({
        title,
        description,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  }, []);

  const handleNetworkError = useCallback(() => {
    toast({
      title: "Connection Error",
      description: "Unable to connect to the server. Please check your internet connection and try again.",
      variant: "destructive"
    });
  }, []);

  const handleValidationError = useCallback((field: string, message: string) => {
    toast({
      title: `Invalid ${field}`,
      description: message,
      variant: "destructive"
    });
  }, []);

  return {
    handleAuthError,
    handleNetworkError,
    handleValidationError
  };
};
