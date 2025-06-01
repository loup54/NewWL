import React, { useEffect, useState, useCallback } from 'react';
import { Keyword, DocumentData } from '@/pages/Index';
import { getDocumentStats } from '@/utils/fileTypeUtils';
import { cleanRTFContent } from '@/utils/contentProcessor';
import { DocumentHeader } from './DocumentHeader';

interface DocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  caseSensitive: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
  caseSensitive,
  onKeywordCountsUpdate
}) => {
  const [highlightedContent, setHighlightedContent] = useState('');

  const processContent = useCallback(() => {
    if (!document?.content || !Array.isArray(keywords)) {
      setHighlightedContent(document?.content || '');
      onKeywordCountsUpdate({});
      return;
    }

    // Clean RTF formatting first
    const cleanedContent = cleanRTFContent(document.content);
    let content = cleanedContent;
    const counts: Record<string, number> = {};

    try {
      if (highlightEnabled && keywords.length > 0) {
        // Count occurrences and highlight
        keywords.forEach(keyword => {
          if (!keyword?.word) return;
          
          try {
            const escapedKeyword = keyword.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexFlags = caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, regexFlags);
            const matches = content.match(regex) || [];
            counts[keyword.word] = matches.length;

            if (matches.length > 0 && keyword.color) {
              content = content.replace(
                regex,
                `<mark style="background-color: ${keyword.color}; padding: 2px 4px; border-radius: 3px; color: #000;">$&</mark>`
              );
            }
          } catch (regexError) {
            console.error('Regex error for keyword:', keyword.word, regexError);
            counts[keyword.word] = 0;
          }
        });
      } else {
        // Count without highlighting
        keywords.forEach(keyword => {
          if (!keyword?.word) return;
          
          try {
            const escapedKeyword = keyword.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexFlags = caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, regexFlags);
            const matches = content.match(regex) || [];
            counts[keyword.word] = matches.length;
          } catch (regexError) {
            console.error('Regex error for keyword:', keyword.word, regexError);
            counts[keyword.word] = 0;
          }
        });
      }

      setHighlightedContent(content);
      onKeywordCountsUpdate(counts);
    } catch (error) {
      console.error('Error processing content:', error);
      setHighlightedContent(cleanedContent);
      onKeywordCountsUpdate({});
    }
  }, [document?.content, keywords, highlightEnabled, caseSensitive, onKeywordCountsUpdate]);

  useEffect(() => {
    processContent();
  }, [processContent]);

  const handleExport = useCallback(() => {
    if (!document?.content || !document?.filename) {
      console.error('No document content or filename available for export');
      return;
    }

    try {
      const blob = new Blob([document.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `analyzed_${document.filename}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting document:', error);
    }
  }, [document]);

  if (!document) {
    return <div>No document loaded</div>;
  }

  const stats = getDocumentStats(document.content || '');

  return (
    <div className="h-full flex flex-col">
      <DocumentHeader 
        document={document} 
        onExport={handleExport} 
        documentStats={stats} 
      />

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
