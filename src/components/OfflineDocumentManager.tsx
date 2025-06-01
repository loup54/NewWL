
import React, { useState } from 'react';
import { Folder, FileText, Trash2, Calendar, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TouchOptimizedButton } from '@/components/TouchOptimizedButton';
import { useOfflineDocuments } from '@/hooks/useOfflineDocuments';
import { DocumentData } from '@/pages/Index';
import { formatBytes } from '@/utils/fileTypeUtils';

interface OfflineDocumentManagerProps {
  onLoadDocument: (document: DocumentData) => void;
  onClose: () => void;
}

export const OfflineDocumentManager: React.FC<OfflineDocumentManagerProps> = ({
  onLoadDocument,
  onClose
}) => {
  const { 
    offlineDocuments, 
    isLoading, 
    loadDocumentOffline, 
    deleteDocumentOffline 
  } = useOfflineDocuments();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleLoadDocument = async (id: string) => {
    setLoadingId(id);
    try {
      const document = await loadDocumentOffline(id);
      if (document) {
        onLoadDocument(document);
        onClose();
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteDocument = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocumentOffline(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offline documents...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Offline Documents</h3>
          <Badge variant="outline">{offlineDocuments.length}</Badge>
        </div>
        <Button onClick={onClose} variant="ghost" size="sm">
          Close
        </Button>
      </div>

      {offlineDocuments.length === 0 ? (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Offline Documents</h4>
          <p className="text-gray-600">
            Documents you upload will be automatically saved for offline access.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {offlineDocuments.map((doc) => (
              <Card 
                key={doc.id}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
                onClick={() => handleLoadDocument(doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {doc.filename}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{doc.uploadDate.toLocaleDateString()}</span>
                        </div>
                        <span>{formatBytes(doc.size)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {loadingId === doc.id && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                    <TouchOptimizedButton
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      touchTarget="small"
                    >
                      <Trash2 className="w-4 h-4" />
                    </TouchOptimizedButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
