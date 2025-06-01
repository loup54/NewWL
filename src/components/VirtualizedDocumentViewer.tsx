
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DocumentData, Keyword } from '@/pages/Index';
import { cleanRTFContent } from '@/utils/contentProcessor';
import { SearchControls } from './SearchControls';
import { DocumentHeader } from './DocumentHeader';
import { getDocumentStats } from '@/utils/fileTypeUtils';

interface VirtualizedDocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  caseSensitive: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

interface LineItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    lines: string[];
    keywords: Keyword[];
    highlightEnabled: boolean;
    caseSensitive: boolean;
    searchQuery: string;
  };
}

const LineItem: React.FC<LineItemProps> = ({ index, style, data }) => {
  const { lines, keywords, highlightEnabled, caseSensitive, searchQuery } = data;
  const line = lines[index];

  const processLine = useCallback((content: string) => {
    let processedContent = content;

    // Process keywords
    if (highlightEnabled && keywords.length > 0) {
      keywords.forEach(keyword => {
        if (!keyword?.word) return;
        
        try {
          const escapedKeyword = keyword.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regexFlags = caseSensitive ? 'g' : 'gi';
          const regex = new RegExp(`\\b${escapedKeyword}\\b`, regexFlags);

          if (regex.test(processedContent) && keyword.color) {
            processedContent = processedContent.replace(
              regex,
              `<mark style="background-color: ${keyword.color}; padding: 2px 4px; border-radius: 3px; color: #000;">$&</mark>`
            );
          }
        } catch (error) {
          console.error('Regex error for keyword:', keyword.word, error);
        }
      });
    }

    // Process search highlighting
    if (searchQuery) {
      try {
        const escapedSearch = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedSearch, 'gi');
        
        processedContent = processedContent.replace(
          searchRegex,
          `<span class="search-highlight" style="background-color: #ffeb3b; padding: 1px 2px; border-radius: 2px; border: 1px solid #fbc02d;">$&</span>`
        );
      } catch (error) {
        console.error('Search regex error:', error);
      }
    }

    return processedContent;
  }, [keywords, highlightEnabled, caseSensitive, searchQuery]);

  return (
    <div style={style} className="px-6 py-1">
      <div
        className="text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: processLine(line) }}
        style={{ fontSize: '16px', lineHeight: '1.8' }}
      />
    </div>
  );
};

export const VirtualizedDocumentViewer: React.FC<VirtualizedDocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
  caseSensitive,
  onKeywordCountsUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Split content into lines for virtualization
  const lines = useMemo(() => {
    if (!document?.content) return [];
    const cleanedContent = cleanRTFContent(document.content);
    return cleanedContent.split('\n').filter(line => line.trim().length > 0);
  }, [document?.content]);

  // Calculate keyword counts
  useEffect(() => {
    if (!document?.content || !Array.isArray(keywords)) {
      onKeywordCountsUpdate({});
      return;
    }

    const cleanedContent = cleanRTFContent(document.content);
    const counts: Record<string, number> = {};

    keywords.forEach(keyword => {
      if (!keyword?.word) return;
      
      try {
        const escapedKeyword = keyword.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexFlags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, regexFlags);
        const matches = cleanedContent.match(regex) || [];
        counts[keyword.word] = matches.length;
      } catch (error) {
        console.error('Regex error for keyword:', keyword.word, error);
        counts[keyword.word] = 0;
      }
    });

    onKeywordCountsUpdate(counts);
  }, [document?.content, keywords, caseSensitive, onKeywordCountsUpdate]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentMatchIndex(0);
    
    if (query && lines.length > 0) {
      const matches: number[] = [];
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedQuery, 'gi');
      
      lines.forEach((line, index) => {
        if (searchRegex.test(line)) {
          matches.push(index);
        }
      });
      
      setSearchMatches(matches);
    } else {
      setSearchMatches([]);
    }
  }, [lines]);

  const handleSearchNavigate = useCallback((direction: 'next' | 'prev') => {
    if (searchMatches.length === 0) return;
    
    if (direction === 'next') {
      setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
    } else {
      setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
    }
  }, [searchMatches.length]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setSearchMatches([]);
    setCurrentMatchIndex(0);
  }, []);

  const handleExport = useCallback(() => {
    if (!document?.content || !document?.filename) return;
    
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyzed_${document.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

      <div className="p-4 border-b border-gray-200">
        <SearchControls
          onSearch={handleSearch}
          onNavigate={handleSearchNavigate}
          onClear={handleSearchClear}
          currentMatch={currentMatchIndex + 1}
          totalMatches={searchMatches.length}
          isSearchActive={!!searchQuery}
        />
      </div>

      <div className="flex-1">
        <List
          height={600}
          itemCount={lines.length}
          itemSize={32}
          itemData={{
            lines,
            keywords,
            highlightEnabled,
            caseSensitive,
            searchQuery
          }}
        >
          {LineItem}
        </List>
      </div>
    </div>
  );
};
