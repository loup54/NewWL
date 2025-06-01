
import React from 'react';
import { FileText, Upload, Search } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/TouchOptimizedButton';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => (
  <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border border-gray-200/40">
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-gray-100 rounded-full">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{description}</p>
      </div>
      {action && (
        <TouchOptimizedButton 
          onClick={action.onClick}
          className="mt-4"
          touchTarget="medium"
        >
          {action.label}
        </TouchOptimizedButton>
      )}
    </div>
  </Card>
);

export const NoDocumentState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <EmptyState
    icon={<FileText className="w-8 h-8 text-gray-400" />}
    title="No Document Uploaded"
    description="Upload a document to start analyzing keywords and themes. We support PDF, DOCX, and TXT files."
    action={{
      label: "Upload Document",
      onClick: onUpload
    }}
  />
);

export const NoKeywordsState: React.FC<{ onAddKeyword: () => void }> = ({ onAddKeyword }) => (
  <EmptyState
    icon={<Search className="w-8 h-8 text-gray-400" />}
    title="No Keywords Added"
    description="Add keywords to track and analyze in your document. Start with themes like 'respect', 'inclusion', or 'diversity'."
    action={{
      label: "Add Keyword",
      onClick: onAddKeyword
    }}
  />
);
