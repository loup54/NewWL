
import React from 'react';
import { FileText, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentData } from '@/types';
import { getFileType } from '@/utils/fileTypeUtils';
import { DocumentStats } from './DocumentStats';

interface DocumentHeaderProps {
  document: DocumentData;
  onExport: () => void;
  documentStats: {
    characters: number;
    words: number;
    lines: number;
  };
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ 
  document, 
  onExport, 
  documentStats 
}) => {
  const fileType = getFileType(document.filename || '');

  return (
    <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{document.filename || 'Untitled'}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{document.uploadDate?.toLocaleDateString() || 'Unknown date'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{fileType.icon}</span>
                <span>{fileType.type}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onExport}
          variant="outline"
          className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200"
          type="button"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>
      
      <DocumentStats {...documentStats} />
    </div>
  );
};
