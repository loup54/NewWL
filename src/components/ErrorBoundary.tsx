
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary: Error caught:', error.message);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary: Component stack:', errorInfo.componentStack);
    console.error('ErrorBoundary: Error details:', error);
    
    // Check for specific authentication errors
    if (error.message.includes('dispatcher') || error.message.includes('useState')) {
      console.error('ErrorBoundary: React hooks error detected - likely authentication context issue');
    }
    
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    console.log('ErrorBoundary: Resetting error state');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    console.log('ErrorBoundary: Reloading application');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAuthError = this.state.error?.message.includes('dispatcher') || 
                         this.state.error?.message.includes('useState') ||
                         this.state.error?.message.includes('useAuth');

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isAuthError ? 'Authentication Error' : 'Something went wrong'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isAuthError 
                  ? 'There was an issue with the authentication system. Please reload the page.'
                  : 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'
                }
              </p>
              {this.state.error && (
                <p className="text-red-600 text-xs mt-2 font-mono">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={this.handleReload} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <Button variant="outline" onClick={this.handleReset} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Developer Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {this.state.error?.stack}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
