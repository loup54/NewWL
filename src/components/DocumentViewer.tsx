
import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Keyword, DocumentData } from '@/pages/Index';

interface DocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

const cleanRTFContent = (content: string): string => {
  if (!content) return '';
  
  // Remove RTF control codes and formatting
  let cleanedContent = content
    // Remove RTF header and control words
    .replace(/\\rtf\d+/g, '')
    .replace(/\\ansi/g, '')
    .replace(/\\ansicpg\d+/g, '')
    .replace(/\\cocoartf\d+/g, '')
    .replace(/\\deff\d+/g, '')
    .replace(/\\deflang\d+/g, '')
    .replace(/\\fonttbl[^}]*}/g, '')
    .replace(/\\colortbl[^}]*}/g, '')
    .replace(/\\stylesheet[^}]*}/g, '')
    .replace(/\\info[^}]*}/g, '')
    // Remove font formatting
    .replace(/\\f\d+/g, '')
    .replace(/\\fs\d+/g, '')
    .replace(/\\cf\d+/g, '')
    .replace(/\\cb\d+/g, '')
    .replace(/\\highlight\d+/g, '')
    // Remove paragraph formatting
    .replace(/\\par\b/g, '\n')
    .replace(/\\pard/g, '')
    .replace(/\\pardeftab\d+/g, '')
    .replace(/\\sl\d+/g, '')
    .replace(/\\slmult\d+/g, '')
    .replace(/\\sb\d+/g, '')
    .replace(/\\sa\d+/g, '')
    // Remove text formatting
    .replace(/\\b\b/g, '')
    .replace(/\\i\b/g, '')
    .replace(/\\ul\b/g, '')
    .replace(/\\ulnone/g, '')
    .replace(/\\strike/g, '')
    .replace(/\\striked\d+/g, '')
    // Remove other common RTF codes
    .replace(/\\tab/g, '\t')
    .replace(/\\line/g, '\n')
    .replace(/\\page/g, '\n\n')
    .replace(/\\sect/g, '')
    .replace(/\\sectd/g, '')
    // Remove remaining control words (backslash followed by letters and optional number)
    .replace(/\\[a-zA-Z]+\d*/g, '')
    // Remove remaining control symbols
    .replace(/\\[^a-zA-Z\s]/g, '')
    // Clean up braces
    .replace(/[{}]/g, '')
    // Clean up multiple whitespaces and newlines
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n+/g, '\n')
    // Trim whitespace
    .trim();

  return cleanedContent;
};

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
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
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
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
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
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
  }, [document?.content, keywords, highlightEnabled, onKeywordCountsUpdate]);

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

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{document.filename || 'Untitled'}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{document.uploadDate?.toLocaleDateString() || 'Unknown date'}</span>
                </div>
                <span>{(document.content?.length || 0).toLocaleString()} characters</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleExport}
            variant="outline"
            className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200"
            type="button"
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
