
import React, { useCallback, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, FileX } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentData } from '@/pages/Index';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface FileUploadProps {
  onDocumentUpload: (document: DocumentData) => void;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({ onDocumentUpload }, ref) => {
  const { handleFileError, handleError } = useErrorHandler();

  const validateFile = useCallback((file: File): boolean => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file.size > maxSize) {
      handleFileError(file, 'size');
      return false;
    }

    // Check if file appears to be corrupted (empty or suspiciously small for certain types)
    if (file.size === 0) {
      handleFileError(file, 'corrupted');
      return false;
    }

    return true;
  }, [handleFileError]);

  const processFile = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(new Error('File reading timeout'));
      }, 30000); // 30 second timeout

      reader.onload = (e) => {
        clearTimeout(timeoutId);
        try {
          const content = e.target?.result as string;
          
          if (!content || content.trim().length === 0) {
            handleFileError(file, 'corrupted');
            reject(new Error('File appears to be empty or corrupted'));
            return;
          }

          const document: DocumentData = {
            content,
            filename: file.name,
            uploadDate: new Date()
          };
          
          onDocumentUpload(document);
          toast.success(`Successfully uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
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

      reader.onabort = () => {
        clearTimeout(timeoutId);
        handleError('File upload was cancelled');
        reject(new Error('File upload cancelled'));
      };

      try {
        reader.readAsText(file);
      } catch (error) {
        clearTimeout(timeoutId);
        handleFileError(file, 'read');
        reject(error);
      }
    });
  }, [onDocumentUpload, handleFileError, handleError]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      if (!validateFile(file)) return;
      await processFile(file);
    } catch (error) {
      console.error('File processing error:', error);
      // Error already handled in processFile
    }
  }, [validateFile, processFile]);

  const onDropRejected = useCallback((rejectedFiles: any[]) => {
    const file = rejectedFiles[0];
    if (file) {
      const errors = file.errors;
      if (errors.some((error: any) => error.code === 'file-too-large')) {
        handleFileError(file.file, 'size');
      } else if (errors.some((error: any) => error.code === 'file-invalid-type')) {
        handleFileError(file.file, 'type');
      } else {
        handleError({
          code: 'FILE_UPLOAD_ERROR',
          message: `Cannot upload ${file.file.name}`,
          details: 'Please check the file and try again.'
        });
      }
    }
  }, [handleFileError, handleError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'text/plain': ['.txt'],
      'text/html': ['.html', '.htm'],
      'text/markdown': ['.md', '.markdown'],
      'text/csv': ['.csv'],
      'text/xml': ['.xml'],
      'application/rtf': ['.rtf'],
      'application/json': ['.json'],
      'application/javascript': ['.js', '.jsx'],
      'application/typescript': ['.ts', '.tsx'],
      'text/css': ['.css'],
      'application/sql': ['.sql'],
      'text/x-python': ['.py'],
      'text/x-java': ['.java'],
      'text/x-c': ['.c', '.h'],
      'text/x-c++': ['.cpp', '.hpp', '.cc'],
      'text/x-php': ['.php'],
      'text/x-ruby': ['.rb'],
      'text/x-go': ['.go'],
      'text/x-rust': ['.rs'],
      'application/x-yaml': ['.yml', '.yaml'],
      'text/x-log': ['.log'],
      'text/x-ini': ['.ini', '.cfg', '.conf']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onError: (error) => {
      handleError({
        code: 'DROPZONE_ERROR',
        message: 'File upload failed',
        details: error.message
      });
    }
  });

  const inputProps = getInputProps();

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-dashed border-gray-200">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out bg-white/60 backdrop-blur-sm
          ${isDragActive && !isDragReject
            ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
            : isDragReject
            ? 'border-red-400 bg-red-50 shadow-lg'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md'
          }
        `}
      >
        <input {...inputProps} ref={ref} />
        
        <div className="space-y-4">
          {isDragReject ? (
            <div className="space-y-3">
              <FileX className="w-16 h-16 text-red-400 mx-auto" />
              <div className="bg-red-100 border-2 border-red-200 rounded-lg p-4 text-sm text-red-700">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">File not supported</span>
                </div>
                <p className="mt-1">Please upload a supported document format (see list below)</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="p-4 bg-blue-50 rounded-full inline-block mb-4">
                <Upload className={`w-16 h-16 mx-auto transition-all duration-200 ${
                  isDragActive ? 'text-blue-500 scale-110' : 'text-blue-400'
                }`} />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border-2 border-blue-200">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop your document here' : 'Upload Document'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isDragReject 
                ? 'File type not supported. Please upload a supported document format.'
                : 'Drag and drop your document here, or click to browse'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">.txt</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">.html</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">.md</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">.rtf</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">.csv</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">.json</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">.js/.ts</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">.py</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">.java</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">.cpp</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">.php</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">& more</span>
            </div>
            <p className="text-xs text-gray-400 mt-3 bg-gray-100 px-3 py-1 rounded-full inline-block border">Maximum file size: 50MB</p>
          </div>
        </div>
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';
