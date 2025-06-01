
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { KeywordManager } from '@/components/KeywordManager';
import { DocumentViewer } from '@/components/DocumentViewer';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Keyword {
  id: string;
  word: string;
  color: string;
  count: number;
}

export interface DocumentData {
  content: string;
  filename: string;
  uploadDate: Date;
}

const Index = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: '1', word: 'respect', color: '#fbbf24', count: 0 },
    { id: '2', word: 'inclusion', color: '#34d399', count: 0 },
    { id: '3', word: 'diversity', color: '#60a5fa', count: 0 },
  ]);
  
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  const addKeyword = (word: string, color: string) => {
    const newKeyword: Keyword = {
      id: Date.now().toString(),
      word: word.toLowerCase(),
      color,
      count: 0
    };
    setKeywords([...keywords, newKeyword]);
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const updateKeywordCounts = (counts: Record<string, number>) => {
    setKeywords(prev => 
      prev.map(keyword => ({
        ...keyword,
        count: counts[keyword.word] || 0
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!document ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                WordLens Insight Engine
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Analyze documents for meaningful themes like respect, inclusion, and diversity. 
                Upload your document to get started with intelligent keyword tracking and analytics.
              </p>
            </div>
            
            <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <FileUpload onDocumentUpload={setDocument} />
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <KeywordManager
                  keywords={keywords}
                  onAddKeyword={addKeyword}
                  onRemoveKeyword={removeKeyword}
                  highlightEnabled={highlightEnabled}
                  onToggleHighlight={setHighlightEnabled}
                />
              </Card>
              
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <AnalyticsDashboard keywords={keywords} document={document} />
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <DocumentViewer
                  document={document}
                  keywords={keywords}
                  highlightEnabled={highlightEnabled}
                  onKeywordCountsUpdate={updateKeywordCounts}
                />
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
