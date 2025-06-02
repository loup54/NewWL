
import React from 'react';
import { Loader2, FileText, Upload, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LoadingStateProps {
  type: 'upload' | 'processing' | 'export';
  message?: string;
  progress?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  type, 
  message, 
  progress 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'upload': return <Upload className="w-8 h-8 text-blue-500" />;
      case 'processing': return <FileText className="w-8 h-8 text-green-500" />;
      case 'export': return <Download className="w-8 h-8 text-purple-500" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'upload': return 'Uploading document...';
      case 'processing': return 'Processing content...';
      case 'export': return 'Generating export...';
    }
  };

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {getIcon()}
          <Loader2 className="w-4 h-4 absolute -top-1 -right-1 animate-spin text-gray-400" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-medium text-gray-900">
            {message || getDefaultMessage()}
          </h3>
          
          {progress !== undefined && (
            <div className="w-48 mx-auto">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const SuccessAnimation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-scale-in">
    {children}
  </div>
);

export const FadeTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-fade-in">
    {children}
  </div>
);

// Export as LoadingStates object for backwards compatibility
export const LoadingStates = {
  PageLoader,
  LoadingState,
  SuccessAnimation,
  FadeTransition
};
