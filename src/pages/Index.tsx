
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

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
  
  try {
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    console.log('State initialized, documents:', documents);

    const handleUploadClick = () => {
      console.log('Upload button clicked');
    };

    console.log('About to render JSX');
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WordLens</h1>
                <p className="text-sm text-gray-600">Insight Engine</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Welcome to WordLens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your document analysis tool is ready. Upload a document to get started.
              </p>
              <Button className="w-full" onClick={handleUploadClick}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ERROR in Index component:', error);
    throw error;
  }
};

export default Index;
