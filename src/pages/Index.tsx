
import React, { useState, useCallback, useRef } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { OptimizedDocumentViewer } from '@/components/OptimizedDocumentViewer';
import { KeywordManager } from '@/components/KeywordManager';
import { EnhancedAnalyticsDashboard } from '@/components/EnhancedAnalyticsDashboard';
import { EnhancedExportOptions } from '@/components/EnhancedExportOptions';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Keyword, DocumentData } from '@/types';
import { toast } from 'sonner';

const Index = () => {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordCounts, setKeywordCounts] = useState<Record<string, number>>({});
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  console.log('Index: Rendering main app with direct access - no authentication required');

  const handleDocumentUpload = useCallback((uploadedDocument: DocumentData) => {
    console.log('Document uploaded successfully:', uploadedDocument.filename);
    setDocument(uploadedDocument);
    setKeywords([]);
    setKeywordCounts({});
    toast.success(`Document "${uploadedDocument.filename}" loaded successfully!`);
  }, []);

  const handleAddKeyword = useCallback((word: string, color: string) => {
    console.log('Adding keyword:', word);
    const newKeyword: Keyword = {
      id: Date.now().toString(),
      word,
      color,
      count: 0
    };
    setKeywords(prev => [...prev, newKeyword]);
    toast.success(`Keyword "${word}" added successfully!`);
  }, []);

  const handleRemoveKeyword = useCallback((id: string) => {
    const keywordToRemove = keywords.find(k => k.id === id);
    console.log('Removing keyword:', keywordToRemove?.word);
    setKeywords(prev => prev.filter(keyword => keyword.id !== id));
    if (keywordToRemove) {
      toast.success(`Keyword "${keywordToRemove.word}" removed`);
    }
  }, [keywords]);

  const handleKeywordCountsUpdate = useCallback((counts: Record<string, number>) => {
    console.log('Updating keyword counts:', counts);
    setKeywordCounts(counts);
    
    // Update keyword counts in the keywords array
    setKeywords(prevKeywords => 
      prevKeywords.map(keyword => ({
        ...keyword,
        count: counts[keyword.word] || 0
      }))
    );
  }, []);

  const totalKeywordOccurrences = Object.values(keywordCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!document ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                WordLens - Document Analysis Tool
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Advanced Document Analysis & Keyword Tracking - Ready to Use!
              </p>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="font-semibold">✅ Full Access Available - No Login Required</p>
                <p className="text-sm">Upload documents and start analyzing immediately!</p>
              </div>
            </div>
            
            <FileUpload 
              ref={fileUploadRef}
              onDocumentUpload={handleDocumentUpload} 
            />
            
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Upload a PDF, DOCX, or TXT file to begin keyword analysis
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Document Info */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Document</h3>
                    <Badge variant="outline" className="text-xs">
                      {(document.fileSize! / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate" title={document.filename}>
                    {document.filename}
                  </p>
                  <button
                    onClick={() => {
                      console.log('Resetting document');
                      setDocument(null);
                      setKeywords([]);
                      setKeywordCounts({});
                      toast.success('Document cleared');
                    }}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Upload New Document
                  </button>
                </div>
              </Card>

              {/* Highlight Controls */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Display Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Highlight Keywords</span>
                    <Switch
                      checked={highlightEnabled}
                      onCheckedChange={setHighlightEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Case Sensitive</span>
                    <Switch
                      checked={caseSensitive}
                      onCheckedChange={setCaseSensitive}
                    />
                  </div>
                </div>
              </Card>

              {/* Keywords Summary */}
              {keywords.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Keywords:</span>
                      <span className="font-medium">{keywords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Occurrences:</span>
                      <span className="font-medium">{totalKeywordOccurrences}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Keyword Manager */}
              <KeywordManager
                keywords={keywords}
                onAddKeyword={handleAddKeyword}
                onRemoveKeyword={handleRemoveKeyword}
                highlightEnabled={highlightEnabled}
                onToggleHighlight={setHighlightEnabled}
                caseSensitive={caseSensitive}
                onToggleCaseSensitive={setCaseSensitive}
                documentContent={document.content}
                document={document}
                keywordCounts={keywordCounts}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="document" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="document">Document</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                
                <TabsContent value="document" className="mt-4">
                  <Card className="h-[calc(100vh-12rem)]">
                    <OptimizedDocumentViewer
                      document={document}
                      keywords={keywords}
                      highlightEnabled={highlightEnabled}
                      caseSensitive={caseSensitive}
                      onKeywordCountsUpdate={handleKeywordCountsUpdate}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-4">
                  <div className="h-[calc(100vh-12rem)] overflow-auto">
                    <EnhancedAnalyticsDashboard
                      keywords={keywords}
                      document={document}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="export" className="mt-4">
                  <div className="h-[calc(100vh-12rem)] overflow-auto">
                    <EnhancedExportOptions
                      keywords={keywords}
                      document={document}
                      keywordCounts={keywordCounts}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
