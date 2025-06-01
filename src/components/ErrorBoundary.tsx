
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
    console.error('ErrorBoundary caught error in getDerivedStateFromError:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary componentDidCatch - Error:', error);
    console.error('ErrorBoundary componentDidCatch - Error Info:', errorInfo);
    console.error('ErrorBoundary componentDidCatch - Stack:', error.stack);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    console.log('ErrorBoundary reset clicked');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    console.log('ErrorBoundary reload clicked');
    window.location.reload();
  };

  public render() {
    console.log('ErrorBoundary render - hasError:', this.state.hasError);
    
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 text-sm">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>
              {this.state.error && (
                <p className="text-red-600 text-xs mt-2 font-mono">
                  Error: {this.state.error.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleReload} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>

            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Error Details
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
