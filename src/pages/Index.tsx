import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { KeywordManager } from '@/components/KeywordManager';
import { DocumentViewer } from '@/components/DocumentViewer';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { KeywordFilter } from '@/components/KeywordFilter';
import { KeywordDensity } from '@/components/KeywordDensity';
import { ComparisonMode } from '@/components/ComparisonMode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';

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

const STORAGE_KEYS = {
  KEYWORDS: 'wordlens-keywords',
  HIGHLIGHT_ENABLED: 'wordlens-highlight-enabled',
  CASE_SENSITIVE: 'wordlens-case-sensitive'
};

const DEFAULT_KEYWORDS: Keyword[] = [
  { id: '1', word: 'respect', color: '#fbbf24', count: 0 },
  { id: '2', word: 'inclusion', color: '#34d399', count: 0 },
  { id: '3', word: 'diversity', color: '#60a5fa', count: 0 },
];

const Index = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  // Load keywords and settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedKeywords = localStorage.getItem(STORAGE_KEYS.KEYWORDS);
      const savedHighlightEnabled = localStorage.getItem(STORAGE_KEYS.HIGHLIGHT_ENABLED);
      const savedCaseSensitive = localStorage.getItem(STORAGE_KEYS.CASE_SENSITIVE);

      if (savedKeywords) {
        const parsedKeywords = JSON.parse(savedKeywords);
        if (Array.isArray(parsedKeywords) && parsedKeywords.length > 0) {
          setKeywords(parsedKeywords);
        } else {
          setKeywords(DEFAULT_KEYWORDS);
        }
      } else {
        setKeywords(DEFAULT_KEYWORDS);
      }

      if (savedHighlightEnabled !== null) {
        setHighlightEnabled(savedHighlightEnabled === 'true');
      }

      if (savedCaseSensitive !== null) {
        setCaseSensitive(savedCaseSensitive === 'true');
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setKeywords(DEFAULT_KEYWORDS);
    }
  }, []);

  // Save keywords to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(keywords));
    } catch (error) {
      console.error('Error saving keywords to localStorage:', error);
    }
  }, [keywords]);

  // Save highlight setting to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHT_ENABLED, highlightEnabled.toString());
    } catch (error) {
      console.error('Error saving highlight setting to localStorage:', error);
    }
  }, [highlightEnabled]);

  // Save case sensitive setting to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CASE_SENSITIVE, caseSensitive.toString());
    } catch (error) {
      console.error('Error saving case sensitive setting to localStorage:', error);
    }
  }, [caseSensitive]);

  const addKeyword = useCallback((word: string, color: string) => {
    if (!word?.trim() || !color) {
      console.error('Invalid keyword or color provided');
      return;
    }

    const newKeyword: Keyword = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      word: word.toLowerCase().trim(),
      color,
      count: 0
    };

    setKeywords(prevKeywords => {
      // Prevent duplicates
      const isDuplicate = prevKeywords.some(k => k.word === newKeyword.word);
      if (isDuplicate) {
        return prevKeywords;
      }
      return [...prevKeywords, newKeyword];
    });
  }, []);

  const removeKeyword = useCallback((id: string) => {
    if (!id) {
      console.error('Invalid keyword id provided');
      return;
    }

    setKeywords(prevKeywords => prevKeywords.filter(k => k.id !== id));
  }, []);

  const updateKeywordCounts = useCallback((counts: Record<string, number>) => {
    if (!counts || typeof counts !== 'object') {
      console.error('Invalid counts provided');
      return;
    }

    setKeywords(prevKeywords => 
      prevKeywords.map(keyword => ({
        ...keyword,
        count: counts[keyword.word] || 0
      }))
    );
  }, []);

  const handleDocumentUpload = useCallback((newDocument: DocumentData) => {
    if (!newDocument || !newDocument.content) {
      console.error('Invalid document provided');
      return;
    }
    setDocument(newDocument);
  }, []);

  const handleToggleHighlight = useCallback((enabled: boolean) => {
    setHighlightEnabled(enabled);
  }, []);

  const handleToggleCaseSensitive = useCallback((enabled: boolean) => {
    setCaseSensitive(enabled);
  }, []);

  const handleEnterComparisonMode = useCallback(() => {
    setIsComparisonMode(true);
  }, []);

  const handleExitComparisonMode = useCallback(() => {
    setIsComparisonMode(false);
  }, []);

  if (isComparisonMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ComparisonMode 
            onBack={handleExitComparisonMode}
            initialKeywords={keywords}
          />
        </main>
      </div>
    );
  }

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
              <FileUpload onDocumentUpload={handleDocumentUpload} />
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Or compare multiple documents side by side
                  </p>
                  <Button 
                    onClick={handleEnterComparisonMode}
                    variant="outline"
                    className="bg-blue-50 hover:bg-blue-100"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Compare Documents
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Analysis Mode</h3>
                  <Button 
                    onClick={handleEnterComparisonMode}
                    variant="outline"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Compare
                  </Button>
                </div>
                
                <KeywordManager
                  keywords={keywords}
                  onAddKeyword={addKeyword}
                  onRemoveKeyword={removeKeyword}
                  highlightEnabled={highlightEnabled}
                  onToggleHighlight={handleToggleHighlight}
                  caseSensitive={caseSensitive}
                  onToggleCaseSensitive={handleToggleCaseSensitive}
                  documentContent={document.content}
                  document={document}
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
                  caseSensitive={caseSensitive}
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
