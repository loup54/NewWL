
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentData, Keyword } from '@/pages/Index';
import { DocumentViewer } from './DocumentViewer';
import { VirtualizedDocumentViewer } from './VirtualizedDocumentViewer';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { performanceMonitor, debounce } from '@/utils/performanceUtils';
import { documentCache, createCacheKey } from '@/utils/cacheUtils';
import { LoadingState } from './LoadingStates';

interface OptimizedDocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  caseSensitive: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

const LARGE_DOCUMENT_THRESHOLD = 50000; // 50KB
const VIRTUALIZATION_THRESHOLD = 10000; // 10KB

export const OptimizedDocumentViewer: React.FC<OptimizedDocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
  caseSensitive,
  onKeywordCountsUpdate
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldUseVirtualization, setShouldUseVirtualization] = useState(false);
  
  const { elementRef, isVisible } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Determine if we should use virtualization based on document size
  useEffect(() => {
    if (!document?.content) return;
    
    const contentSize = new Blob([document.content]).size;
    setShouldUseVirtualization(contentSize > VIRTUALIZATION_THRESHOLD);
  }, [document?.content]);

  // Debounced keyword processing for performance
  const debouncedKeywordUpdate = useMemo(
    () => debounce(onKeywordCountsUpdate, 300),
    [onKeywordCountsUpdate]
  );

  // Cache key for processed content
  const cacheKey = useMemo(() => {
    if (!document) return '';
    return createCacheKey(
      'processed-content',
      document.filename || 'unknown',
      keywords.map(k => k.word).join(','),
      highlightEnabled.toString(),
      caseSensitive.toString()
    );
  }, [document, keywords, highlightEnabled, caseSensitive]);

  // Check cache before processing
  useEffect(() => {
    if (!cacheKey) return;
    
    const cached = documentCache.get(cacheKey);
    if (cached) {
      debouncedKeywordUpdate(cached as Record<string, number>);
      return;
    }
    
    // Process and cache if not found
    setIsProcessing(true);
    performanceMonitor.startTiming('document-processing');
    
    // Simulate processing time for large documents
    const timer = setTimeout(() => {
      performanceMonitor.endTiming('document-processing');
      setIsProcessing(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [cacheKey, debouncedKeywordUpdate]);

  const handleKeywordCountsUpdate = useCallback((counts: Record<string, number>) => {
    if (cacheKey) {
      documentCache.set(cacheKey, counts);
    }
    debouncedKeywordUpdate(counts);
  }, [cacheKey, debouncedKeywordUpdate]);

  if (!document) {
    return <div>No document loaded</div>;
  }

  // Show loading state for large documents
  if (isProcessing && document.content.length > LARGE_DOCUMENT_THRESHOLD) {
    return (
      <LoadingState 
        type="processing" 
        message="Optimizing document for viewing..."
      />
    );
  }

  // Use lazy loading for better initial page load
  if (!isVisible) {
    return (
      <div ref={elementRef as React.RefObject<HTMLDivElement>} className="h-full flex items-center justify-center">
        <LoadingState type="processing" message="Loading document..." />
      </div>
    );
  }

  // Choose appropriate viewer based on document size
  if (shouldUseVirtualization) {
    return (
      <VirtualizedDocumentViewer
        document={document}
        keywords={keywords}
        highlightEnabled={highlightEnabled}
        caseSensitive={caseSensitive}
        onKeywordCountsUpdate={handleKeywordCountsUpdate}
      />
    );
  }

  return (
    <DocumentViewer
      document={document}
      keywords={keywords}
      highlightEnabled={highlightEnabled}
      caseSensitive={caseSensitive}
      onKeywordCountsUpdate={handleKeywordCountsUpdate}
    />
  );
};
