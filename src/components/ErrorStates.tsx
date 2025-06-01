
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/TouchOptimizedButton';
import { Card } from '@/components/ui/card';

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  showHomeButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  actionLabel = "Try Again",
  onAction,
  showHomeButton = false
}) => (
  <Card className="p-8 text-center bg-red-50/80 backdrop-blur-sm border border-red-200/60">
    <div className="flex flex-col items-center space-y-4">
      <div className="p-3 bg-red-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-900">{title}</h3>
        <p className="text-red-700 max-w-md">{description}</p>
      </div>
      <div className="flex space-x-2">
        {onAction && (
          <TouchOptimizedButton 
            onClick={onAction}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
            touchTarget="medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {actionLabel}
          </TouchOptimizedButton>
        )}
        {showHomeButton && (
          <TouchOptimizedButton 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
            touchTarget="medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </TouchOptimizedButton>
        )}
      </div>
    </div>
  </Card>
);

export const FileUploadError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Upload Failed"
    description="There was an error uploading your file. Please check the file format and try again."
    actionLabel="Choose Another File"
    onAction={onRetry}
  />
);

export const ProcessingError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Processing Error"
    description="We couldn't process your document. The file might be corrupted or in an unsupported format."
    onAction={onRetry}
    showHomeButton
  />
);
