
import React, { useCallback } from 'react';
import { DocumentData, Keyword } from '@/types';
import { SearchControls } from './SearchControls';
import { DocumentHeader } from './DocumentHeader';
import { VirtualizedList } from './VirtualizedList';
import { useVirtualizedDocument } from '@/hooks/useVirtualizedDocument';
import { getDocumentStats } from '@/utils/fileTypeUtils';

interface VirtualizedDocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  caseSensitive: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

export const VirtualizedDocumentViewer: React.FC<VirtualizedDocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
  caseSensitive,
  onKeywordCountsUpdate
}) => {
  const {
    lines,
    searchQuery,
    searchMatches,
    currentMatchIndex,
    handleSearch,
    handleSearchNavigate,
    handleSearchClear
  } = useVirtualizedDocument({
    document,
    keywords,
    caseSensitive,
    onKeywordCountsUpdate
  });

  const handleExport = useCallback(() => {
    if (!document?.content || !document?.filename) return;
    
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `analyzed_${document.filename}`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
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

      <VirtualizedList
        lines={lines}
        keywords={keywords}
        highlightEnabled={highlightEnabled}
        caseSensitive={caseSensitive}
        searchQuery={searchQuery}
      />
    </div>
  );
};
