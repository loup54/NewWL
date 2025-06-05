
import { useState, useEffect, useCallback } from 'react';
import { offlineStorage, StoredDocument } from '@/utils/offlineStorage';
import { DocumentData } from '@/types';
import { toast } from 'sonner';

export const useOfflineDocuments = () => {
  const [offlineDocuments, setOfflineDocuments] = useState<StoredDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const documents = await offlineStorage.getAllDocuments();
      setOfflineDocuments(documents);
    } catch (error) {
      console.error('Error loading offline documents:', error);
      toast.error('Failed to load offline documents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOfflineDocuments();
  }, [loadOfflineDocuments]);

  const saveDocumentOffline = useCallback(async (document: DocumentData) => {
    try {
      const storedDocument: StoredDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: document.filename,
        content: document.content,
        uploadDate: document.uploadDate,
        lastModified: new Date(),
        size: new Blob([document.content]).size
      };

      await offlineStorage.saveDocument(storedDocument);
      await loadOfflineDocuments();
      
      if (!isOnline) {
        toast.success('Document saved offline');
      }
      
      return storedDocument.id;
    } catch (error) {
      console.error('Error saving document offline:', error);
      toast.error('Failed to save document offline');
      return null;
    }
  }, [isOnline, loadOfflineDocuments]);

  const loadDocumentOffline = useCallback(async (id: string): Promise<DocumentData | null> => {
    try {
      const storedDocument = await offlineStorage.getDocument(id);
      if (!storedDocument) return null;

      return {
        id: storedDocument.id,
        content: storedDocument.content,
        filename: storedDocument.filename,
        uploadDate: storedDocument.uploadDate,
        fileSize: storedDocument.size,
        fileType: 'text/plain'
      };
    } catch (error) {
      console.error('Error loading document offline:', error);
      toast.error('Failed to load document');
      return null;
    }
  }, []);

  const deleteDocumentOffline = useCallback(async (id: string) => {
    try {
      await offlineStorage.deleteDocument(id);
      await loadOfflineDocuments();
      toast.success('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  }, [loadOfflineDocuments]);

  return {
    offlineDocuments,
    isLoading,
    isOnline,
    saveDocumentOffline,
    loadDocumentOffline,
    deleteDocumentOffline,
    refreshDocuments: loadOfflineDocuments
  };
};
