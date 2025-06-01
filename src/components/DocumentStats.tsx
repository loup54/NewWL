
import React from 'react';
import { Info } from 'lucide-react';

interface DocumentStatsProps {
  characters: number;
  words: number;
  lines: number;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({ characters, words, lines }) => {
  return (
    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg p-3">
      <div className="flex items-center space-x-1">
        <Info className="w-4 h-4" />
        <span className="font-medium">Document Stats:</span>
      </div>
      <span>{characters.toLocaleString()} characters</span>
      <span>{words.toLocaleString()} words</span>
      <span>{lines.toLocaleString()} lines</span>
    </div>
  );
};
