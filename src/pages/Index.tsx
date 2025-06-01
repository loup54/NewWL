
import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { DocumentViewer } from '@/components/DocumentViewer';
import { KeywordManager } from '@/components/KeywordManager';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { EnhancedAnalyticsDashboard } from '@/components/EnhancedAnalyticsDashboard';
import { DocumentComparison } from '@/components/DocumentComparison';
import { KeywordDensity } from '@/components/KeywordDensity';
import { ExportTemplates } from '@/components/ExportTemplates';
import { ExportScheduler } from '@/components/ExportScheduler';
import { BatchExport } from '@/components/BatchExport';
import { MobileDocumentViewer } from '@/components/MobileDocumentViewer';
import { MobileKeywordManager } from '@/components/MobileKeywordManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Settings, Download, Calendar } from 'lucide-react';

export interface DocumentData {
  id: string;
  filename: string;
  content: string;
  uploadDate: Date;
  fileSize: number;
  fileType: string;
}

export interface Keyword {
  id: string;
  word: string;
  color: string;
  count: number;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [keywordCounts, setKeywordCounts] = useState<Record<string, number>>({});

  const handleFileUpload = useCallback((files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newDocument: DocumentData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          filename: file.name,
          content: content,
          uploadDate: new Date(),
          fileSize: file.size,
          fileType: file.type
        };
        
        setDocuments(prev => [...prev, newDocument]);
        if (!selectedDocument) {
          setSelectedDocument(newDocument);
        }
      };
      reader.readAsText(file);
    });
  }, [selectedDocument]);

  const handleDocumentUpload = useCallback((document: DocumentData) => {
    setDocuments(prev => [...prev, document]);
    if (!selectedDocument) {
      setSelectedDocument(document);
    }
  }, [selectedDocument]);

  const handleAddKeyword = useCallback((word: string, color: string) => {
    const newKeyword: Keyword = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      word,
      color,
      count: 0
    };
    setKeywords(prev => [...prev, newKeyword]);
  }, []);

  const handleRemoveKeyword = useCallback((id: string) => {
    setKeywords(prev => prev.filter(k => k.id !== id));
  }, []);

  const handleKeywordCountsUpdate = useCallback((counts: Record<string, number>) => {
    setKeywordCounts(counts);
    setKeywords(prev => prev.map(keyword => ({
      ...keyword,
      count: counts[keyword.word] || 0
    })));
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4 space-y-4">
          {!selectedDocument ? (
            <FileUpload onDocumentUpload={handleDocumentUpload} />
          ) : (
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="document">
                <MobileDocumentViewer
                  document={selectedDocument}
                  keywords={keywords}
                  highlightEnabled={highlightEnabled}
                  caseSensitive={caseSensitive}
                  onKeywordCountsUpdate={handleKeywordCountsUpdate}
                />
              </TabsContent>
              <TabsContent value="keywords">
                <MobileKeywordManager
                  keywords={keywords}
                  onAddKeyword={handleAddKeyword}
                  onRemoveKeyword={handleRemoveKeyword}
                  highlightEnabled={highlightEnabled}
                  onToggleHighlight={setHighlightEnabled}
                  caseSensitive={caseSensitive}
                  onToggleCaseSensitive={setCaseSensitive}
                />
              </TabsContent>
              <TabsContent value="analytics">
                <div className="space-y-4">
                  <AnalyticsDashboard keywords={keywords} document={selectedDocument} />
                  <KeywordDensity keywords={keywords} document={selectedDocument} />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {documents.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onDocumentUpload={handleDocumentUpload} />
          </div>
        ) : (
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
                <Badge variant="secondary" className="ml-1">Charts</Badge>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Compare
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Automation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DocumentViewer
                    document={selectedDocument}
                    keywords={keywords}
                    highlightEnabled={highlightEnabled}
                    caseSensitive={caseSensitive}
                    onKeywordCountsUpdate={handleKeywordCountsUpdate}
                  />
                </div>
                <div className="space-y-6">
                  <KeywordManager
                    keywords={keywords}
                    onAddKeyword={handleAddKeyword}
                    onRemoveKeyword={handleRemoveKeyword}
                    highlightEnabled={highlightEnabled}
                    onToggleHighlight={setHighlightEnabled}
                    caseSensitive={caseSensitive}
                    onToggleCaseSensitive={setCaseSensitive}
                  />
                  <FileUpload onDocumentUpload={handleDocumentUpload} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Document Analytics Dashboard
                    </CardTitle>
                    <CardDescription>
                      Comprehensive visualizations of keyword frequency, distribution, and document insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Standard Analytics</h3>
                        <AnalyticsDashboard keywords={keywords} document={selectedDocument} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Enhanced Analytics</h3>
                        <EnhancedAnalyticsDashboard keywords={keywords} document={selectedDocument} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {selectedDocument && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Keyword Density Analysis</CardTitle>
                      <CardDescription>
                        Detailed density metrics for "{selectedDocument.filename}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <KeywordDensity keywords={keywords} document={selectedDocument} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Comparison</CardTitle>
                  <CardDescription>
                    Compare keyword usage across multiple documents with visual charts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentComparison documents={documents} keywords={keywords} keywordCounts={keywordCounts} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="mt-6">
              <ExportTemplates />
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ExportScheduler />
                <BatchExport documents={documents} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
