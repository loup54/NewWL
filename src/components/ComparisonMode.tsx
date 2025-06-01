
import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocumentData, Keyword } from '@/pages/Index';
import { MultiDocumentUpload } from './MultiDocumentUpload';
import { DocumentComparison } from './DocumentComparison';
import { KeywordManager } from './KeywordManager';
import { toast } from 'sonner';

interface ComparisonModeProps {
  onBack: () => void;
  initialKeywords: Keyword[];
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({
  onBack,
  initialKeywords
}) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
  const [keywordCounts, setKeywordCounts] = useState<Record<string, Record<string, number>>>({});

  const addDocument = useCallback((document: DocumentData) => {
    setDocuments(prev => [...prev, document]);
  }, []);

  const removeDocument = useCallback((index: number) => {
    setDocuments(prev => {
      const removed = prev[index];
      const newDocs = prev.filter((_, i) => i !== index);
      
      // Remove counts for the removed document
      setKeywordCounts(prevCounts => {
        const newCounts = { ...prevCounts };
        delete newCounts[removed.filename];
        return newCounts;
      });
      
      return newDocs;
    });
  }, []);

  const addKeyword = useCallback((word: string, color: string) => {
    const newKeyword: Keyword = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      word: word.toLowerCase().trim(),
      color,
      count: 0
    };

    setKeywords(prev => {
      const isDuplicate = prev.some(k => k.word === newKeyword.word);
      if (isDuplicate) return prev;
      return [...prev, newKeyword];
    });
  }, []);

  const removeKeyword = useCallback((id: string) => {
    setKeywords(prev => prev.filter(k => k.id !== id));
  }, []);

  // Calculate keyword counts for all documents
  useEffect(() => {
    const newCounts: Record<string, Record<string, number>> = {};
    
    documents.forEach(doc => {
      const docCounts: Record<string, number> = {};
      
      keywords.forEach(keyword => {
        try {
          const escapedKeyword = keyword.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
          const matches = doc.content.match(regex) || [];
          docCounts[keyword.word] = matches.length;
        } catch (error) {
          console.error('Regex error for keyword:', keyword.word, error);
          docCounts[keyword.word] = 0;
        }
      });
      
      newCounts[doc.filename] = docCounts;
    });
    
    setKeywordCounts(newCounts);
  }, [documents, keywords]);

  const exportComparison = useCallback(() => {
    if (documents.length < 2) {
      toast.error('Need at least 2 documents to export comparison');
      return;
    }

    const data = {
      comparisonDate: new Date().toISOString(),
      documents: documents.map(doc => ({
        filename: doc.filename,
        uploadDate: doc.uploadDate,
        wordCount: doc.content.trim().split(/\s+/).length
      })),
      keywords: keywords.map(keyword => ({
        word: keyword.word,
        color: keyword.color,
        counts: documents.reduce((acc, doc) => {
          acc[doc.filename] = keywordCounts[doc.filename]?.[keyword.word] || 0;
          return acc;
        }, {} as Record<string, number>)
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document_comparison_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Comparison exported successfully');
  }, [documents, keywords, keywordCounts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Single Document
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Document Comparison</h2>
        </div>
        {documents.length >= 2 && (
          <Button onClick={exportComparison} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Comparison
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
            <MultiDocumentUpload
              documents={documents}
              onDocumentUpload={addDocument}
              onDocumentRemove={removeDocument}
              maxDocuments={3}
            />
          </Card>

          <Card className="p-6">
            <KeywordManager
              keywords={keywords}
              onAddKeyword={addKeyword}
              onRemoveKeyword={removeKeyword}
              highlightEnabled={false}
              onToggleHighlight={() => {}}
              caseSensitive={false}
              onToggleCaseSensitive={() => {}}
              documentContent=""
            />
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">
            <DocumentComparison
              documents={documents}
              keywords={keywords}
              keywordCounts={keywordCounts}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
