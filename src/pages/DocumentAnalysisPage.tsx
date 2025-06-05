import React, { useState } from 'react';
import { Document, DocumentAnalysis as DocumentAnalysisType } from '../types/document-analysis';
import { DocumentUpload } from '../components/DocumentUpload';
import { DocumentAnalysis } from '../components/DocumentAnalysis';
import { DocumentAnalysisService } from '../integrations/document-analysis.service';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

export default function DocumentAnalysisPage() {
  const [document, setDocument] = useState<Document | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the document analysis service
  const analysisService = new DocumentAnalysisService(process.env.OPENAI_API_KEY || '');

  const handleDocumentUpload = async (uploadedDocument: Document) => {
    setDocument(uploadedDocument);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!document) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analysisService.analyzeDocument(document);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Document Analysis</h1>

      <div className="space-y-8">
        {/* Document Upload Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <DocumentUpload onDocumentUpload={handleDocumentUpload} />
        </section>

        {/* Analysis Controls */}
        {document && !analysis && (
          <section className="flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full max-w-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Document'
              )}
            </Button>
          </section>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <DocumentAnalysis analysis={analysis} />
          </section>
        )}
      </div>
    </div>
  );
} 