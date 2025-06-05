
import React, { useCallback } from 'react';
import { Keyword } from '@/types';

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

export const LineItem: React.FC<LineItemProps> = ({ index, style, data }) => {
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
