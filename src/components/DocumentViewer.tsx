
import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Keyword, DocumentData } from '@/pages/Index';

interface DocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
  onKeywordCountsUpdate
}) => {
  const [highlightedContent, setHighlightedContent] = useState('');

  useEffect(() => {
    if (!document.content) return;

    let content = document.content;
    const counts: Record<string, number> = {};

    if (highlightEnabled && keywords.length > 0) {
      // Count occurrences and highlight
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.word}\\b`, 'gi');
        const matches = content.match(regex) || [];
        counts[keyword.word] = matches.length;

        if (matches.length > 0) {
          content = content.replace(
            regex,
            `<mark style="background-color: ${keyword.color}; padding: 2px 4px; border-radius: 3px; color: #000;">$&</mark>`
          );
        }
      });
    } else {
      // Count without highlighting
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.word}\\b`, 'gi');
        const matches = content.match(regex) || [];
        counts[keyword.word] = matches.length;
      });
    }

    setHighlightedContent(content);
    onKeywordCountsUpdate(counts);
  }, [document.content, keywords, highlightEnabled, onKeywordCountsUpdate]);

  const handleExport = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyzed_${document.filename}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{document.filename}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{document.uploadDate.toLocaleDateString()}</span>
                </div>
                <span>{document.content.length.toLocaleString()} characters</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleExport}
            variant="outline"
            className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div 
          className="prose prose-lg max-w-none leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
          style={{ 
            lineHeight: '1.8',
            fontSize: '16px',
            whiteSpace: 'pre-wrap'
          }}
        />
      </div>
    </div>
  );
};
