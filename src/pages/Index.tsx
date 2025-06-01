
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Plus } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { MultiDocumentUpload } from '@/components/MultiDocumentUpload';

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
  
  console.log('State initialized, documents:', documents);

  const handleDocumentUpload = (document: DocumentData) => {
    console.log('Document uploaded:', document.filename);
    setDocuments(prev => [...prev, document]);
  };

  const handleDocumentRemove = (index: number) => {
    console.log('Removing document at index:', index);
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleMultiUpload = () => {
    console.log('Toggling multi-upload mode');
    setShowMultiUpload(!showMultiUpload);
  };

  console.log('About to render JSX');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WordLens</h1>
                <p className="text-sm text-gray-600">Insight Engine</p>
              </div>
            </div>
            
            {documents.length > 0 && (
              <Button
                variant="outline"
                onClick={toggleMultiUpload}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {showMultiUpload ? 'Single Upload' : 'Compare Documents'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
