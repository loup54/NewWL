
import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Download, RefreshCw, WifiOff, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOfflineDocuments } from '@/hooks/useOfflineDocuments';
import { DocumentData } from '@/pages/Index';
import { toast } from 'sonner';

interface OfflineDocumentManagerProps {
  onDocumentSelect: (document: DocumentData) => void;
}

export const OfflineDocumentManager: React.FC<OfflineDocumentManagerProps> = ({
  onDocumentSelect
}) => {
  const {
    offlineDocuments,
    isLoading,
    isOnline,
    loadDocumentOffline,
    deleteDocumentOffline,
    refreshDocuments
  } = useOfflineDocuments();

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const handleDocumentClick = async (documentId: string) => {
    try {
      setSelectedDocumentId(documentId);
      const document = await loadDocumentOffline(documentId);
      
      if (document) {
        onDocumentSelect(document);
        toast.success('Document loaded from offline storage');
      } else {
        toast.error('Failed to load document');
      }
    } catch (error) {
      console.error('Error loading offline document:', error);
      toast.error('Failed to load document');
    } finally {
      setSelectedDocumentId(null);
    }
  };

  const handleDeleteDocument = async (documentId: string, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      await deleteDocumentOffline(documentId);
    }
  };

  const handleExportDocument = async (documentId: string) => {
    try {
      const document = await loadDocumentOffline(documentId);
      if (document) {
        const blob = new Blob([document.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `offline_${document.filename}`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Document exported');
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      toast.error('Failed to export document');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span>Offline Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading offline documents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span>Offline Documents</span>
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? <Cloud className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshDocuments}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {offlineDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No offline documents found</p>
            <p className="text-xs mt-1">Documents are automatically saved for offline access</p>
          </div>
        ) : (
          <div className="space-y-2">
            {offlineDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleDocumentClick(doc.id)}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        Saved: {doc.lastModified.toLocaleDateString()} • 
                        {(doc.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportDocument(doc.id)}
                    title="Export document"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id, doc.filename)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete document"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
