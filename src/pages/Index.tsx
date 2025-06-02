
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Plus } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { MultiDocumentUpload } from '@/components/MultiDocumentUpload';
import { WelcomeTutorial } from '@/components/WelcomeTutorial';
import { VoucherPayment } from '@/components/VoucherPayment';
import { Header } from '@/components/Header';

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
  const [documents, setDocuments] = useState([]);
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple initialization for iOS compatibility
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDocumentUpload = (document) => {
    setDocuments(prev => [...prev, document]);
    setShowWelcome(false);
  };

  const handleDocumentRemove = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleMultiUpload = () => {
    setShowMultiUpload(!showMultiUpload);
  };

  const handleStartTour = () => {
    setShowWelcome(false);
  };

  const handleSkipTour = () => {
    setShowWelcome(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WordLens...</p>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (showWelcome && documents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WelcomeTutorial onStartTour={handleStartTour} onSkip={handleSkipTour} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {documents.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Welcome to WordLens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Your document analysis tool is ready. Upload a document to get started with keyword analysis and insights.
                  </p>
                  <FileUpload onDocumentUpload={handleDocumentUpload} />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Document Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {showMultiUpload ? (
                        <MultiDocumentUpload
                          documents={documents}
                          onDocumentUpload={handleDocumentUpload}
                          onDocumentRemove={handleDocumentRemove}
                          maxDocuments={3}
                        />
                      ) : (
                        <FileUpload onDocumentUpload={handleDocumentUpload} />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{doc.filename}</span>
                            <span className="text-xs text-gray-500">
                              ({(doc.fileSize / 1024).toFixed(1)} KB)
                            </span>
                            <span className="text-xs text-gray-400">
                              {doc.uploadDate.toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDocumentRemove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {documents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Document Comparison
                        <Button
                          variant="outline"
                          onClick={toggleMultiUpload}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {showMultiUpload ? 'Single Upload' : 'Compare Documents'}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <VoucherPayment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
