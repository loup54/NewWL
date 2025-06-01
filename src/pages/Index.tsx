import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { KeywordManager } from '@/components/KeywordManager';
import { DocumentViewer } from '@/components/DocumentViewer';
import { MobileDocumentViewer } from '@/components/MobileDocumentViewer';
import { MobileKeywordManager } from '@/components/MobileKeywordManager';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { KeywordFilter } from '@/components/KeywordFilter';
import { KeywordDensity } from '@/components/KeywordDensity';
import { ComparisonMode } from '@/components/ComparisonMode';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { LoadingState, FadeTransition, SuccessAnimation } from '@/components/LoadingStates';
import { OnboardingTour } from '@/components/OnboardingTour';
import { WelcomeTutorial } from '@/components/WelcomeTutorial';
import { FeatureTooltip, HelpTooltip } from '@/components/ContextualTooltips';
import { TouchOptimizedButton } from '@/components/TouchOptimizedButton';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Smartphone, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { DocumentSkeleton, KeywordManagerSkeleton } from '@/components/DocumentSkeleton';
import { PageTransition, ScaleTransition } from '@/components/PageTransition';
import { NoDocumentState, NoKeywordsState } from '@/components/EmptyStates';
import { FileUploadError, ProcessingError } from '@/components/ErrorStates';

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'upload' | 'processing' | 'export'>('upload');
  const [isMobileView, setIsMobileView] = useState(false);

  const { isFirstVisit, showTour, completeOnboarding, completeTour } = useOnboarding();
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

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

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      const isDuplicate = prevKeywords.some(k => k.word === newKeyword.word);
      if (isDuplicate) {
        toast.error('Keyword already exists');
        return prevKeywords;
      }
      toast.success(`Added keyword: ${newKeyword.word}`);
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

  const handleDocumentUpload = useCallback(async (newDocument: DocumentData) => {
    if (!newDocument || !newDocument.content) {
      console.error('Invalid document provided');
      return;
    }
    
    setIsLoading(true);
    setLoadingType('processing');
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDocument(newDocument);
    setIsLoading(false);
    toast.success(`Document "${newDocument.filename}" loaded successfully!`);
  }, []);

  // Keyboard shortcut handlers
  const handleAddKeywordShortcut = useCallback(() => {
    keywordInputRef.current?.focus();
  }, []);

  const handleUploadShortcut = useCallback(() => {
    fileUploadRef.current?.click();
  }, []);

  const handleExportShortcut = useCallback(() => {
    if (document && keywords.length > 0) {
      toast.info('Export options available in the sidebar');
    } else {
      toast.error('Upload a document and add keywords first');
    }
  }, [document, keywords]);

  const handleToggleHighlight = useCallback((enabled?: boolean) => {
    const newValue = enabled !== undefined ? enabled : !highlightEnabled;
    setHighlightEnabled(newValue);
    toast.success(`Highlighting ${newValue ? 'enabled' : 'disabled'}`);
  }, [highlightEnabled]);

  const handleToggleCaseSensitive = useCallback((enabled: boolean) => {
    setCaseSensitive(enabled);
  }, []);

  const handleEnterComparisonMode = useCallback(() => {
    setIsComparisonMode(true);
  }, []);

  const handleExitComparisonMode = useCallback(() => {
    setIsComparisonMode(false);
  }, []);

  const handleStartTour = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const handleSkipTour = useCallback(() => {
    completeOnboarding();
    completeTour();
  }, [completeOnboarding, completeTour]);

  if (isComparisonMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <FadeTransition>
            <ComparisonMode 
              onBack={handleExitComparisonMode}
              initialKeywords={keywords}
            />
          </FadeTransition>
        </main>
        <KeyboardShortcuts
          onAddKeyword={handleAddKeywordShortcut}
          onUploadDocument={handleUploadShortcut}
          onExport={handleExportShortcut}
          onToggleHighlight={() => handleToggleHighlight()}
        />
      </div>
    );
  }

  // Show welcome tutorial for first-time visitors
  if (isFirstVisit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <WelcomeTutorial 
            onStartTour={handleStartTour}
            onSkip={handleSkipTour}
          />
        </main>
        <OnboardingTour
          isFirstVisit={showTour}
          onComplete={completeTour}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <PageTransition>
            <div className="max-w-4xl mx-auto">
              {isMobileView ? (
                <div className="space-y-4">
                  <DocumentSkeleton />
                </div>
              ) : (
                <div className="grid lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1">
                    <KeywordManagerSkeleton />
                  </div>
                  <div className="lg:col-span-3">
                    <DocumentSkeleton />
                  </div>
                </div>
              )}
            </div>
          </PageTransition>
        ) : !document ? (
          <div className="max-w-4xl mx-auto">
            <PageTransition>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  WordLens Insight Engine
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Analyze documents for meaningful themes like respect, inclusion, and diversity. 
                  Upload your document to get started with intelligent keyword tracking and analytics.
                </p>
              </div>
              
              <ScaleTransition>
                <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <FileUpload 
                    onDocumentUpload={handleDocumentUpload} 
                    ref={fileUploadRef}
                  />
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Or compare multiple documents side by side
                      </p>
                      <FeatureTooltip
                        title="Document Comparison"
                        description="Upload multiple documents and compare keyword usage across them with detailed analytics."
                      >
                        <TouchOptimizedButton 
                          onClick={handleEnterComparisonMode}
                          variant="outline"
                          className="bg-blue-50 hover:bg-blue-100"
                          touchTarget="medium"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Compare Documents
                        </TouchOptimizedButton>
                      </FeatureTooltip>
                    </div>
                  </div>
                </Card>
              </ScaleTransition>
            </PageTransition>
          </div>
        ) : (
          <PageTransition>
            {isMobileView ? (
              // Mobile Layout
              <div className="space-y-4">
                <Tabs defaultValue="document" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="document" className="touch-manipulation">
                      <FileText className="w-4 h-4 mr-1" />
                      Document
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="touch-manipulation">
                      Keywords
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="touch-manipulation">
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="document" className="h-[calc(100vh-200px)]">
                    <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                      <MobileDocumentViewer
                        document={document}
                        keywords={keywords}
                        highlightEnabled={highlightEnabled}
                        caseSensitive={caseSensitive}
                        onKeywordCountsUpdate={updateKeywordCounts}
                      />
                    </Card>
                  </TabsContent>

                  <TabsContent value="keywords">
                    <MobileKeywordManager
                      keywords={keywords}
                      onAddKeyword={addKeyword}
                      onRemoveKeyword={removeKeyword}
                      highlightEnabled={highlightEnabled}
                      onToggleHighlight={handleToggleHighlight}
                      caseSensitive={caseSensitive}
                      onToggleCaseSensitive={handleToggleCaseSensitive}
                    />
                  </TabsContent>

                  <TabsContent value="analytics">
                    <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                      <AnalyticsDashboard keywords={keywords} document={document} />
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="text-center">
                  <TouchOptimizedButton 
                    onClick={handleEnterComparisonMode}
                    variant="outline"
                    className="bg-blue-50 hover:bg-blue-100"
                    touchTarget="medium"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Compare Documents
                  </TouchOptimizedButton>
                </div>
              </div>
            ) : (
              // Desktop Layout
              <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <ScaleTransition>
                    <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">Analysis Mode</h3>
                          <HelpTooltip content="Add keywords to track and analyze in your document. Use predefined categories or create custom ones." />
                        </div>
                        <FeatureTooltip
                          title="Comparison Mode"
                          description="Switch to comparison mode to analyze multiple documents side by side."
                        >
                          <Button 
                            onClick={handleEnterComparisonMode}
                            variant="outline"
                            size="sm"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Compare
                          </Button>
                        </FeatureTooltip>
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
                        ref={keywordInputRef}
                      />
                    </Card>
                  </ScaleTransition>
                  
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
          </PageTransition>
        )}
      </main>

      <KeyboardShortcuts
        onAddKeyword={handleAddKeywordShortcut}
        onUploadDocument={handleUploadShortcut}
        onExport={handleExportShortcut}
        onToggleHighlight={() => handleToggleHighlight()}
      />

      <OnboardingTour
        isFirstVisit={showTour}
        onComplete={completeTour}
      />

      <PWAInstallBanner />
    </div>
  );
};

export default Index;
