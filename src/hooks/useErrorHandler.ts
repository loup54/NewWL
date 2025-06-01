
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface AppError {
  code: string;
  message: string;
  details?: string;
  recoverable?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: AppError | Error | string) => {
    console.error('Error handled:', error);

    if (typeof error === 'string') {
      toast.error(error);
      return;
    }

    if (error instanceof Error) {
      toast.error(`Something went wrong: ${error.message}`);
      return;
    }

    // Handle AppError
    const { message, details, recoverable = true } = error;
    
    if (recoverable) {
      toast.error(message, {
        description: details,
        action: {
          label: 'Retry',
          onClick: () => window.location.reload()
        }
      });
    } else {
      toast.error(message, {
        description: details || 'Please refresh the page and try again.'
      });
    }
  }, []);

  const handleFileError = useCallback((file: File, errorType: 'size' | 'type' | 'corrupted' | 'read') => {
    const errorMessages = {
      size: {
        code: 'FILE_TOO_LARGE',
        message: `File "${file.name}" is too large`,
        details: `Maximum size is 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`
      },
      type: {
        code: 'UNSUPPORTED_FILE_TYPE',
        message: `File type not supported: "${file.name}"`,
        details: 'Please upload a supported document format (txt, html, md, rtf, etc.)'
      },
      corrupted: {
        code: 'FILE_CORRUPTED',
        message: `File "${file.name}" appears to be corrupted`,
        details: 'Please check the file and try uploading again.'
      },
      read: {
        code: 'FILE_READ_ERROR',
        message: `Failed to read file "${file.name}"`,
        details: 'Please try uploading the file again.'
      }
    };

    handleError(errorMessages[errorType]);
  }, [handleError]);

  const handleNetworkError = useCallback((error: any) => {
    const networkError: AppError = {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      details: 'Please check your internet connection and try again.',
      recoverable: true
    };
    handleError(networkError);
  }, [handleError]);

  return {
    handleError,
    handleFileError,
    handleNetworkError
  };
};
