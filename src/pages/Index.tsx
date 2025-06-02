
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

// Test basic JavaScript execution
try {
  console.log('WordLens app initializing...');
  console.log('User agent:', navigator.userAgent);
  console.log('Platform:', navigator.platform);
} catch (e) {
  // Fallback for environments where console might not be available
  window.alert && window.alert('WordLens loading...');
}

const Index = () => {
  // Use simpler state initialization for better iOS compatibility
  const [documents, setDocuments] = useState([]);
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Simplified useEffect for iOS compatibility
  useEffect(() => {
    try {
      console.log('Index component mounted successfully');
      
      // Simple timeout to ensure rendering works
      const timer = setTimeout(() => {
        console.log('Component ready');
      }, 50);
      
      return () => {
        clearTimeout(timer);
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
      setHasError(true);
    }
  }, []);

  const handleDocumentUpload = (document) => {
    try {
      console.log('Document uploaded:', document.filename);
      setDocuments(prev => [...prev, document]);
      setShowWelcome(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      setHasError(true);
    }
  };

  const handleDocumentRemove = (index) => {
    try {
      console.log('Removing document at index:', index);
      setDocuments(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };

  const toggleMultiUpload = () => {
    try {
      console.log('Toggling multi-upload mode');
      setShowMultiUpload(!showMultiUpload);
    } catch (error) {
      console.error('Error toggling multi-upload:', error);
    }
  };

  const handleStartTour = () => {
    try {
      console.log('Starting tour');
      setShowWelcome(false);
    } catch (error) {
      console.error('Error starting tour:', error);
    }
  };

  const handleSkipTour = () => {
    try {
      console.log('Skipping tour');
      setShowWelcome(false);
    } catch (error) {
      console.error('Error skipping tour:', error);
    }
  };

  // Error fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">WordLens</h1>
          <p className="text-gray-600 mb-4">Loading issue detected. Please refresh the page.</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Simple welcome check
  if (showWelcome && documents.length === 0) {
    try {
      console.log('Rendering welcome tutorial');
      return (
        <div className="min-h-screen bg-gray-50">
          <WelcomeTutorial onStartTour={handleStartTour} onSkip={handleSkipTour} />
        </div>
      );
    } catch (error) {
      console.error('Error rendering welcome tutorial:', error);
      // Fallback to main content
      setShowWelcome(false);
    }
  }
  
  console.log('Rendering main application');
  
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
