
import React, { useState } from 'react';
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
  console.log('Index component starting render');
  
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  console.log('State initialized, documents:', documents);

  const handleDocumentUpload = (document: DocumentData) => {
    console.log('Document uploaded:', document.filename);
    setDocuments(prev => [...prev, document]);
    setShowWelcome(false);
  };

  const handleDocumentRemove = (index: number) => {
    console.log('Removing document at index:', index);
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleMultiUpload = () => {
    console.log('Toggling multi-upload mode');
    setShowMultiUpload(!showMultiUpload);
  };

  const handleStartTour = () => {
    console.log('Starting tour');
    setShowWelcome(false);
  };

  const handleSkipTour = () => {
    console.log('Skipping tour');
    setShowWelcome(false);
  };

  console.log('About to render JSX');

  // Show welcome tutorial when first visiting and no documents uploaded
  if (showWelcome && documents.length === 0) {
    return <WelcomeTutorial onStartTour={handleStartTour} onSkip={handleSkipTour} />;
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
