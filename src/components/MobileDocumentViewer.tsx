import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { DocumentData, Keyword } from '@/types';

interface MobileDocumentViewerProps {
  document: DocumentData;
  keywords: Keyword[];
  highlightEnabled: boolean;
  caseSensitive: boolean;
  onKeywordCountsUpdate: (counts: Record<string, number>) => void;
}

export const MobileDocumentViewer: React.FC<MobileDocumentViewerProps> = ({
  document,
  keywords,
  highlightEnabled,
  caseSensitive,
  onKeywordCountsUpdate
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showControls, setShowControls] = useState(true);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  const swipeRef = useSwipeGesture({
    onSwipeUp: () => setShowControls(false),
    onSwipeDown: () => setShowControls(true),
  });

  // Highlight keywords in content
  const highlightContent = (content: string) => {
    if (!highlightEnabled || keywords.length === 0) return content;

    let highlightedContent = content;
    const counts: Record<string, number> = {};

    keywords.forEach(keyword => {
      const regex = new RegExp(
        `\\b${keyword.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
        caseSensitive ? 'g' : 'gi'
      );
      
      const matches = content.match(regex) || [];
      counts[keyword.word] = matches.length;

      highlightedContent = highlightedContent.replace(regex, (match) => 
        `<mark style="background-color: ${keyword.color}40; color: ${keyword.color}; padding: 2px 4px; border-radius: 3px; font-weight: 500;">${match}</mark>`
      );
    });

    onKeywordCountsUpdate(counts);
    return highlightedContent;
  };

  return (
    <div className="relative h-full" ref={swipeRef}>
      {/* Mobile Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="touch-manipulation"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
              {zoomLevel}%
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="touch-manipulation"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowControls(false)}
            className="text-gray-500"
          >
            Hide
          </Button>
        </div>
      )}

      {/* Document Content */}
      <div 
        className="h-full overflow-auto p-4 pt-16"
        style={{ fontSize: `${zoomLevel}%` }}
      >
        <Card className="p-6 bg-white shadow-sm">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{document.filename}</h2>
            <p className="text-sm text-gray-500">
              Uploaded: {document.uploadDate.toLocaleDateString()}
            </p>
          </div>
          
          <div
            className="prose prose-sm max-w-none leading-relaxed select-text"
            dangerouslySetInnerHTML={{ 
              __html: highlightContent(document.content) 
            }}
          />
        </Card>
      </div>

      {/* Swipe Hint */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          Swipe up to hide controls
        </div>
      )}
    </div>
  );
};
