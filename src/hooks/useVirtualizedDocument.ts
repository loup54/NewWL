
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentData, Keyword } from '@/pages/Index';
import { cleanRTFContent } from '@/utils/contentProcessor';

interface UseVirtualizedDocumentProps {
  document: DocumentData;
  keywords: Keyword[];
  caseSensitive: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

export const useVirtualizedDocument = ({
  document,
  keywords,
  caseSensitive,
  onKeywordCountsUpdate
}: UseVirtualizedDocumentProps) => {
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

  return {
    lines,
    searchQuery,
    searchMatches,
    currentMatchIndex,
    handleSearch,
    handleSearchNavigate,
    handleSearchClear
  };
};
