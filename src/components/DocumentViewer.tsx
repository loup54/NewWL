import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Calendar, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Keyword, DocumentData } from '@/pages/Index';

interface DocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

const getFileType = (filename: string): { type: string; icon: string } => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  const fileTypes: Record<string, { type: string; icon: string }> = {
    'txt': { type: 'Plain Text', icon: '📄' },
    'html': { type: 'HTML Document', icon: '🌐' },
    'htm': { type: 'HTML Document', icon: '🌐' },
    'md': { type: 'Markdown', icon: '📝' },
    'markdown': { type: 'Markdown', icon: '📝' },
    'rtf': { type: 'Rich Text Format', icon: '📄' },
    'csv': { type: 'CSV Data', icon: '📊' },
    'json': { type: 'JSON Data', icon: '🔧' },
    'xml': { type: 'XML Document', icon: '📋' },
    'js': { type: 'JavaScript', icon: '⚡' },
    'jsx': { type: 'React JavaScript', icon: '⚛️' },
    'ts': { type: 'TypeScript', icon: '🔷' },
    'tsx': { type: 'React TypeScript', icon: '⚛️' },
    'py': { type: 'Python', icon: '🐍' },
    'java': { type: 'Java', icon: '☕' },
    'cpp': { type: 'C++', icon: '⚙️' },
    'c': { type: 'C', icon: '⚙️' },
    'css': { type: 'CSS Stylesheet', icon: '🎨' },
    'php': { type: 'PHP', icon: '🐘' },
    'rb': { type: 'Ruby', icon: '💎' },
    'go': { type: 'Go', icon: '🚀' },
    'rs': { type: 'Rust', icon: '🦀' },
    'yml': { type: 'YAML Config', icon: '⚙️' },
    'yaml': { type: 'YAML Config', icon: '⚙️' },
    'log': { type: 'Log File', icon: '📜' },
    'ini': { type: 'Config File', icon: '⚙️' },
    'cfg': { type: 'Config File', icon: '⚙️' },
    'conf': { type: 'Config File', icon: '⚙️' }
  };

  return fileTypes[extension] || { type: 'Text Document', icon: '📄' };
};

const getDocumentStats = (content: string) => {
  if (!content) return { characters: 0, words: 0, lines: 0 };
  
  const characters = content.length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lines = content.split('\n').length;
  
  return { characters, words, lines };
};

const cleanRTFContent = (content: string): string => {
  if (!content) return '';
  
  // Remove RTF control codes and formatting
  let cleanedContent = content
    // Remove RTF header and version info
    .replace(/\\rtf\d+/g, '')
    .replace(/\\ansi/g, '')
    .replace(/\\ansicpg\d+/g, '')
    .replace(/\\cocoartf\d+/g, '')
    .replace(/\\deff\d+/g, '')
    .replace(/\\deflang\d+/g, '')
    .replace(/\\uc\d+/g, '')
    .replace(/\\margl\d+/g, '')
    .replace(/\\margr\d+/g, '')
    .replace(/\\margt\d+/g, '')
    .replace(/\\margb\d+/g, '')
    // Remove font table and color table
    .replace(/\\fonttbl[^}]*}/g, '')
    .replace(/\\colortbl[^}]*}/g, '')
    .replace(/\\stylesheet[^}]*}/g, '')
    .replace(/\\info[^}]*}/g, '')
    .replace(/\\generator[^}]*}/g, '')
    // Remove font formatting
    .replace(/\\f\d+/g, '')
    .replace(/\\fs\d+/g, '')
    .replace(/\\cf\d+/g, '')
    .replace(/\\cb\d+/g, '')
    .replace(/\\highlight\d+/g, '')
    .replace(/\\chcbpat\d+/g, '')
    .replace(/\\chcfpat\d+/g, '')
    // Remove paragraph formatting
    .replace(/\\par\b/g, '\n')
    .replace(/\\pard/g, '')
    .replace(/\\pardeftab\d+/g, '')
    .replace(/\\sl\d+/g, '')
    .replace(/\\slmult\d+/g, '')
    .replace(/\\sb\d+/g, '')
    .replace(/\\sa\d+/g, '')
    .replace(/\\fi\d+/g, '')
    .replace(/\\li\d+/g, '')
    .replace(/\\ri\d+/g, '')
    .replace(/\\qc/g, '')
    .replace(/\\ql/g, '')
    .replace(/\\qr/g, '')
    .replace(/\\qj/g, '')
    // Remove text formatting
    .replace(/\\b\b/g, '')
    .replace(/\\b0/g, '')
    .replace(/\\i\b/g, '')
    .replace(/\\i0/g, '')
    .replace(/\\ul\b/g, '')
    .replace(/\\ulnone/g, '')
    .replace(/\\strike\b/g, '')
    .replace(/\\striked\d+/g, '')
    .replace(/\\scaps/g, '')
    .replace(/\\caps/g, '')
    .replace(/\\outl/g, '')
    .replace(/\\shad/g, '')
    // Remove special characters and spacing
    .replace(/\\tab/g, '\t')
    .replace(/\\line/g, '\n')
    .replace(/\\page/g, '\n\n')
    .replace(/\\sect/g, '')
    .replace(/\\sectd/g, '')
    .replace(/\\endash/g, '–')
    .replace(/\\emdash/g, '—')
    .replace(/\\lquote/g, "'")
    .replace(/\\rquote/g, "'")
    .replace(/\\ldblquote/g, '"')
    .replace(/\\rdblquote/g, '"')
    .replace(/\\bullet/g, '•')
    // Remove Unicode sequences
    .replace(/\\u\d+\\?/g, '')
    .replace(/\\u-?\d+/g, '')
    // Remove remaining control words with parameters
    .replace(/\\[a-zA-Z]+\d+/g, '')
    // Remove remaining control words without parameters
    .replace(/\\[a-zA-Z]+/g, '')
    // Remove remaining control symbols
    .replace(/\\[^a-zA-Z\s\n]/g, '')
    // Clean up braces and extra formatting
    .replace(/[{}]/g, '')
    .replace(/\\\\/g, '\\')
    // Clean up whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    // Final trim
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

  const fileType = getFileType(document.filename || '');
  const stats = getDocumentStats(document.content || '');

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
                <div className="flex items-center space-x-1">
                  <span>{fileType.icon}</span>
                  <span>{fileType.type}</span>
                </div>
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
        
        {/* Document Stats */}
        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-1">
            <Info className="w-4 h-4" />
            <span className="font-medium">Document Stats:</span>
          </div>
          <span>{stats.characters.toLocaleString()} characters</span>
          <span>{stats.words.toLocaleString()} words</span>
          <span>{stats.lines.toLocaleString()} lines</span>
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
