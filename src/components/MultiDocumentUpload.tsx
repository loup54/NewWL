
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DocumentData } from '@/pages/Index';

interface MultiDocumentUploadProps {
  documents: DocumentData[];
  onDocumentUpload: (document: DocumentData) => void;
  onDocumentRemove: (index: number) => void;
  maxDocuments?: number;
}

export const MultiDocumentUpload: React.FC<MultiDocumentUploadProps> = ({
  documents,
  onDocumentUpload,
  onDocumentRemove,
  maxDocuments = 3
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (documents.length >= maxDocuments) {
      toast.error(`Maximum ${maxDocuments} documents allowed for comparison`);
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is 50MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const document: DocumentData = {
        content,
        filename: file.name,
        uploadDate: new Date()
      };
      onDocumentUpload(document);
      toast.success(`Added ${file.name} for comparison`);
    };

    reader.onerror = () => {
      toast.error('Failed to read file. Please try again.');
    };

    reader.readAsText(file);
  }, [documents.length, maxDocuments, onDocumentUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/html': ['.html', '.htm'],
      'text/markdown': ['.md', '.markdown'],
      'application/rtf': ['.rtf'],
      'application/json': ['.json']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    disabled: documents.length >= maxDocuments
  });

  return (
    <div className="space-y-4">
      {documents.length < maxDocuments && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }
            ${documents.length >= maxDocuments ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop document here' : `Add document ${documents.length + 1} for comparison`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {documents.length}/{maxDocuments} documents
          </p>
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Documents for Comparison</h4>
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{doc.filename}</span>
                <span className="text-xs text-gray-500">
                  ({(doc.content.length / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDocumentRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
