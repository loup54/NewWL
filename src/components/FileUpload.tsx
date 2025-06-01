
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentData } from '@/pages/Index';

interface FileUploadProps {
  onDocumentUpload: (document: DocumentData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDocumentUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const document: DocumentData = {
        content,
        filename: file.name,
        uploadDate: new Date()
      };
      onDocumentUpload(document);
      toast.success(`Successfully uploaded ${file.name}`);
    };
    reader.readAsText(file);
  }, [onDocumentUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/html': ['.html'],
      'text/markdown': ['.md'],
      'application/rtf': ['.rtf']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive && !isDragReject
            ? 'border-blue-400 bg-blue-50 scale-105'
            : isDragReject
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {isDragReject ? (
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          ) : (
            <div className="relative">
              <Upload className={`w-16 h-16 mx-auto transition-all duration-200 ${
                isDragActive ? 'text-blue-500 scale-110' : 'text-gray-400'
              }`} />
              <FileText className="w-8 h-8 text-blue-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg" />
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop your document here' : 'Upload Document'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isDragReject 
                ? 'File type not supported. Please upload a text file.'
                : 'Drag and drop your document here, or click to browse'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-100 rounded-full">.txt</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">.html</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">.md</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">.rtf</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Maximum file size: 50MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};
