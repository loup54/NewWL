import React, { useState } from 'react';
import { DocumentUpload } from '../components/DocumentUpload';
import { DocumentComparison } from '../components/DocumentComparison';
import { DocumentAnalysisService } from '../integrations/document-analysis.service';
import { Document, DocumentComparison as DocumentComparisonType } from '../types/document-analysis';

export const DocumentComparisonPage: React.FC = () => {
  const [doc1, setDoc1] = useState<Document | null>(null);
  const [doc2, setDoc2] = useState<Document | null>(null);
  const [comparison, setComparison] = useState<DocumentComparisonType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDoc1Upload = async (file: File) => {
    try {
      const content = await file.text(); // In a real app, you'd use proper file parsing
      setDoc1({
        id: crypto.randomUUID(),
        name: file.name,
        content,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
        createdAt: new Date(),
      });
    } catch (err) {
      setError('Failed to process document 1');
    }
  };

  const handleDoc2Upload = async (file: File) => {
    try {
      const content = await file.text(); // In a real app, you'd use proper file parsing
      setDoc2({
        id: crypto.randomUUID(),
        name: file.name,
        content,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
        createdAt: new Date(),
      });
    } catch (err) {
      setError('Failed to process document 2');
    }
  };

  const handleCompare = async () => {
    if (!doc1 || !doc2) {
      setError('Please upload both documents to compare');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = new DocumentAnalysisService(process.env.REACT_APP_OPENAI_API_KEY || '');
      const result = await service.compareDocuments(doc1, doc2);
      setComparison(result);
    } catch (err) {
      setError('Failed to compare documents');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Document Comparison</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Document 1</h2>
          <DocumentUpload
            onUpload={handleDoc1Upload}
            acceptedFileTypes={['.pdf', '.doc', '.docx']}
            maxSize={10 * 1024 * 1024} // 10MB
          />
          {doc1 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{doc1.name}</p>
              <p className="text-sm text-gray-600">
                Uploaded: {doc1.createdAt.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Document 2</h2>
          <DocumentUpload
            onUpload={handleDoc2Upload}
            acceptedFileTypes={['.pdf', '.doc', '.docx']}
            maxSize={10 * 1024 * 1024} // 10MB
          />
          {doc2 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{doc2.name}</p>
              <p className="text-sm text-gray-600">
                Uploaded: {doc2.createdAt.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-center mb-8">
        <button
          onClick={handleCompare}
          disabled={!doc1 || !doc2 || isLoading}
          className={`px-6 py-3 rounded-lg font-medium ${
            !doc1 || !doc2 || isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Comparing...' : 'Compare Documents'}
        </button>
      </div>

      {comparison && (
        <div className="mt-8">
          <DocumentComparison comparison={comparison} />
        </div>
      )}
    </div>
  );
}; 