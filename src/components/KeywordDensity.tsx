import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Keyword, DocumentData } from '@/types';

interface KeywordDensityProps {
  keywords: Keyword[];
  document: DocumentData;
}

export const KeywordDensity: React.FC<KeywordDensityProps> = ({
  keywords,
  document
}) => {
  const totalWords = document?.content ? document.content.trim().split(/\s+/).length : 0;
  
  const keywordsWithDensity = keywords
    .filter(k => k.count > 0)
    .map(keyword => ({
      ...keyword,
      density: totalWords > 0 ? ((keyword.count / totalWords) * 100) : 0
    }))
    .sort((a, b) => b.density - a.density);

  if (keywordsWithDensity.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No keywords found to analyze density</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Keyword Density</span>
      </div>

      <div className="space-y-2">
        {keywordsWithDensity.slice(0, 5).map((keyword) => (
          <div key={keyword.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: keyword.color }}
                />
                <span className="font-medium">{keyword.word}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{keyword.count}</span>
                <span className="text-xs">({keyword.density.toFixed(2)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: keyword.color,
                  width: `${Math.min(keyword.density * 10, 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <div>Total words: {totalWords.toLocaleString()}</div>
        <div>Top 5 keywords by density shown</div>
      </div>
    </div>
  );
};
