import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DocumentData } from '@/pages/Index';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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
  const { handleFileError, handleError } = useErrorHandler();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      if (documents.length >= maxDocuments) {
        handleError({
          code: 'MAX_DOCUMENTS_EXCEEDED',
          message: `Maximum ${maxDocuments} documents allowed for comparison`,
          details: 'Please remove a document before adding a new one.'
        });
        return;
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        handleFileError(file, 'size');
        return;
      }

      if (file.size === 0) {
        handleFileError(file, 'corrupted');
        return;
      }

      const reader = new FileReader();
      
      const processFile = new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reader.abort();
          reject(new Error('File reading timeout'));
        }, 30000);

        reader.onload = (e) => {
          clearTimeout(timeoutId);
          try {
            const content = e.target?.result as string;
            
            if (!content || content.trim().length === 0) {
              handleFileError(file, 'corrupted');
              reject(new Error('File appears to be empty'));
              return;
            }

            const document: DocumentData = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              content,
              filename: file.name,
              uploadDate: new Date(),
              fileSize: file.size,
              fileType: file.type || 'text/plain'
            };
            
            onDocumentUpload(document);
            toast.success(`Added ${file.name} for comparison`);
            resolve();
          } catch (error) {
            clearTimeout(timeoutId);
            handleFileError(file, 'read');
            reject(error);
          }
        };

        reader.onerror = () => {
          clearTimeout(timeoutId);
          handleFileError(file, 'read');
          reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
      });

      await processFile;
    } catch (error) {
      console.error('Multi-document upload error:', error);
      // Error already handled above
    }
  }, [documents.length, maxDocuments, onDocumentUpload, handleFileError, handleError]);

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
    disabled: documents.length >= maxDocuments,
    onError: (error) => {
      handleError({
        code: 'DROPZONE_ERROR',
        message: 'File upload failed',
        details: error.message
      });
    }
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
